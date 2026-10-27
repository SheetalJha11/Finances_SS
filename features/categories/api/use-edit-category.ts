

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];


export function useEditCategory(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Categories ID is missing")
      }
      
      const response = await client.api.categories[":id"]["$patch"]({
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
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["categories", id],
      });

      toast.success("Categories updated successfully!");
    },

    onError: (error) => {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category");
    },
  });

  return mutation;
}