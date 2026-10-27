
"use client";

import * as React from "react";

import {
  type ColumnDef,
  type Row,
  type RowData,
  type SortingState,
  type ColumnFiltersState,
  useTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

import {
  features,
  type DataTableFeatures,
} from "@/features/accounts/hooks/data-table-features";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[]
  filterKey: string;
  onDelete: (rows: Row<DataTableFeatures, TData>[]) => void;
  disabled?: boolean;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to perform a bulk delete."
  );

  const table = useTable<DataTableFeatures, TData>({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDelete = async () => {
    if (selectedRows.length === 0 || disabled) return;

    const ok = await confirm();

    if (ok) {
      onDelete(selectedRows);
      table.resetRowSelection();
    }
  };

  return (
    <div className="w-full">
      <ConfirmDialog />

      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={
            (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn(filterKey)
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto font-normal text-xs"
          disabled={disabled || selectedRows.length === 0}
          onClick={handleDelete}
        >
          <Trash className="mr-2 size-4" />
          Delete ({selectedRows.length})
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}