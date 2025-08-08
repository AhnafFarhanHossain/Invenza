import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-space-mono",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 uppercase cursor-pointer font-mono",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 uppercase cursor-pointer font-mono",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 uppercase cursor-pointer font-mono",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 uppercase cursor-pointer font-mono",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 uppercase cursor-pointer font-mono",
        link: "text-primary underline-offset-4 hover:underline uppercase cursor-pointer font-mono",
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
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (asChild && React.isValidElement(children)) {
    // Clone the single child and merge classes/props to avoid Radix Slot
    const onlyChild = React.Children.only(children) as React.ReactElement<any>;
    return React.cloneElement(onlyChild, {
      className: cn(onlyChild.props.className, classes),
      ...props,
    });
  }

  return (
    <button data-slot="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
