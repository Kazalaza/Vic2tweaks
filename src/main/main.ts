import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'fs-extra';
import Store from 'electron-store';
import Registry from 'winreg';

type ModInfo = {
  id: string;
  name: string;
  path: string;
  modFilePath: string;
  author?: string;
  description?: string;
  picture?: string;
  dependencies?: string[];
  supportedVersion?: string;
};

type Preset = {
  id: string;
  name: string;
  enabledModIds: string[];
  launchArgs: string;
  createdAt: string;
};

type Settings = {
  gamePath: string;
  preferSteamLaunch: boolean;
  closeOnLaunch: boolean;
  customLaunchArgs: string;
  resolutionPreset: string;
  steamOverlay: boolean;
};

type Persisted = {
  settings: Settings;
  presets: Preset[];
  lastSession: { enabledModIds: string[]; launchArgs: string };
};

const defaultData: Persisted = {
  settings: {
    gamePath: '',
    preferSteamLaunch: true,
    closeOnLaunch: false,
    customLaunchArgs: '',
    resolutionPreset: '1920x1080',
    steamOverlay: true
  },
  presets: [
    { id: 'vanilla', name: 'Vanilla', enabledModIds: [], launchArgs: '', createdAt: new Date().toISOString() },
    { id: 'quick-launch', name: 'Quick Launch', enabledModIds: [], launchArgs: '', createdAt: new Date().toISOString() }
  ],
  lastSession: {
    enabledModIds: [],
    launchArgs: ''
  }
};

const store = new Store<Persisted>({ defaults: defaultData, name: 'victoria2-launcher' });

const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    autoHideMenuBar: true,
    backgroundColor: '#090b12',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false
    }
  });

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
};

const getRegistryValue = (regPath: string, key: string): Promise<string | null> => {
  const regKey = new Registry({ hive: Registry.HKLM, key: regPath });
  return new Promise((resolve) => {
    regKey.get(key, (err, item) => {
      if (err || !item?.value) resolve(null);
      else resolve(item.value);
    });
  });
};

const detectGamePath = async (): Promise<string | null> => {
  const direct = await getRegistryValue('\\SOFTWARE\\WOW6432Node\\Paradox Interactive\\Victoria II', 'path');
  if (direct && (await fs.pathExists(path.join(direct, 'v2game.exe')))) return direct;

  const steamPath =
    (await getRegistryValue('\\SOFTWARE\\WOW6432Node\\Valve\\Steam', 'InstallPath')) ||
    (await getRegistryValue('\\SOFTWARE\\Valve\\Steam', 'InstallPath'));

  if (!steamPath) return null;

  const candidate = path.join(steamPath, 'steamapps', 'common', 'Victoria 2');
  if (await fs.pathExists(path.join(candidate, 'v2game.exe'))) return candidate;

  const candidateAlt = path.join(steamPath, 'steamapps', 'common', 'Victoria II');
  if (await fs.pathExists(path.join(candidateAlt, 'v2game.exe'))) return candidateAlt;

  return null;
};

const parseModFile = async (modFile: string): Promise<ModInfo | null> => {
  const raw = await fs.readFile(modFile, 'utf8');
  const lines = raw.split(/\r?\n/);
  const data: Record<string, string> = {};

  for (const line of lines) {
    const match = line.match(/^\s*([\w_]+)\s*=\s*"?([^"\n]+)"?/);
    if (match) data[match[1].toLowerCase()] = match[2].trim();
  }

  const name = data['name'] ?? path.basename(modFile, '.mod');
  const directory = data['path'] ? path.resolve(path.dirname(modFile), data['path']) : path.dirname(modFile);

  return {
    id: `${name}:${modFile}`,
    name,
    modFilePath: modFile,
    path: directory,
    author: data['author'],
    description: data['description'],
    picture: data['picture'] ? path.resolve(path.dirname(modFile), data['picture']) : undefined,
    dependencies: data['dependencies']?.split(/[;,]/).map((x) => x.trim()),
    supportedVersion: data['supported_version'] ?? data['supportedversion']
  };
};

const getModDirectories = async (): Promise<string[]> => {
  const userProfile = process.env.USERPROFILE || app.getPath('home');
  const docsDir = path.join(userProfile, 'Documents', 'Paradox Interactive', 'Victoria II', 'mod');
  const gamePath = store.get('settings').gamePath;
  const gameModDir = gamePath ? path.join(gamePath, 'mod') : '';
  return [docsDir, gameModDir].filter(Boolean);
};

