import { Badge } from '@/components/ui/badge';

export function TagBadge({ label }: { label: string }) {
  return (
    <Badge variant="secondary" className="rounded-full font-normal text-muted-foreground">
      {label}
    </Badge>
  );
}
