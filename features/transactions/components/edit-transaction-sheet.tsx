
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

import { useOpenTransactions } from "../hooks/use-open-transactions";
import { useTnsaction } from "../api/use-get-transaction";
import { useEditTransactions } from "../api/use-edit-transaction";
import { useDeleteTransactions } from "../api/use-delete-transaction ";
import { TransactionFrom } from "./transaction-form";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetcategory } from "@/features/categories/api/use-get-category";

import type { FormValues } from "./transaction-form";

export function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransactions();

  const transactionQuery = useTnsaction(id);
  const accountsQuery = useGetAccounts();
  const categoriesQuery = useGetcategory();

  const editMutation = useEditTransactions(id);
  const deleteMutation = useDeleteTransactions();

  const isLoading =
    transactionQuery.isLoading ||
    accountsQuery.isLoading ||
    categoriesQuery.isLoading;

  const isPending =
    editMutation.isPending || deleteMutation.isPending;

  const transaction = transactionQuery.data;

  const accountOptions = (accountsQuery.data ?? []).map(
    (account) => ({
      label: account.name,
      value: account.id,
    })
  );

  const categoryOptions = (categoriesQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    })
  );

  function handleSubmit(values: FormValues) {
    if (!id) return;

    editMutation.mutate(
      {
        date: values.date,
        accountId: values.accountId,
        amount: values.amount,
        payee: values.payee,
        notes: values.notes,
        categoryId: values.categoryId,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  }

  function handleDelete() {
    if (!id || isPending) return;

    if (!window.confirm("Delete this transaction?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="space-y-4 overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Update or delete this transaction.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : !id ? (
          <p className="text-sm text-muted-foreground">
            Select a transaction to edit.
          </p>
        ) : transactionQuery.isError ||
          accountsQuery.isError ||
          categoriesQuery.isError ? (
          <p className="text-sm text-red-500">
            Failed to load transaction details.
          </p>
        ) : !transaction ? (
          <p className="text-sm text-muted-foreground">
            Transaction not found.
          </p>
        ) : (
          <>
            <TransactionFrom
              key={id}
              id={id}
              disabled={isPending}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              defaultValues={{
                date: transaction.date,
                accountId: transaction.accountId,
                categoryId: transaction.categoryId,
                payee: transaction.payee,
                amount: transaction.amount,
                notes: transaction.notes,
              }}
              onSubmit={handleSubmit}
              onCreateCategory={() => {
                window.alert(
                  "Please create categories from the Categories page."
                );
              }}
              onCreateAccount={() => {
                window.alert(
                  "Please create accounts from the Accounts page."
                );
              }}
            />

            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Delete Transaction
            </Button>

            {editMutation.isError && (
              <p className="text-sm text-red-500">
                Failed to update transaction.
              </p>
            )}

            {deleteMutation.isError && (
              <p className="text-sm text-red-500">
                Failed to delete transaction.
              </p>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}