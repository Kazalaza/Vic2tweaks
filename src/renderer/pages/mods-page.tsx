import { Scrollable } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ModCard } from '@/components/mods/mod-card';
import type { ModInfo } from '@/types';

export const ModsPage = ({
  mods,
  enabledModIds,
  toggleMod,
  search,
  setSearch
}: {
  mods: ModInfo[];
  enabledModIds: string[];
  toggleMod: (id: string) => void;
  search: string;
  setSearch: (value: string) => void;
}) => (
  <div className="flex h-[calc(100vh-13rem)] flex-col gap-4">
    <Input placeholder="Search mods by name or author..." value={search} onChange={(e) => setSearch(e.target.value)} />
    <div className="min-h-0 flex-1">
      <Scrollable>
        <div className="space-y-3 pr-2">
          {mods.map((mod) => (
            <ModCard key={mod.id} mod={mod} enabled={enabledModIds.includes(mod.id)} onToggle={() => toggleMod(mod.id)} />
          ))}
        </div>
      </Scrollable>
    </div>
  </div>
);
