
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts.$post>
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"]

export function useCreateAccount() {
    const queryClient = useQueryClient();
   
     const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
       queryKey: ["account"],
      });
       toast.success("Account created successfully!");
    },
    onError: () => {
        toast.error("failed to created accounts")
    }
  });

  return mutation;
};