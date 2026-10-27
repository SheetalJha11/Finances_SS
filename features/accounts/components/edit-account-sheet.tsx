
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { useOpenAccount } from "../hooks/use-open-account";
import { AccountFrom } from "./accounts-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useGetAccount } from "../api/use-get-account";
import { useEditAccounts } from "../api/use-edit-account"
import { useDeleteAccount } from "../api/use-delete-account";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccounts(id);
  const deleteMutation = useDeleteAccount();

  const isLoading = accountQuery.isLoading;
  const isPending =
    editMutation.isPending || deleteMutation.isPending;

  function handleSubmit(value: FormValues) {
    if (!id) return;

    editMutation.mutate(
      { name: value.name },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }

  function handleDelete() {
    if (!id) return;

    const confirmed = window.confirm(
       "Are you sure you want to delete this account?"
    );

    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  const defaultValues: FormValues = {
    name: accountQuery.data?.name ?? "",
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="space-y-4 bg-white">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Edit or delete your account.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : accountQuery.isError ? (
          <p className="text-sm ">
            Failed to load account. Please try again.
          </p>
        ) : !id ? (
          <p className="text-sm ">
            Please select an account to edit.
          </p>
        ) : (
          <>
            <AccountFrom
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
            />

            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? (
                <Loader2  />
              ) : (
                <Trash2/>
              )}
              Delete Account
            </Button>
          </>
        )}

          {editMutation.isError && (
          <p className="text-sm ">
            Failed to update account. Please try again.
          </p>
        )}

        {deleteMutation.isError && (
          <p className="text-sm">
            Failed to delete account. Please try again.
          </p>
        )} 
      </SheetContent>
    </Sheet>
  );
}