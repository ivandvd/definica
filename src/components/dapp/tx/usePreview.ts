"use client";

import { useEffect, useState } from "react";
import type { Action, ActionPreview } from "../lib/protocol";
import { useDapp } from "../providers/DappProvider";

/**
 * Reads what an action would do, as the user types (debounced). Keeps the last preview while the
 * next one loads, so figures don't flicker; `fresh` says whether it matches the current input.
 */
export function usePreview(action: Action | null) {
  const { env, wallet, connected, data } = useDapp();
  const address = connected ? wallet.address : null;
  const key = action ? JSON.stringify(action) : null;
  const [state, setState] = useState<{ key: string; preview: ActionPreview } | null>(null);

  useEffect(() => {
    if (!key) return;
    let live = true;
    const timer = window.setTimeout(() => {
      void env.protocol.preview(address, JSON.parse(key) as Action).then((preview) => {
        if (live) setState({ key, preview });
      });
    }, 110);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
    // Re-read when the data on screen changes (a harvest, a transaction), not only the input.
  }, [key, address, env, data.readAt, data.now]);

  return { preview: key ? (state?.preview ?? null) : null, fresh: key !== null && state?.key === key };
}
