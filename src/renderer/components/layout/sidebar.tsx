import { Gamepad2, Home, PackageOpen, PanelsTopLeft, Settings2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'mods', label: 'Mods', icon: PackageOpen },
  { key: 'presets', label: 'Presets', icon: Sparkles },
  { key: 'dlcs', label: 'DLCs', icon: PanelsTopLeft },
  { key: 'settings', label: 'Settings', icon: Settings2 },
  { key: 'about', label: 'About', icon: Gamepad2 }
] as const;

export type TabKey = (typeof tabs)[number]['key'];

export const Sidebar = ({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) => (
  <aside className="w-64 border-r border-border bg-[#070a14] p-4">
    <h1 className="mb-6 text-xl font-semibold text-white">Victoria II Launcher</h1>
    <nav className="space-y-2">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-muted transition hover:bg-[#12182a]',
            active === key && 'bg-[#18213b] text-white'
          )}
        >
          <Icon className="h-4 w-4" /> {label}
        </button>
      ))}
    </nav>
  </aside>
);
