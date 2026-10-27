

import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useTnsaction = (id?: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["transactions", id],

    queryFn: async () => {
      if (!id) {
        throw new Error("Transactions ID is missing");
      }

      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Account API error:", {
          status: response.status,
          message: errorText,
          id,
        });

        throw new Error(
          `Failed to fetch transaction: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();

      console.log("TRANSACTIONS:", result.data);

      return result.data;
    },
  });
};
