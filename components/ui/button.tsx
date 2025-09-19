import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: [
          "text-white",
          "bg-gradient-to-b from-orange-400 via-orange-500 to-orange-700",
          "border-2 border-orange-300/30 border-t-orange-200/50 border-b-orange-800/60",
          "shadow-[0_1px_0_0_rgba(255,255,255,0.3)_inset,0_-1px_0_0_rgba(0,0,0,0.2)_inset,0_4px_8px_rgba(234,88,12,0.3),0_2px_4px_rgba(0,0,0,0.1)]",
          "hover:bg-gradient-to-b hover:from-orange-500 hover:via-orange-600 hover:to-orange-800",
          "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_-1px_0_0_rgba(0,0,0,0.3)_inset,0_6px_12px_rgba(234,88,12,0.4),0_3px_6px_rgba(0,0,0,0.15)]",
          "hover:border-t-orange-100/60 hover:border-b-orange-900/70",
          "active:bg-gradient-to-b active:from-orange-600 active:via-orange-700 active:to-orange-800",
          "active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)_inset,0_-1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(234,88,12,0.2)]",
          "active:border-t-orange-800/40 active:border-b-orange-200/30",
          "focus:ring-orange-400/50",
          "cursor-pointer",
        ],
        destructive: [
          "text-white",
          "bg-gradient-to-b from-red-500 via-red-600 to-red-800",
          "border-2 border-red-400/30 border-t-red-300/50 border-b-red-900/60",
          "shadow-[0_1px_0_0_rgba(255,255,255,0.3)_inset,0_-1px_0_0_rgba(0,0,0,0.2)_inset,0_4px_8px_rgba(220,38,38,0.3),0_2px_4px_rgba(0,0,0,0.1)]",
          "hover:bg-gradient-to-b hover:from-red-600 hover:via-red-700 hover:to-red-900",
          "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_-1px_0_0_rgba(0,0,0,0.3)_inset,0_6px_12px_rgba(220,38,38,0.4),0_3px_6px_rgba(0,0,0,0.15)]",
          "hover:border-t-red-200/60 hover:border-b-red-950/70",
          "active:bg-gradient-to-b active:from-red-700 active:via-red-800 active:to-red-900",
          "active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)_inset,0_-1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(220,38,38,0.2)]",
          "active:border-t-red-900/40 active:border-b-red-300/30",
          "focus:ring-red-400/50",
          "cursor-pointer",
        ],
        outline: [
          "text-slate-700 bg-white",
          "border-2 border-slate-300 border-t-slate-200 border-b-slate-400",
          "shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_-1px_0_0_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)]",
          "hover:bg-gradient-to-b hover:from-slate-50 hover:to-slate-100",
          "hover:border-t-slate-100 hover:border-b-slate-500",
          "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_-1px_0_0_rgba(0,0,0,0.15)_inset,0_4px_8px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.12)]",
          "active:bg-gradient-to-b active:from-slate-100 active:to-slate-200",
          "active:shadow-[0_1px_0_0_rgba(0,0,0,0.1)_inset,0_-1px_0_0_rgba(255,255,255,0.5)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
          "active:border-t-slate-400 active:border-b-slate-200",
          "focus:ring-slate-400/50",
          "cursor-pointer",
        ],
        secondary: [
          "text-slate-700",
          "bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400",
          "border-2 border-slate-300/50 border-t-slate-200/70 border-b-slate-500/60",
          "shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_-1px_0_0_rgba(0,0,0,0.15)_inset,0_3px_6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.08)]",
          "hover:bg-gradient-to-b hover:from-slate-300 hover:via-slate-400 hover:to-slate-500",
          "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_-1px_0_0_rgba(0,0,0,0.2)_inset,0_4px_8px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.1)]",
          "hover:border-t-slate-100/70 hover:border-b-slate-600/70",
          "active:bg-gradient-to-b active:from-slate-400 active:via-slate-500 active:to-slate-600",
          "active:shadow-[0_1px_0_0_rgba(0,0,0,0.15)_inset,0_-1px_0_0_rgba(255,255,255,0.3)_inset,0_2px_4px_rgba(0,0,0,0.1)]",
          "active:border-t-slate-500/40 active:border-b-slate-200/40",
          "focus:ring-slate-400/50",
          "cursor-pointer",
        ],
        ghost: [
          "text-slate-700 bg-transparent",
          "border-2 border-transparent",
          "shadow-none",
          "hover:bg-gradient-to-b hover:from-slate-100/80 hover:to-slate-200/80",
          "hover:border-slate-200/50 hover:border-t-slate-100/60 hover:border-b-slate-300/60",
          "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_-1px_0_0_rgba(0,0,0,0.05)_inset,0_2px_4px_rgba(0,0,0,0.05)]",
          "active:bg-gradient-to-b active:from-slate-200/90 active:to-slate-300/90",
          "active:shadow-[0_1px_0_0_rgba(0,0,0,0.05)_inset,0_-1px_0_0_rgba(255,255,255,0.5)_inset]",
          "active:border-slate-300/60",
          "focus:ring-slate-400/50",
          "cursor-pointer",
        ],
        link: [
          "text-orange-600 bg-transparent underline-offset-4",
          "border-2 border-transparent",
          "shadow-none",
          "hover:underline hover:text-orange-700",
          "hover:shadow-none",
          "active:text-orange-800",
          "active:shadow-none",
          "focus:ring-orange-400/50",
          "cursor-pointer",
        ],
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
