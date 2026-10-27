"use client";

import { InferResponseType } from "hono";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { Actions } from "./actions";

import {
type DataTableFeatures,
} from "@/features/accounts/hooks/data-table-features";

type Transaction = InferResponseType<
typeof client.api.transactions.$get,
200

> ["data"][number];

const columnHelper = createColumnHelper<
DataTableFeatures,
Transaction

> ();

export const columns = columnHelper.columns([
columnHelper.display({
id: "select",
header: ({ table }) => (
<Checkbox
checked={table.getIsAllPageRowsSelected()}
indeterminate={
table.getIsSomePageRowsSelected() &&
!table.getIsAllPageRowsSelected()
}
onCheckedChange={(value) =>
table.toggleAllPageRowsSelected(!!value)
}
aria-label="Select all"
/>
),
cell: ({ row }) => (
<Checkbox
checked={row.getIsSelected()}
onCheckedChange={(value) =>
row.toggleSelected(!!value)
}
aria-label="Select row"
/>
),
enableSorting: false,
enableHiding: false,
}),

columnHelper.accessor("date", {
header: ({ column }) => (
<Button
variant="ghost"
onClick={() =>
column.toggleSorting(column.getIsSorted() === "asc")
}
>
Date <ArrowUpDown className="ml-2 size-4" /> </Button>
),
cell: ({ row }) =>
new Date(row.original.date).toLocaleDateString(),
}),

columnHelper.accessor("payee", {
header: "Payee",
cell: ({ row }) => row.original.payee,
}),

columnHelper.accessor("amount", {
header: ({ column }) => (
<Button
variant="ghost"
onClick={() =>
column.toggleSorting(column.getIsSorted() === "asc")
}
>
Amount <ArrowUpDown className="ml-2 size-4" /> </Button>
),
cell: ({ row }) => row.original.amount,
}),

columnHelper.accessor("account", {
header: "Account",
cell: ({ row }) => row.original.account,
}),

columnHelper.accessor("categorie", {
header: "Category",
cell: ({ row }) =>
row.original.categorie ?? "Uncategorized",
}),

columnHelper.display({
id: "actions",
header: "Actions",
cell: ({ row }) => ( <Actions id={row.original.id} />
),
}),
]);
