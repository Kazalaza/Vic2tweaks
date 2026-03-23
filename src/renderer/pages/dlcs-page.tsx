import { Card } from '@/components/ui/card';

export const DlcsPage = ({ dlcs }: { dlcs: string[] }) => (
  <div className="grid gap-3 md:grid-cols-2">
    {dlcs.length === 0 ? (
      <Card>No DLCs detected.</Card>
    ) : (
      dlcs.map((dlc) => <Card key={dlc}>{dlc}</Card>)
    )}
  </div>
);
