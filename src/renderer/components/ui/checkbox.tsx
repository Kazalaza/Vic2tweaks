import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

export const Checkbox = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (value: boolean) => void }) => (
  <CheckboxPrimitive.Root
    checked={checked}
    onCheckedChange={(value) => onCheckedChange(value === true)}
    className="h-5 w-5 rounded border border-border data-[state=checked]:bg-accent"
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
