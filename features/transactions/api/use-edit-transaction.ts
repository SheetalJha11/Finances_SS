

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];


export function useEditTransactions(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Transactions ID is missing")
      }
      
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions", id],
      });

      toast.success("Transactions updated successfully!");
    },

    onError: (error) => {
      console.error("Failed to update transactions:", error);
      toast.error("Failed to update transactions");
    },
  });

  return mutation;
}