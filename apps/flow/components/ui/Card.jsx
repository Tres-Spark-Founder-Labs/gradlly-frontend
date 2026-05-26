import { cn } from "@/utils/helper";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("bg-white border border-neutral-200 rounded-xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("px-6 py-5 border-b border-neutral-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}
