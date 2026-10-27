

import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetAccount = (id?: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["accounts", id],

    queryFn: async () => {
      if (!id) {
        throw new Error("Account ID is missing");
      }

      const response = await client.api.accounts[":id"].$get({
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
          `Failed to fetch account: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();

      console.log("ACCOUNT:", result.data);

      return result.data;
    },
  });
};
