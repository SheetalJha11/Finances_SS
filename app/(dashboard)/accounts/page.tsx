
"use client";

import { Loader2, Plus } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/tables";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteAccount } from "@/features/accounts/api/use-bulk-accounts";

import { columns } from "./columns";

export default function AccountPage() {
  const { onOpen } = useNewAccount();

  const accountQuery = useGetAccounts();
  const deleteAccounts = useBulkDeleteAccount();

  const accountsData = accountQuery.data || [];

  const isDisabled =
    accountQuery.isLoading || deleteAccounts.isPending;

  if (accountQuery.isLoading) {
    return (
      <div className="mx-auto flex h-[calc(100vh-200px)] w-full max-w-screen-2xl items-center justify-center px-4 pb-6">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 pb-6">
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-6 py-5">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">
              Accounts
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Manage your financial accounts.
            </p>
          </div>

          <Button
            onClick={onOpen}
            size="sm"
            className="shrink-0"
            disabled={isDisabled}
          >
            <Plus className="mr-2 size-4" />
            Add New
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <DataTable
            filterKey="name"
            columns={columns}
            data={accountsData}
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);

              if (ids.length > 0) {
                deleteAccounts.mutate({ ids });
              }
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
