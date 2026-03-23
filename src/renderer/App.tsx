import { useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Sidebar, type TabKey } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { HomePage } from '@/pages/home-page';
import { ModsPage } from '@/pages/mods-page';
import { PresetsPage } from '@/pages/presets-page';
import { DlcsPage } from '@/pages/dlcs-page';
import { SettingsPage } from '@/pages/settings-page';
import { AboutPage } from '@/pages/about-page';
import { useLauncherState } from '@/hooks/use-launcher-state';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const { state, enabledModIds, setEnabledModIds, filteredMods, search, setSearch, updateSettings, loadPreset, savePreset, launch } = useLauncherState();

  const currentVersion = useMemo(() => '3.04 (detected)', []);

  if (!state) return <div className="grid h-screen place-items-center">Loading launcher...</div>;

  const toggleMod = (id: string) => {
    setEnabledModIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const continueLastSession = () => {
    setEnabledModIds(state.lastSession.enabledModIds);
    toast.success('Last session loaded');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 overflow-auto p-6">
        <TopBar gameVersion={currentVersion} modCount={enabledModIds.length} onPlay={launch} onContinue={continueLastSession} />

        {activeTab === 'home' && <HomePage gamePath={state.settings.gamePath} mods={state.mods.length} dlcs={state.dlcs.length} />}
        {activeTab === 'mods' && <ModsPage mods={filteredMods} enabledModIds={enabledModIds} toggleMod={toggleMod} search={search} setSearch={setSearch} />}
        {activeTab === 'presets' && (
          <PresetsPage
            presets={state.presets}
            onLoad={loadPreset}
            onDelete={async (id) => {
              const presets = await window.launcherApi.deletePreset(id);
              toast.success('Preset removed');
              location.reload();
              return presets;
            }}
            onSave={savePreset}
          />
        )}
        {activeTab === 'dlcs' && <DlcsPage dlcs={state.dlcs} />}
        {activeTab === 'settings' && (
          <SettingsPage
            settings={state.settings}
            onUpdate={updateSettings}
            onPickFolder={async () => {
              const folder = await window.launcherApi.pickFolder();
              if (folder) {
                await updateSettings({ gamePath: folder });
                toast.success('Game path updated');
              }
            }}
            onVerify={() => void window.launcherApi.verifyGameFiles()}
          />
        )}
        {activeTab === 'about' && <AboutPage />}
      </main>
      <Toaster richColors />
    </div>
  );
};

export default App;
