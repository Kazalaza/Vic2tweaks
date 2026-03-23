import { useState } from 'react';
import { PresetCard } from '@/components/presets/preset-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Preset } from '@/types';

export const PresetsPage = ({ presets, onLoad, onDelete, onSave }: { presets: Preset[]; onLoad: (preset: Preset) => void; onDelete: (id: string) => void; onSave: (name: string) => void }) => {
  const [name, setName] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Preset name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={() => { if (name.trim()) { onSave(name.trim()); setName(''); } }}>Save Preset</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {presets.map((preset) => (
          <PresetCard key={preset.id} preset={preset} onLoad={() => onLoad(preset)} onDelete={() => onDelete(preset.id)} />
        ))}
      </div>
    </div>
  );
};
