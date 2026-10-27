
"use client";

import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {convertAmountFromMiliunits} from "@/lib/utils"

export const useGetTransactions = () => {
const params = useSearchParams();

const from = params.get("from") || "";
const to = params.get("to") || "";
const accountId = params.get("accountId") || "";

return useQuery({
queryKey: ["transactions", { from, to, accountId }],


queryFn: async () => {
  const response = await client.api.transactions.$get({
    query: {
      from,
      to,
      accountId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const result = await response.json();

  console.log("TRANSACTIONS API DATA:", result.data);

  const transactions = Array.isArray(result.data)
    ? result.data
    : result.data
      ? [result.data]
      : [];

  console.log("TRANSACTIONS ARRAY:", transactions);
   

  return transactions;
},


});
};
