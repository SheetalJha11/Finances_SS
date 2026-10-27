
import { useQuery } from "@tanstack/react-query";

type Account = {
  id: string;
  name: string;
};

type AccountsResponse = {
  data: Account[];
};

export const useGetAccounts = () => {
  return useQuery<Account[]>({
    queryKey: ["accounts", "list"],
    queryFn: async () => {
      const response = await fetch("/api/accounts");

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const result: AccountsResponse = await response.json();

      return result.data;
    },
  });
};
