"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

/*
 * The landing page's buttons: pills, near-black for the main action, and on hover the brand-green
 * fill sweeping up behind a label that slides out and back in (`btn-sweep` in dapp.css).
 */
export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform,opacity] duration-150 select-none active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "btn-sweep bg-ink text-white disabled:bg-chip disabled:text-ink-3 disabled:opacity-100",
        lime: "btn-sweep bg-lime text-ink",
        /* White with a hairline, for canvas backgrounds and sheets. */
        secondary: "btn-sweep bg-card text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
        /* Grey, for white cards. */
        soft: "btn-sweep bg-chip text-ink",
        ghost: "text-ink-2 hover:bg-chip hover:text-ink",
        danger: "bg-red-soft text-red hover:bg-[#ffd4ce]",
        link: "h-auto rounded-none px-0 text-ink underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px] [&_svg]:size-4",
        md: "h-10 px-5 text-sm [&_svg]:size-4",
        lg: "h-12 px-6 text-[15px] [&_svg]:size-[18px]",
        xl: "h-14 px-7 text-base [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-[18px]",
        "icon-sm": "size-8 [&_svg]:size-4",
      },
      block: { true: "w-full" },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, Variants {
  /** Shows a spinner in place of the icon and blocks clicks; the label stays so the width holds. */
  loading?: boolean;
  icon?: ReactNode;
  /** An icon after the label (an arrow, a chevron). */
  trailing?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ className, variant, size, block, loading = false, icon, trailing, children, disabled, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className="btn-label">
        {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon}
        {children}
        {trailing}
      </span>
    </button>
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, Variants {
  href: string;
  /** Opens in a new tab with the usual safety attributes. */
  external?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
}

/** A link in a button's clothes; internal routes go through `next/link`. */
export function ButtonLink({ className, variant, size, block, href, external = false, icon, trailing, children, ...rest }: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size, block }), className);
  const label = (
    <span className="btn-label">
      {icon}
      {children}
      {trailing}
    </span>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...rest}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {label}
    </Link>
  );
}
