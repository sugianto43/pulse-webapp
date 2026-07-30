"use client";

import { useState, type ReactNode } from "react";

export type GlossaryTerm = { term: string; description: string };

export default function GlossaryAccordion({
  title = "Istilah di Halaman Ini",
  intro,
  terms,
  footer,
}: {
  title?: string;
  intro?: ReactNode;
  terms: GlossaryTerm[];
  footer?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-zinc-500"
      >
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-zinc-200 p-4 text-sm dark:border-zinc-800">
          {intro && <div className="mb-3 text-zinc-600 dark:text-zinc-400">{intro}</div>}
          <ul className="space-y-2">
            {terms.map((t) => (
              <li key={t.term}>
                <span className="font-medium text-black dark:text-zinc-50">{t.term}</span>
                <span className="text-zinc-500"> — {t.description}</span>
              </li>
            ))}
          </ul>
          {footer && <div className="mt-3 text-xs text-zinc-500">{footer}</div>}
        </div>
      )}
    </div>
  );
}
