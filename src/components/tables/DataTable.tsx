"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface Column<T, K extends keyof T = keyof T> {
  header: string;
  accessor: K;
  render?: (value: T[K], row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id?: string | number }> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<
  T extends { id?: string | number },
>({
  data,
  columns,
  emptyMessage = "Aucune donnée disponible.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            {/* Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.length > 0 ? (
                data.map((row) => (
                  <TableRow
                    key={row.id}
                    className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                  >
                    {columns.map((col, index) => (
                      <TableCell
                        key={index}
                        className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {col.render
                          ? col.render(row[col.accessor], row)
                          : String(row[col.accessor] ?? "-")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}