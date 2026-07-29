"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import type { ScreenResult } from "@/lib/api";

const columnHelper = createColumnHelper<ScreenResult>();

function fmt(n: number | null, digits = 2): string {
  return n == null ? "-" : n.toLocaleString("id-ID", { maximumFractionDigits: digits });
}

const columns = [
  columnHelper.accessor("ticker", {
    header: "Ticker",
    cell: (info) => (
      <Link href={`/analyze/${info.getValue()}`} className="font-medium text-black underline decoration-zinc-300 hover:decoration-zinc-500 dark:text-zinc-50">
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Harga",
    cell: (info) => fmt(info.getValue(), 0),
  }),
  columnHelper.accessor("change_percent", {
    header: "Change %",
    cell: (info) => {
      const v = info.getValue();
      const isUp = v >= 0;
      return (
        <span className={isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
          {isUp ? "+" : ""}
          {v.toFixed(2)}%
        </span>
      );
    },
  }),
  columnHelper.accessor("rsi_14", {
    header: "RSI",
    cell: (info) => fmt(info.getValue(), 1),
  }),
  columnHelper.accessor("volume_ratio", {
    header: "Vol Ratio",
    cell: (info) => `${info.getValue().toFixed(1)}x`,
  }),
  columnHelper.accessor("score", {
    header: "Score",
    cell: (info) => info.getValue().toFixed(0),
  }),
  columnHelper.accessor("signals", {
    header: "Signals",
    enableSorting: false,
    cell: (info) => (
      <span className="text-xs text-zinc-500">{info.getValue().join(", ") || "-"}</span>
    ),
  }),
];

export default function ScreenerTable({ data }: { data: ScreenResult[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "score", desc: true }]);

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
      <div className="rounded-lg border border-zinc-200 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        Tidak ada saham yang cocok dengan kriteria ini.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-zinc-200 dark:border-zinc-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left font-medium text-zinc-500"
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
              className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="whitespace-nowrap px-3 py-2 text-black dark:text-zinc-50">
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
