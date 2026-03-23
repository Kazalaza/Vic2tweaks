import * as ScrollArea from '@radix-ui/react-scroll-area';

export const Scrollable = ({ children }: { children: React.ReactNode }) => (
  <ScrollArea.Root className="h-full w-full overflow-hidden">
    <ScrollArea.Viewport className="h-full w-full">{children}</ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical" className="w-2 bg-transparent">
      <ScrollArea.Thumb className="rounded-full bg-border" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
);
