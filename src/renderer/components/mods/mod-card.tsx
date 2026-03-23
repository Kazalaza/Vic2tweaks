import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import type { ModInfo } from '@/types';

export const ModCard = ({ mod, enabled, onToggle }: { mod: ModInfo; enabled: boolean; onToggle: () => void }) => (
  <Card className="flex items-start gap-4 transition hover:border-accent/50 hover:bg-[#12182a]">
    <Checkbox checked={enabled} onCheckedChange={onToggle} />
    {mod.picture ? <img src={`file://${mod.picture}`} className="h-16 w-16 rounded object-cover" /> : <div className="h-16 w-16 rounded bg-[#1c2336]" />}
    <div className="flex-1">
      <h3 className="font-semibold">{mod.name}</h3>
      <p className="line-clamp-2 text-sm text-muted">{mod.description ?? 'No description available.'}</p>
      <p className="mt-1 text-xs text-muted">{mod.author ?? 'Unknown author'} • {mod.supportedVersion ?? 'Unknown version'}</p>
    </div>
  </Card>
);
