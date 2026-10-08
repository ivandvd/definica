"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Drawer } from "@base-ui/react/drawer";
import { ArrowLeft, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "./useMediaQuery";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Shows a back arrow in the header (a pane further into a flow). */
  onBack?: () => void;
  /** When false, only the flow itself can close the sheet (a transaction waiting on the wallet). */
  dismissible?: boolean;
  size?: "md" | "lg";
  /** The sheet's own background: the walkthrough's sheets are canvas with white cards inside. */
  surface?: "canvas" | "card";
}

/** The walkthrough's sheet header: back or nothing, the title centred, close. */
function SheetHeader({
  title,
  description,
  onBack,
  dismissible,
  Title,
  Description,
  Close,
}: {
  title: ReactNode;
  description?: ReactNode;
  onBack?: () => void;
  dismissible: boolean;
  Title: typeof Dialog.Title;
  Description: typeof Dialog.Description;
  Close: typeof Dialog.Close;
}) {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-[40px_1fr_40px] items-center">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-card hover:text-ink"
            aria-label="Back"
          >
            <ArrowLeft className="size-[18px]" aria-hidden="true" />
          </button>
        ) : (
          <span />
        )}
        <Title className="text-center text-base leading-6 font-bold">{title}</Title>
        {dismissible ? (
          <Close className="flex size-10 items-center justify-center justify-self-end rounded-full text-ink-2 transition-colors hover:bg-card hover:text-ink" aria-label="Close">
            <X className="size-[18px]" aria-hidden="true" />
          </Close>
        ) : (
          <span />
        )}
      </div>
      {description ? <Description className="mx-auto mt-1 max-w-sm text-center text-[13px] leading-5 text-ink-2">{description}</Description> : null}
    </div>
  );
}

/** A centred dialog: the wide layout's version of a sheet. */
export function Modal({ open, onOpenChange, title, description, children, onBack, dismissible = true, size = "md", surface = "canvas" }: SheetProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && !dismissible) return;
        onOpenChange(next);
      }}
      disablePointerDismissal={!dismissible}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[rgba(15,15,15,0.42)] backdrop-blur-[2px] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sheet p-5 text-ink shadow-pop outline-none",
            "transition-[opacity,translate,scale] duration-300 ease-[var(--ease-out-soft)] data-[ending-style]:translate-y-[calc(-50%+8px)] data-[ending-style]:opacity-0 data-[starting-style]:translate-y-[calc(-50%+8px)] data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
            surface === "canvas" ? "bg-canvas" : "bg-card",
            size === "lg" ? "max-w-[560px]" : "max-w-[460px]",
          )}
        >
          <SheetHeader title={title} description={description} onBack={onBack} dismissible={dismissible} Title={Dialog.Title} Description={Dialog.Description} Close={Dialog.Close} />
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** A bottom sheet for phones: slides up, follows a swipe down, and closes on release. */
export function Sheet({ open, onOpenChange, title, description, children, onBack, dismissible = true, surface = "canvas" }: SheetProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && !dismissible) return;
        onOpenChange(next);
      }}
      disablePointerDismissal={!dismissible}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="sheet-backdrop fixed inset-0 z-40 bg-[rgba(15,15,15,0.42)]" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup
            className={cn(
              "sheet-popup relative flex max-h-[92dvh] w-full flex-col rounded-t-sheet text-ink shadow-pop outline-none sm:mx-3 sm:mb-3 sm:max-w-[520px] sm:rounded-sheet",
              surface === "canvas" ? "bg-canvas" : "bg-card",
            )}
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-ink/15" aria-hidden="true" />
            <Drawer.Content className="overflow-y-auto px-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom))]">
              <SheetHeader
                title={title}
                description={description}
                onBack={onBack}
                dismissible={dismissible}
                Title={Drawer.Title as typeof Dialog.Title}
                Description={Drawer.Description as typeof Dialog.Description}
                Close={Drawer.Close as typeof Dialog.Close}
              />
              {children}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/** A sheet on phones and a centred dialog in the wide layout, with the same header and content. */
export function ResponsiveSheet(props: SheetProps) {
  const desktop = useIsDesktop();
  return desktop ? <Modal {...props} /> : <Sheet {...props} />;
}
