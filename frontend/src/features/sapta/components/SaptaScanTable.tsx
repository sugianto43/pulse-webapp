"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import type { SaptaResult, SaptaStatus } from "../types";

const columnHelper = createColumnHelper<SaptaResult>();

const STATUS_COLOR: Record<SaptaStatus, string> = {
  "PRE-MARKUP": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  SIAP: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  WATCHLIST: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  ABAIKAN: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-400",
};

const columns = [
  columnHelper.accessor("ticker", {
    header: "Ticker",
    cell: (info) => (
      <Link
        href={`/sapta/${info.getValue()}`}
        className="font-medium text-black underline decoration-zinc-300 hover:decoration-zinc-500 dark:text-zinc-50"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${STATUS_COLOR[info.getValue()]}`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("final_score", {
    header: "Skor",
    cell: (info) => info.getValue().toFixed(1),
  }),
  columnHelper.accessor("confidence", {
    header: "Confidence",
  }),
  columnHelper.accessor("projected_breakout_window", {
    header: "Proyeksi Window",
    cell: (info) => info.getValue() ?? "-",
  }),
];

export default function SaptaScanTable({ data }: { data: SaptaResult[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "final_score", desc: true }]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white/60 p-6 text-center text-sm text-zinc-500 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
        Tidak ada kandidat yang memenuhi kriteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-black/5 dark:border-white/10">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer px-3 py-2 text-left font-medium whitespace-nowrap text-zinc-500 select-none"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-black/5 transition last:border-0 hover:bg-white/60 dark:border-white/5 dark:hover:bg-white/5"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-3 py-2 whitespace-nowrap text-black dark:text-zinc-50"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
