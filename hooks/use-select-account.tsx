
"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export function useSelectAccount(): [
  () => JSX.Element,
  () => Promise<string | null>
] {
  const [promise, setPromise] = useState<{
    resolve: (value: string | null) => void;
  } | null>(null);

  const [selectedAccountId, setSelectedAccountId] = useState("");

  const accountQuery = useGetAccounts();

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const confirm = () =>
    new Promise<string | null>((resolve) => {
      setSelectedAccountId("");
      setPromise({ resolve });
    });

  const handleClose = () => {
    promise?.resolve(null);
    setPromise(null);
  };

  const handleConfirm = () => {
    if (!selectedAccountId) return;

    promise?.resolve(selectedAccountId);
    setPromise(null);
  };

  const ConfirmationDialog = () => (
    <Dialog
      open={!!promise}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an account</DialogTitle>
          <DialogDescription>
            Choose the account you want to use.
          </DialogDescription>
        </DialogHeader>

        {accountQuery.isLoading ? (
          <p>Loading accounts...</p>
        ) : accountQuery.isError ? (
          <p>Failed to load accounts. Please try again.</p>
        ) : accountOptions.length === 0 ? (
          <p>No accounts found. Please create an account first.</p>
        ) : (
          <Select
            value={selectedAccountId}
            onValueChange={(value) =>
            setSelectedAccountId(value ?? "")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>

            <SelectContent>
              {accountOptions.map((account) => (
                <SelectItem
                  key={account.value}
                  value={account.value}
                >
                  {account.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={
              !selectedAccountId ||
              accountQuery.isLoading ||
              accountQuery.isError
            }
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
}
