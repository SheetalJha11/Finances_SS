


import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export function useDeleteAccount() {const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, string>({
    mutationFn: async (id) => {
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });

      toast.success("Account deleted successfully!");
    },

    onError: (error) => {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
    },
  });
}