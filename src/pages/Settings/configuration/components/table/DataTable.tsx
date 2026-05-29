import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  className?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-700"
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="border-b even:bg-gray-100 transition-all hover:bg-gray-50"
            >
              {columns.map((column) => {
                const value = row[column.key as keyof T];

                return (
                  <TableCell key={String(column.key)} className="p-4">
                    {column.render
                      ? column.render(value, row, index)
                      : String(value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
