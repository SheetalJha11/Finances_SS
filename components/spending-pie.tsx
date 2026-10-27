
"use client";

import {
  FileSearch,
  PieChart,
  Target,
  BarChart3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PieVariant } from "@/components/pie-variant";
import { RadarVariant } from "@/components/radar-variant";
import { RadialVariant } from "@/components/radial-variant";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

type ChartType = "pie" | "radar" | "bar";

export const SpendingPie = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState<ChartType>("pie");

  const onTypeChange = (type: string | null) => {
    if (type === "pie" || type === "radar" || type === "bar") {
      setChartType(type);
    }
  };

  const validData = data.filter(
    (item) =>
      typeof item.name === "string" &&
      typeof item.value === "number" &&
      Number.isFinite(item.value) &&
      item.value > 0
  );

  console.log("SpendingPie data:", data);
  console.log("Valid chart data:", validData);
  console.log("Selected chart:", chartType);

  return (
    <Card className="mx-4 min-w-0 border-none drop-shadow-sm">
      <CardHeader className="flex flex-col justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">
          Categories
        </CardTitle>

        <Select value={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="pie">
              <span className="flex items-center">
                <PieChart className="mr-2 size-4" />
                Pie chart
              </span>
            </SelectItem>

            <SelectItem value="radar">
              <span className="flex items-center">
                <Target className="mr-2 size-4" />
                Radar chart
              </span>
            </SelectItem>

            <SelectItem value="bar">
              <span className="flex items-center">
                <BarChart3 className="mr-2 size-4" />
                Radial bar chart
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="min-w-0">
        {validData.length === 0 ? (
          <div className="flex h-[350px] flex-col items-center justify-center gap-y-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No valid category data for this period
            </p>
          </div>
        ) : (
          <div className="min-h-[350px] min-w-0 w-full">
            {chartType === "pie" && <PieVariant data={validData} />}
            {chartType === "radar" && <RadarVariant data={validData} />}
            {chartType === "bar" && <RadialVariant data={validData} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
