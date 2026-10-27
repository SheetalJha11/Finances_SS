"use client";

import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import {FaArrowTrendUp, FaArrowTrendDown} from "react-icons/fa6"
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { DataCard } from "@/components/data-card";

export function DataGrid() {
  const { data, isLoading, isError } = useGetSummary();

  const params = useSearchParams();

  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Failed to load summary.</div>;
  }

  return (
    <div className="container grid grid-cols-3 gap-4">
      <div className="ml-6">
      <DataCard
        title="Remaining"
        value={data.remainingAmount ?? 0}
        percentageChange={data.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
      </div>
      
       <DataCard
        title="Income" 
        value={data.incomeAmount ?? 0}
        percentageChange={data.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={dateRangeLabel}
      />
      
      <div className="mr-5">
       <DataCard
        title="Expenses"
        value={data.expensesAmount ?? 0}
        percentageChange={data.expensesChange}
        icon={FaArrowTrendDown}
        variant="default"
        dateRange={dateRangeLabel}/>
     </div>
      <p>{dateRangeLabel}</p>
    </div>
  );
}