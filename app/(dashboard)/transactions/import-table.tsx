

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableHeadSelect } from "./table-head";

type Props = {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onTableHeadSelectChange: (
    columnIndex: number,
    value: string | null
  ) => void;
};

export function ImportTable({
  headers,
  body,
  selectedColumns,
  onTableHeadSelectChange,
}: Props) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className="min-w-180px px-4 py-3"
              >
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  {header || `Column ${index + 1}`}
                </div>

                <TableHeadSelect
                  columnIndex={index}
                  selectedColumns={selectedColumns}
                  onChange={onTableHeadSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {body.length > 0 ? (
            body.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((_, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    className="max-w-250px truncate px-4 py-3"
                    title={row[columnIndex] ?? ""}
                  >
                    {row[columnIndex] || "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={Math.max(headers.length, 1)}
                className="h-24 text-center text-muted-foreground"
              >
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
