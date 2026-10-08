"use client";

import { useCallback, useEffect, useState } from "react";
import type { Action, ActionPreview } from "../lib/protocol";
import { useDapp, type TxLabels } from "../providers/DappProvider";

export interface ReviewRequest {
  action: Action;
  labels: TxLabels;
  /** The preview the form showed; the review repeats it exactly. */
  preview: ActionPreview;
  /** A statement the user must tick before the confirm button turns on. */
  acknowledgement?: string;
  /** The confirm button: "Stake 1 ETH". */
  confirmLabel: string;
}

export type FlowStep = "form" | "review" | "progress";

/**
 * One flow container's state: the form, then the review, then the transaction's progress. The
 * transaction itself runs in the provider, so it carries on (with a toast at the end) if the
 * container closes.
 */
export function useTxFlow() {
  const { runTx, txs, watchTx } = useDapp();
  const [review, setReview] = useState<ReviewRequest | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  useEffect(() => (txId ? watchTx(txId) : undefined), [txId, watchTx]);

  const record = txId ? (txs.find((item) => item.id === txId) ?? null) : null;
  const step: FlowStep = txId && record ? "progress" : review ? "review" : "form";

  const openReview = useCallback((request: ReviewRequest) => {
    setDirection("forward");
    setReview(request);
  }, []);

  const confirm = useCallback(() => {
    if (!review) return;
    setDirection("forward");
    setTxId(runTx(review.action, review.labels));
  }, [review, runTx]);

  /** Straight to the wallet with a review the user has already seen (sheets that open on the review). */
  const start = useCallback(
    (request: ReviewRequest) => {
      setDirection("forward");
      setReview(request);
      setTxId(runTx(request.action, request.labels));
    },
    [runTx],
  );

  /** Back from the review to the form. */
  const back = useCallback(() => {
    setDirection("back");
    setReview(null);
    setTxId(null);
  }, []);

  /** After a failure: back to the review, to check it again and retry. */
  const retry = useCallback(() => {
    setDirection("back");
    setTxId(null);
  }, []);

  /** Done: the form again, cleared by the caller. */
  const finish = useCallback(() => {
    setDirection("back");
    setReview(null);
    setTxId(null);
  }, []);

  const inFlight = record !== null && (record.status === "wallet" || record.status === "pending" || record.status === "updating");

  return { step, direction, review, record, inFlight, openReview, start, confirm, back, retry, finish };
}

export type TxFlow = ReturnType<typeof useTxFlow>;
