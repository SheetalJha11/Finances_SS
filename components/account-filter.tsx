

"use client";

import qs from "query-string";
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AccountFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const accountId = searchParams.get("accountId") || "all";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const {
    isLoading: isLoadingSummary,
  } = useGetSummary();

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
  } = useGetAccounts();

  const onChange = (newValue: string | null) => {
    // Handle the possible null value.
    if (newValue === null) return;

    const query = {
      accountId: newValue === "all" ? "" : newValue,
      from,
      to,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  };

  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={isLoadingAccounts || isLoadingSummary}
    >
      <SelectTrigger
        className="h-9 w-full rounded-md border-none bg-white/10 px-3 font-normal text-white transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-0 focus:ring-offset-0 lg:w-auto"
      >
        <SelectValue placeholder="Select account" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All accounts
        </SelectItem>

        {accounts?.map((account) => (
          <SelectItem
            key={account.id}
            value={account.id}
          >
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
