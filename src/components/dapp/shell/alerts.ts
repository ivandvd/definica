"use client";

import { useMemo } from "react";
import { formatAmount, formatHealth, HEALTH_WORDS, healthZone } from "../lib/format";
import { HEALTH_CAUTION } from "../lib/protocol";
import { useDapp } from "../providers/DappProvider";

export interface Alert {
  id: string;
  tone: "success" | "info" | "caution" | "danger";
  title: string;
  text: string;
  href: string;
  cta: string;
}

/**
 * Everything waiting on the user, worst first: loans near liquidation, then things ready to
 * collect (exits, matured locks and commitments). Feeds the bell, the Home prompts and the tab
 * bar's action sheet.
 */
export function useAlerts(): Alert[] {
  const { data, connected } = useDapp();
  return useMemo(() => {
    if (!connected) return [];
    const alerts: Alert[] = [];
    const markets = new Map(data.markets.map((market) => [market.id, market]));

    for (const position of data.borrowPositions) {
      if (position.healthFactor === null || position.healthFactor >= HEALTH_CAUTION) continue;
      const zone = healthZone(position.healthFactor);
      const market = markets.get(position.marketId);
      alerts.push({
        id: `health-${position.marketId}`,
        tone: zone === "caution" ? "caution" : "danger",
        title: `${market?.name ?? "Loan"} health ${formatHealth(position.healthFactor)} · ${HEALTH_WORDS[zone]}`,
        text: zone === "liquidatable" ? "This loan can be liquidated now. Repay or add collateral." : "Repay some ETH or add collateral to move away from liquidation.",
        href: `/app/borrow/${position.marketId}`,
        cta: "Manage",
      });
    }

    for (const commitment of data.liquidityPosition?.commitments ?? []) {
      const health = commitment.financing?.healthFactor;
      if (health !== undefined && Number.isFinite(health) && health < HEALTH_CAUTION && commitment.financing && commitment.financing.debt > 0) {
        alerts.push({
          id: `funding-${commitment.id}`,
          tone: healthZone(health) === "caution" ? "caution" : "danger",
          title: `Funding loan health ${formatHealth(health)}`,
          text: "Repay part of the funding loan to keep the commitment safe.",
          href: "/app/liquidity",
          cta: "Repay",
        });
      }
    }

    const ready = data.exits.filter((exit) => exit.status === "claimable" || exit.status === "partial");
    if (ready.length) {
      const eth = ready.reduce((sum, exit) => sum + exit.claimableEth, 0);
      alerts.push({
        id: "exits",
        tone: "success",
        title: `${ready.length === 1 ? "1 exit" : `${ready.length} exits`} ready to claim`,
        text: `${formatAmount(eth)} ETH can be claimed to your wallet.`,
        href: "/app/unstake",
        cta: ready.length > 1 ? "Claim all" : "Claim",
      });
    }

    const matured = data.locks.filter((lock) => lock.status === "matured");
    if (matured.length) {
      const shares = matured.reduce((sum, lock) => sum + lock.shares, 0);
      alerts.push({
        id: "locks",
        tone: "info",
        title: `${matured.length === 1 ? "1 lock" : `${matured.length} locks`} matured`,
        text: `Release ${formatAmount(shares)} shares to use them again.`,
        href: "/app/locks",
        cta: "Release",
      });
    }

    const commitments = (data.liquidityPosition?.commitments ?? []).filter((item) => item.status === "matured");
    if (commitments.length) {
      alerts.push({
        id: "commitments",
        tone: "info",
        title: `${commitments.length === 1 ? "1 commitment" : `${commitments.length} commitments`} matured`,
        text: "Release the aEthosETH from the Liquidity Module.",
        href: "/app/liquidity",
        cta: "Release",
      });
    }

    const held = (data.liquidityPosition?.commitments ?? []).filter((item) => item.heldForRepayment);
    if (held.length) {
      alerts.push({
        id: "held",
        tone: "caution",
        title: "aEthosETH held for repayment",
        text: "Repay the funding loan to get the released aEthosETH back.",
        href: "/app/liquidity",
        cta: "Repay",
      });
    }

    return alerts;
  }, [data, connected]);
}
