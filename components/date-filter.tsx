
"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import qs from "query-string";
import {
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";

import { cn, formatDateRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DEFAULT_DAYS = 30;

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const accountId = searchParams.get("accountId");
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, DEFAULT_DAYS);

  const paramState: DateRange = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);
  const [open, setOpen] = useState(false);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      accountId,
      from: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : undefined,
      to: dateRange?.to
        ? format(dateRange.to, "yyyy-MM-dd")
        : undefined,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
    setOpen(false);
  };

  const onApply = () => {
    pushToUrl(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          className="h-9 w-full rounded-md border-none bg-white/10 px-3 font-normal text-white transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-0 focus:ring-offset-0 lg:w-auto"
        >
          <CalendarIcon className="mr-2 size-4" />

          <span>
  {formatDateRange({
    from: paramState.from!,
    to: paramState.to!,
  })}
</span>

          <ChevronDown className="ml-auto size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("w-full p-0 lg:w-auto")}
        align="start"
      >
       <Calendar
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        />
        <div className="flex w-full items-center gap-x-2 p-4">
          <Button
            onClick={onReset}
            disabled={!date?.from && !date?.to}
            className="w-full"
            variant="outline"
          >
            Reset
          </Button>

          <Button
            onClick={onApply}
            disabled={!date?.from || !date?.to}
            className="w-full"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
