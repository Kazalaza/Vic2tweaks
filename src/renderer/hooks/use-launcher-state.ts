import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { LauncherState, Preset, Settings } from '@/types';

export const useLauncherState = () => {
  const [state, setState] = useState<LauncherState | null>(null);
  const [enabledModIds, setEnabledModIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    window.launcherApi
      .initialize()
      .then((data) => {
        setState(data);
        setEnabledModIds(data.lastSession.enabledModIds);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  const filteredMods = useMemo(() => {
    const needle = search.toLowerCase();
    return (state?.mods ?? []).filter((mod) => `${mod.name} ${mod.author ?? ''}`.toLowerCase().includes(needle));
  }, [state?.mods, search]);

  const updateSettings = async (partial: Partial<Settings>) => {
    if (!state) return;
    const settings = await window.launcherApi.updateSettings(partial);
    setState({ ...state, settings });
  };

  const loadPreset = (preset: Preset) => {
    setEnabledModIds(preset.enabledModIds);
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const savePreset = async (name: string, launchArgs = '') => {
    if (!state) return;
    const presets = await window.launcherApi.savePreset({ name, enabledModIds, launchArgs });
    setState({ ...state, presets: [...presets, ...state.presets.filter((x) => ['vanilla', 'quick-launch', 'last-session'].includes(x.id))] });
    toast.success(`Saved preset: ${name}`);
  };

  const launch = async () => {
    if (!state?.settings.gamePath) {
      toast.error('Game path is not set.');
      return;
    }
    const result = await window.launcherApi.launchGame({ enabledModIds });
    toast.success(`Launching with args: ${result.args || '(none)'}`);
  };

  return {
    state,
    enabledModIds,
    setEnabledModIds,
    filteredMods,
    search,
    setSearch,
    updateSettings,
    loadPreset,
    savePreset,
    launch
  };
};
