import type { Metadata } from "next";
import { NotFoundPage } from "@/components/sites/definica/shared/NotFoundPage";
import "./globals.css";
import "@/styles/sites/definica/site.css";
import "@/styles/sites/definica/definica.css";

/* Any URL that matches no page, on the site or in the app. It bypasses the layouts, hence the imports. */
export const metadata: Metadata = {
  title: "Page not found — Definica",
  description: "This page doesn’t exist. Go back to the Definica home page, the roadmap or the docs.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body>
        <NotFoundPage />
      </body>
    </html>
  );
}
