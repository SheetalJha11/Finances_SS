
"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { SpendingPie } from "./spending-pie";
import { Chart } from "./chart";

export function DataCharts() {
  const { data, isLoading, error } = useGetSummary();

  console.log("Summary data:", data);
  console.log("Chart days:", data?.days);
  console.log("Categories from summary:", data?.categories);
  console.log("Summary error:", error);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Chart data={data?.days ?? []} />
      </div>

      <div>
        <SpendingPie data={data?.categories ?? []} />
      </div>
    </div>
  );
}
