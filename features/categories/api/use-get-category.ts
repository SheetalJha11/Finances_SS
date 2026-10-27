 
import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  typeof client.api.categories.$get
>;

export const useGetcategory = () => {
  return useQuery({
    queryKey: ["categories"],

queryFn: async () => {
  const response = await client.api.categories.$get();

  console.log("Categories status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Categories API error:", errorText);

    throw new Error(`Failed to fetch categories (${response.status})`);
  }

  const result: ResponseType = await response.json();

  console.log("Categories data:", result.data);

  return result.data;
},
  });
};
