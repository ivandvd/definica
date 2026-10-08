/**
 * What this build of the app offers. Staking (stake, unstake, share locks) is the app. The Liquidity
 * Module and the borrowing markets are built and wired to the same data layer, but stay switched
 * off: the sidebar lists them as "Coming soon" until each one opens.
 */
export const FEATURES: { liquidity: boolean; borrowing: boolean } = {
  liquidity: false,
  borrowing: false,
};
