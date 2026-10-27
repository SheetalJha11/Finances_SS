import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"]

export function useBulkCreateTransactions() {
    const queryClient = useQueryClient();
   
     const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"]["$post"]({ json });

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
       queryKey: ["transactions"],
      });
       toast.success("transactions Create");
    },
    onError: () => {
        toast.error("failed to create transactions")
    }
  });

  return mutation;
};