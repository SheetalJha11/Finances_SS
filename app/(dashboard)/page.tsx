"use client";


import {DataGrid} from "@/components/ui/data-grid"
import {DataCharts} from "@/components/data-charts"

export default function Page() {

  return (
    <div className=" pb-6 -mt-17">
      <DataGrid />
      <DataCharts/>
    </div>
  );
}