"use client"

import {NewAccountSheet} from "@/features/accounts/components/new-accounts-sheet"
import {EditAccountSheet} from "@/features/accounts/components/edit-account-sheet"
import {EditCategoriesSheet} from "@/features/categories/components/edit-categories-sheet"
import {NewCategorySheet} from "@/features/categories/components/new-categories-sheet"
import { NewTransactionSheet } from "@/features/transactions/components/new-transactions-sheet"
import {EditTransactionSheet} from "@/features/transactions/components/edit-transaction-sheet"
import { useMountedState } from "react-use";

export function SheetProvider() {
  const isMounted = useMountedState()
  if ( !isMounted) {
    return null
  }
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet/>
      <EditCategoriesSheet/>
      <NewCategorySheet/>
      <NewTransactionSheet/>
      <EditTransactionSheet/>
    </>
  );
}