"use client";

import { Toast } from "@base-ui/react/toast";
import { CircleCheck, CircleX, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Transaction outcomes that finish while their sheet is closed, and other short confirmations. */
export function Toaster() {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed top-[calc(68px+env(safe-area-inset-top))] right-3 left-3 z-[90] flex flex-col gap-2 outline-none sm:left-auto sm:w-[380px] lg:top-auto lg:right-6 lg:bottom-6 lg:flex-col-reverse">
        {toasts.map((toast) => {
          const Icon = toast.type === "success" ? CircleCheck : toast.type === "error" ? CircleX : Info;
          return (
            <Toast.Root
              key={toast.id}
              toast={toast}
              swipeDirection={["up", "right"]}
              className={cn(
                "flex items-start gap-3 rounded-[18px] bg-ink p-4 text-white shadow-pop select-none",
                "translate-x-[var(--toast-swipe-movement-x)] translate-y-[var(--toast-swipe-movement-y)] transition-[translate,opacity] duration-300 ease-[var(--ease-out-soft)]",
                "data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-3 data-[starting-style]:opacity-0 data-[swiping]:transition-none lg:data-[starting-style]:translate-y-3",
              )}
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", toast.type === "success" ? "text-lime" : toast.type === "error" ? "text-[#ff8a80]" : "text-sky")} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <Toast.Title className="text-sm font-bold" />
                <Toast.Description className="mt-0.5 text-[13px] leading-5 text-white/75" />
                {toast.actionProps ? (
                  <Toast.Action className="mt-2.5 inline-flex h-8 items-center rounded-full bg-lime px-3.5 text-[13px] font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95" />
                ) : null}
              </div>
              <Toast.Close className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Dismiss">
                <X className="size-4" aria-hidden="true" />
              </Toast.Close>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}
