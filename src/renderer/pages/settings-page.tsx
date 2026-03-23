import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Settings } from '@/types';

export const SettingsPage = ({ settings, onUpdate, onPickFolder, onVerify }: { settings: Settings; onUpdate: (partial: Partial<Settings>) => void; onPickFolder: () => void; onVerify: () => void }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm text-muted">Game installation path</label>
      <div className="flex gap-2">
        <Input value={settings.gamePath} readOnly />
        <Button variant="secondary" onClick={onPickFolder}>Browse</Button>
      </div>
    </div>

    <div className="grid gap-2 md:grid-cols-2">
      <Button variant={settings.preferSteamLaunch ? 'default' : 'secondary'} onClick={() => onUpdate({ preferSteamLaunch: !settings.preferSteamLaunch })}>
        Steam Launch: {settings.preferSteamLaunch ? 'On' : 'Off'}
      </Button>
      <Button variant={settings.closeOnLaunch ? 'default' : 'secondary'} onClick={() => onUpdate({ closeOnLaunch: !settings.closeOnLaunch })}>
        Close on Launch: {settings.closeOnLaunch ? 'On' : 'Off'}
      </Button>
      <Button variant={settings.steamOverlay ? 'default' : 'secondary'} onClick={() => onUpdate({ steamOverlay: !settings.steamOverlay })}>
        Steam Overlay: {settings.steamOverlay ? 'On' : 'Off'}
      </Button>
      <Button variant="secondary" onClick={onVerify}>Verify Game Files</Button>
    </div>

    <div className="space-y-2">
      <label className="text-sm text-muted">Custom launch arguments</label>
      <Input value={settings.customLaunchArgs} onChange={(e) => onUpdate({ customLaunchArgs: e.target.value })} />
    </div>
  </div>
);
