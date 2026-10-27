

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { columns } from "./columns";
import { index } from "drizzle-orm/pg-core";
import {convertAmountToMiliunits} from "@/lib/utils"
import {format, parse} from "date-fns"


const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export function ImportCard({
  data,
  onCancel,
  onSubmit,
}: Props) {
  const [selectedColumns, setSelectedColumnsState] =
    useState<SelectedColumnsState>({});

  const headers = data[0] ?? [];
  const body = data.slice(1);

  function onTableHeadSelectChange(
    columnIndex: number,
    value: string | null
  ) {
    const selectedValue = value === "skip" ? null : value;

    setSelectedColumnsState((prev) => {
      const newSelectedColumns = { ...prev };

      if (selectedValue !== null) {
        for (const key in newSelectedColumns) {
          if (
            key !== `column_${columnIndex}` &&
            newSelectedColumns[key] === selectedValue
          ) {
            newSelectedColumns[key] = null;
          }
        }
      }

      newSelectedColumns[`column_${columnIndex}`] = selectedValue;

      return newSelectedColumns;
    });
  }

  const progress = requiredOptions.filter((option) =>
    Object.values(selectedColumns).includes(option)
  ).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
        return column.split("_")[1]
    }


    
const mappedData = {
  headers: headers
    .map((_header, index) => selectedColumns[`column_${index}`] ?? null)
    .filter((header) => header !== null),

  body: body
    .map((row) =>
      row
        .map((cell, index) =>
          selectedColumns[`column_${index}`] ? cell : null
        )
        .filter((cell) => cell !== null)
    )
    .filter((row) => row.length > 0),
};

const arrayofData = mappedData.body.map((row) => {
    return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
            acc[header] = cell
        }
        return acc;
    }, {})
})

const dateFormat = "MM/dd/yyyy";

const formattedData = arrayofData.map((item) => ({
    ...item,
    amount: convertAmountToMiliunits(parseFloat(item.amount)),
    date: format(
        parse(item.date, dateFormat, new Date()),
        "yyyy-MM-dd"
    )
}));

onSubmit(formattedData)

  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl pb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Transactions History
          </CardTitle>

          <div className="flex items-center gap-x-2">
            <Button
              onClick={onCancel}
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>

            <Button
              disabled={progress !== requiredOptions.length}
              onClick={() => onSubmit(selectedColumns)}
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
