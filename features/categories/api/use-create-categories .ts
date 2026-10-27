
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories.$post>
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"]

export function useCreateCategory() {
    const queryClient = useQueryClient();
   
     const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
       queryKey: ["categories"],
      });
       toast.success("categories created successfully!");
    },
    onError: () => {
        toast.error("failed to created categories")
    }
  });

  return mutation;
};