"use client";

import { useEffect, type ReactNode } from "react";
import { syncDevToolsFromUrl } from "../lib/devtools";
import { Banners } from "./Banners";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { Gates } from "./Gates";
import { ReceiptSheet } from "./ReceiptSheet";
import { Sidebar } from "./Sidebar";
import { Toaster } from "./Toaster";
import { TopBar } from "./TopBar";
import { WalletPrompt } from "./WalletPrompt";

/** The frame around every screen: sidebar or tab bar, top bar, app-wide banners, gates and toasts. The app sets no cookies. */
export function AppShell({ children }: { children: ReactNode }) {
  // ?devtools=1 or ?devtools=0 in the address bar turns the developer tools on or off here.
  useEffect(() => syncDevToolsFromUrl(), []);
  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only z-50 rounded-control bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="main" className="mx-auto w-full max-w-[1240px] flex-1 px-4 pt-2 pb-32 sm:px-6 lg:px-8 lg:pt-2 lg:pb-12">
          <Banners />
          {children}
        </main>
        <Footer />
      </div>
      <BottomNav />
      <Gates />
      <ReceiptSheet />
      <WalletPrompt />
      <Toaster />
    </div>
  );
}
