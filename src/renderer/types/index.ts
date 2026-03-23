export type ModInfo = {
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

export type Preset = {
  id: string;
  name: string;
  enabledModIds: string[];
  launchArgs: string;
  createdAt: string;
};

export type Settings = {
  gamePath: string;
  preferSteamLaunch: boolean;
  closeOnLaunch: boolean;
  customLaunchArgs: string;
  resolutionPreset: string;
  steamOverlay: boolean;
};

export type LauncherState = {
  settings: Settings;
  presets: Preset[];
  lastSession: { enabledModIds: string[]; launchArgs: string };
  mods: ModInfo[];
  dlcs: string[];
};
