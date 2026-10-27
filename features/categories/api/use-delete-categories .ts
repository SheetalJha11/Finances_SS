
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>

export function useDeletecategory() {const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, string>({
    mutationFn: async (id) => {
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id }
      });

      if (!response.ok) {
        throw new Error(await response.text())
      }

      return await response.json()
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success("Categories  deleted successfully!")
    },

    onError: (error) => {
      console.error("Delete categories error:", error)
      toast.error("Failed to delete categories")
    },
  });
}