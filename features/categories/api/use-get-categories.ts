import { useQuery } from "@tanstack/react-query";

export const useGetcategories = () => { 
return useQuery({
queryKey: ["categories"],
queryFn: async () => {
const response = await fetch("/api/categories");

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();

  console.log("CATEGORIES LIST:", result.data);

  return result.data;
},
});
};