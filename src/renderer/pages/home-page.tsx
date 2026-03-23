import { Card } from '@/components/ui/card';

export const HomePage = ({ gamePath, mods, dlcs }: { gamePath: string; mods: number; dlcs: number }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <Card><p className="text-sm text-muted">Game Path</p><p className="mt-2 break-all text-sm">{gamePath || 'Not configured'}</p></Card>
    <Card><p className="text-sm text-muted">Detected Mods</p><p className="mt-2 text-2xl font-bold">{mods}</p></Card>
    <Card><p className="text-sm text-muted">Detected DLCs</p><p className="mt-2 text-2xl font-bold">{dlcs}</p></Card>
  </div>
);
