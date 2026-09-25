import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] text-sm font-medium transition-[background-color,color,border-color] duration-150 outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 border border-transparent hover:bg-[var(--muted)] data-[state=on]:bg-[var(--primary)] data-[state=on]:text-[var(--primary-foreground)] data-[state=on]:border-[var(--primary)] min-h-11 px-3.5 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-[var(--border)] bg-[var(--background)]",
      },
      size: {
        default: "min-h-11 px-3.5",
        sm: "min-h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
