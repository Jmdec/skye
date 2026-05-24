"use client";

import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import Link from "next/link";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  width?: string;
  headerClassName?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onView?: (id: any) => void;
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
  editHref?: (id: any) => string;
  createHref?: string;
  idField: keyof T;
  pageSize?: number;
  accentColor?: (row: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
  editHref,
  createHref,
  idField,
  pageSize = 10,
  accentColor,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  const gridCols = [
    accentColor ? "4px" : null,
    ...columns.map((c) => c.width ?? "auto"),
    "auto",
  ]
    .filter(Boolean)
    .join(" ");

  const formatValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return "";
    }

    if (React.isValidElement(value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object") {
      return Object.values(value).filter(Boolean).join(", ");
    }

    return String(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center">
          <Plus className="w-5 h-5 text-pink-300" />
        </div>

        <p className="text-sm text-gray-400">No data found</p>

        {createHref && (
          <Link
            href={createHref}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-xl shadow-md shadow-pink-200 hover:shadow-pink-300 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="bg-white rounded-2xl border border-pink-100/60 shadow-sm shadow-pink-50 overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: gridCols }}>

          {/* Header */}
          {accentColor && (
            <div className="bg-gradient-to-r from-pink-50 to-rose-50/50 border-b border-pink-100/60 py-3.5 pl-5" />
          )}

          {columns.map((col, i) => (
            <div
              key={`h-${String(col.key)}`}
              className={[
                "bg-gradient-to-r from-pink-50 to-rose-50/50 border-b border-pink-100/60",
                "flex items-center py-3.5",
                i === 0 && !accentColor ? "pl-5" : "pl-2",
                "pr-2",
                "text-[10px] uppercase tracking-[0.2em] text-pink-400 font-semibold whitespace-nowrap",
                col.headerClassName ?? "",
              ].join(" ")}
            >
              {col.label}
            </div>
          ))}

          <div className="bg-gradient-to-r from-pink-50 to-rose-50/50 border-b border-pink-100/60 flex items-center justify-end pr-5 py-3.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-pink-400 font-semibold whitespace-nowrap">
              Actions
            </span>
          </div>

          {/* Rows */}
          {paginated.map((row, rowIdx) => {
            const id = String(row[idField]);
            const accent = accentColor?.(row);
            const isLast = rowIdx === paginated.length - 1;
            const isHovered = hoveredRow === id;
            const border = isLast ? "" : "border-b border-pink-50";
            const bg = isHovered ? "bg-pink-50/30" : "bg-white";
            const cellCls = `${border} ${bg} flex items-center py-4 transition-colors`;
            const handlers = {
              onMouseEnter: () => setHoveredRow(id),
              onMouseLeave: () => setHoveredRow(null),
            };

            return (
              <React.Fragment key={id}>

                {/* Accent Bar */}
                {accentColor && (
                  <div className={`${cellCls} pl-5`} {...handlers}>
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${accent}, ${accent}88)`,
                      }}
                    />
                  </div>
                )}

                {/* Data Cells */}
                {columns.map((col, colIdx) => {
                  const value = row[col.key];

                  return (
                    <div
                      key={`${id}-${String(col.key)}`}
                      className={[
                        cellCls,
                        "text-sm text-gray-700 min-w-0",
                        colIdx === 0 && !accentColor
                          ? "pl-5 pr-2"
                          : "px-2",
                      ].join(" ")}
                      {...handlers}
                    >
                      {col.render
                        ? col.render(value, row)
                        : formatValue(value)}
                    </div>
                  );
                })}

                {/* Actions */}
                <div
                  className={`${cellCls} justify-end gap-1 pr-5`}
                  {...handlers}
                >
                  <div className="flex items-center gap-1">

                    {onView && (
                      <button
                        onClick={() => onView(row[idField])}
                        title="View"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:text-blue-500 hover:bg-blue-50 ${
                          isHovered ? "text-gray-400" : "text-gray-200"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {editHref ? (
                      <Link href={editHref(row[idField])}>
                        <button
                          onClick={() => onEdit?.(row[idField])}
                          title="Edit"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:text-pink-500 hover:bg-pink-50 ${
                            isHovered ? "text-gray-400" : "text-gray-200"
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    ) : onEdit ? (
                      <button
                        onClick={() => onEdit(row[idField])}
                        title="Edit"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:text-pink-500 hover:bg-pink-50 ${
                          isHovered ? "text-gray-400" : "text-gray-200"
                        }`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(row[idField])}
                        title="Delete"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:text-red-500 hover:bg-red-50 ${
                          isHovered ? "text-gray-400" : "text-gray-200"
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                  </div>
                </div>

              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">

          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-600">
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, data.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-600">{data.length}</span>
          </p>

          <div className="flex items-center gap-1">

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1
              )
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-gray-300"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === p
                        ? "bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200"
                        : "text-gray-500 hover:bg-pink-50 hover:text-pink-500"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-gray-300 mt-4">
        {Math.min(paginated.length, data.length)} of {data.length}{" "}
        {data.length === 1 ? "record" : "records"}
      </p>
    </div>
  );
}