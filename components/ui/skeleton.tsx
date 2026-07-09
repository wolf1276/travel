import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-xl bg-[length:200%_100%] bg-gradient-to-r from-primary/8 via-primary/16 to-primary/8",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
