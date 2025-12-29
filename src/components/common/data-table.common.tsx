import { useState, useMemo, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

// Types
export interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  cellClassName?: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  paginated?: boolean;
  tableContainerClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  rowClassName?: string;
  paginationClassName?: string;
  loading?: boolean;
}

interface SortConfig {
  key: string | null;
  direction: "asc" | "desc" | null;
}

// Reusable DataTable Component
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  onRowClick,
  sortable = true,
  paginated = true,
  tableContainerClassName = "",
  tableClassName = "",
  theadClassName = "",
  tbodyClassName = "",
  rowClassName = "",
  paginationClassName = "",
  loading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  console.log(data);
  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];

      if (aVal === bVal) return 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (sortConfig.direction === "asc") {
        return aStr < bStr ? -1 : 1;
      }
      return aStr > bStr ? -1 : 1;
    });

    return sorted;
  }, [data, sortConfig, sortable]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData?.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = paginated
    ? sortedData?.slice(startIndex, endIndex)
    : sortedData;

  const handleSort = (key: string) => {
    if (!sortable) return;

    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortable || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm",
          tableContainerClassName
        )}
      >
        {loading ? (
          <div className="w-full">
            <Skeleton className="h-[155px] w-full rounded-xl" />
          </div>
        ) : (
          <table className={cn("w-full text-sm", tableClassName)}>
            <thead
              className={cn(
                "border-b border-gray-200 bg-gray-50",
                theadClassName
              )}
            >
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-4 py-3 text-left font-medium text-gray-700 ${
                      column.className || ""
                    }`}
                    onClick={() =>
                      column.sortable !== false &&
                      handleSort(String(column.key))
                    }
                    style={{
                      cursor:
                        column.sortable !== false && sortable
                          ? "pointer"
                          : "default",
                    }}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable !== false &&
                        sortable &&
                        getSortIcon(String(column.key))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={cn("divide-y divide-gray-200", tbodyClassName)}>
              {!loading && paginatedData?.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns?.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData?.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className={`${
                      onRowClick
                        ? "cursor-pointer hover:bg-gray-50 transition"
                        : ""
                    } ${rowClassName}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-3 ${column.cellClassName || ""}`}
                      >
                        {column.render
                          ? column.render(row)
                          : row[column.key as keyof T]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {paginated && totalPages > 1 && (
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center sm:justify-between px-1 py-1 space-y-2 sm:space-y-0",
            paginationClassName
          )}
        >
          {/* Entries info */}
          <div className="text-sm text-gray-600">
            <span className="hidden sm:inline">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, sortedData?.length)} of {sortedData?.length}{" "}
              entries
            </span>
            <span className="sm:hidden text-center w-full">
              {startIndex + 1}-{Math.min(endIndex, sortedData?.length)} of{" "}
              {sortedData?.length}
            </span>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            <Button
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First Page"
            >
              <ChevronsLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
              Page {currentPage} of {totalPages}
            </div>

            <Button
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last Page"
            >
              <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
