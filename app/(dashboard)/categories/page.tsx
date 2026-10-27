"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNewcategories } from "@/features/categories/hooks/use-new-categories";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/tables";
import { useGetcategory } from "@/features/categories/api/use-get-category";
import { useBulkcategories } from "@/features/categories/api/use-bulk-categories ";

export default function CategoriesPage() {
  const { onOpen } = useNewcategories();

  const categoryQuery = useGetcategory();
  const categoriesData = categoryQuery.data ?? [];

  const deleteCategories = useBulkcategories();

  const isDisabled =
    categoryQuery.isLoading || deleteCategories.isPending;

  if (categoryQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-6 -mt-17 flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (categoryQuery.isError) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-6">
        <p className="text-sm text-red-500">
          Failed to load categories: {categoryQuery.error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-6 -mt-17">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Categories
          </CardTitle>

          <Button onClick={onOpen} size="sm" className="pl-2">
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
  filterKey="name"
  columns={columns}
  data={categoriesData}
  onDelete={(rows) => {
    const ids = rows.map((row) => row.original.id);

    deleteCategories.mutate({ ids });
  }}
  disabled={isDisabled}
/>
        </CardContent>
      </Card>
    </div>
  );
}