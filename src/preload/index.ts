import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('launcherApi', {
  initialize: () => ipcRenderer.invoke('launcher:initialize'),
  pickFolder: () => ipcRenderer.invoke('launcher:pickFolder'),
  updateSettings: (partial: unknown) => ipcRenderer.invoke('launcher:updateSettings', partial),
  savePreset: (preset: unknown) => ipcRenderer.invoke('launcher:savePreset', preset),
  deletePreset: (presetId: string) => ipcRenderer.invoke('launcher:deletePreset', presetId),
  launchGame: (payload: unknown) => ipcRenderer.invoke('launcher:launchGame', payload),
  verifyGameFiles: () => ipcRenderer.invoke('launcher:verifyGameFiles')
});
