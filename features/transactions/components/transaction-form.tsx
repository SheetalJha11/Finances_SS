
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, FileText, Plus, UserRound, Wallet } from "lucide-react";
import {convertAmountToMiliunits} from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
date: z.coerce.date(),
accountId: z.string().min(1, "Please select an account"),
categoryId: z.string().nullable().optional(),
payee: z.string().trim().min(1, "Payee is required"),
amount: z.coerce.number().positive("Amount must be greater than zero"),
notes: z.string().nullable().optional(),
});

type FormInput = z.input<typeof formSchema>;
export type FormValues = z.output<typeof formSchema>;

type Option = {
label: string;
value: string;
};

type Props = {
id?: string;
defaultValues?: Partial<FormInput>;
onSubmit: (values: FormValues) => void;
onDelete?: () => void;
disabled?: boolean;
categoryOptions: Option[];
accountOptions: Option[];
onCreateCategory: (name: string) => void;
onCreateAccount: (name: string) => void;
};

export function TransactionFrom({
id,
defaultValues,
onSubmit,
onDelete,
disabled = false,
categoryOptions,
accountOptions,
onCreateCategory,
onCreateAccount,
}: Props) {
const form = useForm<FormInput, unknown, FormValues>({
resolver: zodResolver(formSchema),
defaultValues: {
date: new Date(),
accountId: "",
categoryId: "",
payee: "",
amount: "",
notes: "",
...defaultValues,
},
});

const handleCreateCategory = () => {
const name = window.prompt("Enter category name");
 
if (name?.trim()) {
  onCreateCategory(name.trim());
}

};

const handleCreateAccount = () => {
const name = window.prompt("Enter account name");
if (name?.trim()) {
  onCreateAccount(name.trim());
}

};

return (
<Form {...form}>
  <div className="p-6">
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
<FormField
control={form.control}
name="payee"
render={({ field }) => (
<FormItem>
<FormLabel className="flex items-center gap-2">
<UserRound className="size-4" />
Payee
</FormLabel>
<FormControl>
<Input
placeholder="Who did you pay?"
className="h-11"
disabled={disabled}
{...field}
value={field.value ?? ""}
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>

   <FormField
  control={form.control}
  name="amount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Amount</FormLabel>

      <FormControl>
        <Input
          type="number"
          step="any"
          min="0"
          placeholder="Enter amount"
          disabled={disabled}
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          value={
            typeof field.value === "number" ||
            typeof field.value === "string"
              ? field.value
              : ""
          }
          onChange={(event) => {
            field.onChange(event.target.value);
          }}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

    <FormField
      control={form.control}
      name="date"
      render={({ field }) => {
        const rawDate = field.value;

        const dateValue =
          rawDate instanceof Date
            ? rawDate
            : rawDate
              ? new Date(String(rawDate))
              : null;

        const formattedDate =
          dateValue && !Number.isNaN(dateValue.getTime())
            ? `${dateValue.getFullYear()}-${String(
                dateValue.getMonth() + 1
              ).padStart(2, "0")}-${String(
                dateValue.getDate()
              ).padStart(2, "0")}`
            : "";

        return (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              Date
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                className="h-11"
                disabled={disabled}
                value={formattedDate}
                onChange={(event) => {
                  const value = event.target.value;

                  field.onChange(
                    value ? new Date(`${value}T00:00:00`) : undefined
                  );
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />

    <FormField
      control={form.control}
      name="accountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <select
                className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm]"
                disabled={disabled}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              >
                <option value="">Select an account</option>
                {accountOptions.map((account) => (
                  <option key={account.value} value={account.value}>
                    {account.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <Button
              type="submit"
              onClick={() => console.log("🖱️ Submit button clicked")}
              disabled={disabled}
            >
              <Plus className="mr-1 size-4" />
              Add
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <select
                className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                disabled={disabled}
                value={field.value ?? ""}
                onChange={(event) =>
                  field.onChange(event.target.value || null)
                }
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              >
                <option value="">Select a category</option>
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={handleCreateCategory}
            >
              <Plus className="mr-1 size-4" />
              Add
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <FileText className="size-4" />
            Notes (optional)
          </FormLabel>
          <FormControl>
            <Input
              placeholder="Add transaction notes"
              className="h-11"
              disabled={disabled}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="space-y-3 border-t pt-5">
      <Button
        type="submit"
        className="h-11 w-full bg-blue-700 text-white hover:bg-blue-800"
        disabled={disabled}
      >
        {id ? "Save Changes" : "Create Transaction"}
      </Button>

      {id && onDelete && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={disabled}
          onClick={onDelete}
        >
          Delete Transaction
        </Button>
      )}
    </div>
  </form>
  </div>
</Form>

);
}
