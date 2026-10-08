"use client";

import { useEffect } from "react";
import { useDapp } from "../providers/DappProvider";
import { ResponsiveSheet } from "../ui/Dialog";
import { Skeleton } from "../ui/Skeleton";
import { ProgressPane, ReviewPane } from "./TxPanes";
import { usePreview } from "./usePreview";
import { useTxFlow, type ReviewRequest } from "./useTxFlow";

export type SheetRequest = Omit<ReviewRequest, "preview">;

/**
 * A transaction that starts from a list (Claim, Release, Repay…): it opens on the review, then
 * follows the transaction to its result. A sheet on phones, a dialog in the wide layout.
 */
export function TxSheet({ request, onClose }: { request: SheetRequest | null; onClose: () => void }) {
  const flow = useTxFlow();
  const { preview, fresh } = usePreview(request?.action ?? null);
  const { wallet } = useDapp();
  const open = request !== null;

  // A different account means a different position: close rather than show a stale review.
  useEffect(() => {
    if (open && !wallet.address) onClose();
  }, [open, wallet.address, onClose]);

  const close = () => {
    flow.finish();
    onClose();
  };

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
      title={request?.labels.title ?? ""}
      dismissible={flow.record?.status !== "wallet"}
    >
      {request ? (
        flow.step === "progress" && flow.record && flow.review ? (
          <div className="animate-pane-in">
            <ProgressPane record={flow.record} preview={flow.review.preview} surface="canvas" onRetry={flow.retry} onDone={close} />
          </div>
        ) : preview && fresh ? (
          <ReviewPane
            request={{ ...request, preview }}
            surface="canvas"
            onConfirm={() => flow.start({ ...request, preview })}
            onBack={close}
            backLabel="Cancel"
          />
        ) : (
          <div className="space-y-3" aria-busy="true" aria-label="Loading the review">
            <Skeleton className="h-28 w-full rounded-[16px]" />
            <Skeleton className="h-40 w-full rounded-[16px]" />
            <Skeleton className="h-12 w-full rounded-control" />
          </div>
        )
      ) : null}
    </ResponsiveSheet>
  );
}
