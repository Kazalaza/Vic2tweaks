/// <reference types="vite/client" />

import type { LauncherState, Preset, Settings } from './types';

declare global {
  interface Window {
    launcherApi: {
      initialize: () => Promise<LauncherState>;
      pickFolder: () => Promise<string | null>;
      updateSettings: (partial: Partial<Settings>) => Promise<Settings>;
      savePreset: (preset: Omit<Preset, 'id' | 'createdAt'>) => Promise<Preset[]>;
      deletePreset: (presetId: string) => Promise<Preset[]>;
      launchGame: (payload: { enabledModIds: string[]; launchArgs?: string }) => Promise<{ success: boolean; args: string }>;
      verifyGameFiles: () => Promise<void>;
    };
  }
}

export {};
