
import {
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue
} from "@/components/ui/select"
import {cn} from "@/lib/utils"
import { index } from "drizzle-orm/pg-core";
import { CaptionsIcon } from "lucide-react";
import { object } from "zod";

type Props = {
    columnIndex: number;
    selectedColumns: Record<string, string | null>
    onChange: (
        ColumnIndex: number,
        value: string | null
    ) => void
}

const options = [
   "amount",
   "payee",
   "notes",
   "date"
]

export function TableHeadSelect({
    columnIndex,
    selectedColumns, 
    onChange
}:Props) {
    const currentSelect = selectedColumns[`column_${columnIndex}`]
    return(
       <Select
  value={selectedColumns[`column_${columnIndex}`] ?? "skip"}
  onValueChange={(value) =>
    onChange(columnIndex, value === "skip" ? null : value)
  }
>
         <SelectTrigger className={cn("focus:ring-offset-0, focus:ring-transparent")}>
           <SelectValue placeholder="Skip"/>
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="skip">skip </SelectItem>
            {options.map((option) => {
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            currentSelect !== option;

          return (
            <SelectItem
              key={option}
              value={option}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          );
        })}
         </SelectContent>
       </Select>
    )
}