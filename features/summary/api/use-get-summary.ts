

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetSummary = () => {
  const params = useSearchParams();

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  return useQuery({
    queryKey: ["summary", { from, to, accountId }],

    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const result = await response.json();
      const data = result.data;

      return {
        ...data,

        incomeAmount: convertAmountFromMiliunits(
          data.incomeAmount ?? 0
        ),

        expensesAmount: convertAmountFromMiliunits(
          data.expensesAmount ?? 0
        ),

        remainingAmount: convertAmountFromMiliunits(
          data.remainingAmount ?? 0
        ),

        categories: (data.categories ?? []).map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value ?? 0),
        })),

     
days: (data.days ?? []).map(
  (day: {
    date: string;
    income: number | null;
    expenses: number | null;
  }) => ({
    ...day,
    date: day.date,
    income: convertAmountFromMiliunits(day.income ?? 0),
    expenses: convertAmountFromMiliunits(day.expenses ?? 0),
  })
),

      };
    },
  });
};