const scanMods = async (): Promise<ModInfo[]> => {
  const dirs = await getModDirectories();
  const mods: ModInfo[] = [];
  for (const dir of dirs) {
    if (!(await fs.pathExists(dir))) continue;
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      if (!entry.endsWith('.mod')) continue;
      const parsed = await parseModFile(path.join(dir, entry));
      if (parsed) mods.push(parsed);
    }
  }
  return mods;
};

const detectDlcs = async (): Promise<string[]> => {
  const gamePath = store.get('settings').gamePath;
  if (!gamePath) return [];
  const dlcDir = path.join(gamePath, 'dlc');
  if (!(await fs.pathExists(dlcDir))) return [];
  const entries = await fs.readdir(dlcDir);
  return entries.filter((f) => f.endsWith('.zip') || f.endsWith('.dlc'));
};

ipcMain.handle('launcher:initialize', async () => {
  const settings = store.get('settings');
  if (!settings.gamePath) {
    const detected = await detectGamePath();
    if (detected) {
      store.set('settings.gamePath', detected);
    }
  }

  const lastSessionPreset: Preset = {
    id: 'last-session',
    name: 'Last Session',
    enabledModIds: store.get('lastSession').enabledModIds,
    launchArgs: store.get('lastSession').launchArgs,
    createdAt: new Date().toISOString()
  };

  return {
    settings: store.get('settings'),
    presets: [...store.get('presets').filter((p) => p.id !== 'last-session'), lastSessionPreset],
    lastSession: store.get('lastSession'),
    mods: await scanMods(),
    dlcs: await detectDlcs()
  };
});

ipcMain.handle('launcher:pickFolder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled || result.filePaths.length === 0) return null;
  const folder = result.filePaths[0];
  store.set('settings.gamePath', folder);
  return folder;
});

ipcMain.handle('launcher:updateSettings', async (_, partial: Partial<Settings>) => {
  store.set('settings', { ...store.get('settings'), ...partial });
  return store.get('settings');
});

ipcMain.handle('launcher:savePreset', async (_, preset: Omit<Preset, 'id' | 'createdAt'>) => {
  const newPreset: Preset = { ...preset, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  store.set('presets', [...store.get('presets').filter((p) => !['vanilla', 'quick-launch'].includes(p.id)), newPreset]);
  return store.get('presets');
});

ipcMain.handle('launcher:deletePreset', async (_, presetId: string) => {
  store.set('presets', store.get('presets').filter((p) => p.id !== presetId));
  return store.get('presets');
});

ipcMain.handle('launcher:launchGame', async (_, payload: { enabledModIds: string[]; launchArgs?: string }) => {
  const settings = store.get('settings');
  if (!settings.gamePath) throw new Error('Game path not set.');

  const mods = await scanMods();
  const enabled = mods.filter((m) => payload.enabledModIds.includes(m.id)).map((m) => path.basename(m.modFilePath));
  const modArg = enabled.length ? `-mod=${enabled.join(';')}` : '';
  const mergedArgs = [modArg, settings.customLaunchArgs, payload.launchArgs].filter(Boolean).join(' ').trim();

  if (settings.preferSteamLaunch) {
    const steamUrl = `steam://run/42960//${encodeURIComponent(mergedArgs)}`;
    await shell.openExternal(steamUrl);
  } else {
    const executable = path.join(settings.gamePath, 'v2game.exe');
    spawn(executable, mergedArgs ? mergedArgs.split(' ') : [], {
      cwd: settings.gamePath,
      detached: true,
      stdio: 'ignore'
    }).unref();
  }

  store.set('lastSession', { enabledModIds: payload.enabledModIds, launchArgs: payload.launchArgs ?? '' });

  if (settings.closeOnLaunch) {
    BrowserWindow.getAllWindows().forEach((w) => w.close());
  } else {
    BrowserWindow.getAllWindows().forEach((w) => w.minimize());
  }

  return { success: true, args: mergedArgs };
});

ipcMain.handle('launcher:verifyGameFiles', async () => shell.openExternal('steam://validate/42960'));

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
