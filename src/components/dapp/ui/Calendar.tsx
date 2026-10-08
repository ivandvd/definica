"use client";

import { CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import { useDapp } from "../providers/DappProvider";
import { Button, type ButtonProps } from "./Button";

/** A desk-calendar page: the month on a coral band, the day, the year. It flips when the date changes. */
export function CalendarTile({ at, className }: { at: number; className?: string }) {
  const date = new Date(at);
  const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const day = date.getDate();
  const year = date.getFullYear();
  return (
    <span className={cn("relative block w-[62px] shrink-0 [perspective:260px]", className)} aria-hidden="true">
      <span className="absolute -top-1.5 left-[15px] z-10 h-3.5 w-[7px] rounded-full border-[1.5px] border-ink bg-card" />
      <span className="absolute -top-1.5 right-[15px] z-10 h-3.5 w-[7px] rounded-full border-[1.5px] border-ink bg-card" />
      <span
        key={`${year}-${month}-${day}`}
        className="block origin-top animate-[page-flip_0.45s_var(--ease-out-soft)] overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-card text-center"
      >
        <span className="block border-b-[1.5px] border-ink bg-coral pt-1.5 pb-0.5 text-[11px] leading-4 font-extrabold tracking-[0.06em]">{month}</span>
        <span className="figure block pt-1 text-[26px] leading-none font-extrabold">{day}</span>
        <span className="block pt-0.5 pb-1.5 text-[10px] font-semibold text-ink-3">{year}</span>
      </span>
    </span>
  );
}

export interface CalendarEvent {
  /** Stable per thing reminded of, so adding it twice updates the same event. */
  id: string;
  title: string;
  description: string;
  at: number;
  /** The app page it's about, e.g. "/app/locks". */
  path: string;
  filename: string;
}

const icsTime = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (text: string) => text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
/** Calendar lines stay under 75 characters; longer ones continue on a line starting with a space. */
const fold = (line: string) => (line.length <= 74 ? line : (line.match(/.{1,73}/g) ?? [line]).join("\r\n "));

/** Saves an .ics file for the moment (a 30-minute event with an alert): every calendar app opens it. */
export function downloadCalendarEvent(event: CalendarEvent) {
  const url = `${SITE_URL}${event.path}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Definica//App//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@definica.com`,
    `DTSTAMP:${icsTime(Date.now())}`,
    `DTSTART:${icsTime(event.at)}`,
    `DTEND:${icsTime(event.at + 30 * 60_000)}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(`${event.description}\n${url}`)}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.map(fold).join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = event.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/** "Add to calendar": saves the reminder and says so. */
export function AddToCalendar({ event, children = "Add to calendar", ...rest }: { event: CalendarEvent } & Omit<ButtonProps, "onClick">) {
  const { toasts } = useDapp();
  return (
    <Button
      icon={<CalendarPlus />}
      {...rest}
      onClick={() => {
        downloadCalendarEvent(event);
        toasts.add({ title: "Reminder saved", description: "Open the calendar file to add it to your calendar.", type: "info", timeout: 3500 });
      }}
    >
      {children}
    </Button>
  );
}

/** The reminder for a lock's maturity. */
export const lockReminder = (lock: { id: string; shares: number; maturesAt: number }, shares: string): CalendarEvent => ({
  id: `lock-${lock.id}`,
  title: "Your Definica share lock matures",
  description: `Your lock of ${shares} Vault shares matures now. Release it in the Definica app to use the shares again.`,
  at: lock.maturesAt,
  path: "/app/locks",
  filename: "definica-lock-matures.ics",
});
