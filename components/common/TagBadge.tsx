import { Badge } from '@/components/ui/badge';

export function TagBadge({ label }: { label: string }) {
  return (
    <Badge
      variant="secondary"
      className="rounded-full border-transparent bg-secondary/70 font-normal text-secondary-foreground"
    >
      {label}
    </Badge>
  );
}
