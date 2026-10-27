"use client";

import {
Card,
CardHeader,
CardTitle,
CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransactions } from "@/features/transactions/hooks/use-new-transactions";
import { useDeleteTransactions } from "@/features/transactions/api/use-delete-transaction ";
import {useBulkCreateTransactions} from "@/features/transactions/api/use-bulk-create-transactions"
import {transactions} from "@/db/schema"

import { columns } from "./columns";
import { DataTable } from "@/components/ui/tables";
import type { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { useState } from "react";
import {UploadButton} from "./upload-button"
import {ImportCard} from "./import-card"
import {useSelectAccount} from "@/hooks/use-select-account"
import { toast } from "sonner";


enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
  data : [],
  errors :  [],
  meta: {}
}

type Transaction = InferResponseType<
typeof client.api.transactions.$get,
200
> ["data"][number];

export default function TransactionsPage() {
const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
  setVariant(VARIANTS.IMPORT)
  setImportResults(results)

}

const onCancelImport = (results: typeof INITIAL_IMPORT_RESULTS) => {
  setVariant(VARIANTS.LIST)
  setImportResults(results)
  
}

const { onOpen } = useNewTransactions();

const transactionsQuery = useGetTransactions();
const deleteTransaction = useDeleteTransactions();
const createTransaction =useBulkCreateTransactions()
const [AccountDialog, confirm] = useSelectAccount();

const transactionsData: Transaction[] = Array.isArray(
transactionsQuery.data
)
? transactionsQuery.data
: transactionsQuery.data
? [transactionsQuery.data]
: [];

const isDisabled =
transactionsQuery.isLoading || deleteTransaction.isPending;

const onSubmitImport = async(
  values: typeof transactions.$inferInsert[]
) => {
   const accountId = await confirm()

   if (!accountId) {
    return toast.error("please select an account to continue.")
   }

   const data  = values.map((value)=>({
    ...value,
    accountId: accountId as string
   }))

  createTransaction.mutate(data, {
  onSuccess: () => {
    onCancelImport(INITIAL_IMPORT_RESULTS); 
  },
});

}

if (transactionsQuery.isLoading) {
return (
   <div className="mx-auto flex h-[calc(100vh-200px)] w-full max-w-screen-2xl items-center justify-center pb-6"> 
   <Loader2 className="size-6 animate-spin text-muted-foreground" /> 
   </div>
);
}

if (transactionsQuery.isError) {
return ( 
<div className="mx-auto w-full max-w-screen-2xl p-6"> 
  <p className="text-sm text-red-500">
   Failed to load transactions: {transactionsQuery.error.message} 
  </p> 
</div>
);
}

if (variant === VARIANTS.IMPORT) {
  return(
    <>
    <AccountDialog/>
    <ImportCard 
     data={importResults.data}
     onCancel={() => onCancelImport(importResults)}
     onSubmit={onSubmitImport}
    />
    </>
  )
}

return (
   <div className="mx-auto w-full max-w-screen-2xl pb-6"> 
<Card> 
  <CardHeader className="flex flex-row items-center justify-between"> 
    <CardTitle className="text-xl font-bold">
     Transactions History
   </CardTitle>
      <div className="flex item-center gap-x-2">
      <Button
        onClick={onOpen}
        size="sm"
        disabled={isDisabled}
      >
        <Plus className="mr-2 size-4" />
        Add New
      </Button>
      <UploadButton onUpload= {onUpload}/>
      </div>
    </CardHeader>

  <CardContent>
  <DataTable
     filterKey="name"
    columns={columns}
    data={transactionsData}
    onDelete={(rows) => {
      rows.forEach((row) => {
        deleteTransaction.mutate(row.original.id);
      });
    }}
    disabled={isDisabled}
  />
</CardContent>
  </Card>
</div>

);
}
