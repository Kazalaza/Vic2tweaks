import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = ({ gameVersion, modCount, onPlay, onContinue }: { gameVersion: string; modCount: number; onPlay: () => void; onContinue: () => void }) => (
  <header className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card p-4">
    <div>
      <p className="text-xs uppercase tracking-wider text-muted">Version {gameVersion}</p>
      <h2 className="text-lg font-semibold">Launch with {modCount} mods</h2>
    </div>
    <div className="flex gap-3">
      <Button variant="secondary" size="lg" onClick={onContinue}>Continue with Last Session</Button>
      <Button size="lg" onClick={onPlay}>
        <Play className="mr-2 h-5 w-5" /> PLAY
      </Button>
    </div>
  </header>
);
