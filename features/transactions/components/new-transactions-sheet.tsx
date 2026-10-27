import {
        Sheet,
        SheetContent, 
        SheetHeader, 
        SheetTitle, 
        SheetDescription
    } from "@/components/ui/sheet"  
import {useNewTransactions} from "@/features/transactions/hooks/use-new-transactions"
import { Loader2 } from "lucide-react";
import {categories, insertTransactionsSchema} from "@/db/schema";
import z from "zod";
import  {useCreateTransactions} from "@/features/transactions/api/use-create-transactions "
import { useGetcategory } from "@/features/categories/api/use-get-category";
import { useCreateCategory } from "@/features/categories/api/use-create-categories ";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import {convertAmountToMiliunits} from "@/lib/utils"
import {
TransactionFrom,
type FormValues,
} from "./transaction-form";

export function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransactions();

  const mutation = useCreateTransactions();

  const categoryQuery = useGetcategory();
  const categoryMutation = useCreateCategory();

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name });
  };

  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const isPending =
    mutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const handleSubmit = (values: FormValues) => {
  const amountToMiliunits = convertAmountToMiliunits(values.amount);
     console.log("FORM SUBMIT BUTTON IS WORKING");
    console.log("Form values:", values);
  mutation.mutate(
    {
      ...values,
      amount: amountToMiliunits,
    },
    {
      onSuccess: (data) => {
        console.log("Transaction created:", data);
        onClose();
      },
      onError: (error) => {
        console.error("Transaction error:", error);
      },
    }
  );
};

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            New Transaction
          </SheetTitle>

          
        </SheetHeader>

        <div className="px-1 py-5">
          {isLoading ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3">
              <Loader2 className="size-6 animate-spin text-blue-600" />
              <p>
                Loading accounts and categories...
              </p>
            </div>
          ) : (
            <TransactionFrom
              onSubmit={handleSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              accountOptions={accountOptions}
              onCreateCategory={onCreateCategory}
              onCreateAccount={onCreateAccount}
            />
          )}

          {mutation.isError && (
            <p className="mt-4 text-sm text-destructive">
              Failed to create transaction. Please try again.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}