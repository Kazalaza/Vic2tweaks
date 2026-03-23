import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Preset } from '@/types';

export const PresetCard = ({ preset, onLoad, onDelete }: { preset: Preset; onLoad: () => void; onDelete: () => void }) => (
  <Card className="space-y-3">
    <div>
      <h3 className="font-semibold">{preset.name}</h3>
      <p className="text-xs text-muted">{preset.enabledModIds.length} enabled mods</p>
    </div>
    <div className="flex gap-2">
      <Button onClick={onLoad}>Load Preset</Button>
      {!['vanilla', 'quick-launch', 'last-session'].includes(preset.id) && (
        <Button variant="secondary" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
      )}
    </div>
  </Card>
);
