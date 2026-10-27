
"use client";

import {
  ResponsiveContainer,
  RadialBar,
  RadialBarChart,
  Legend,
  Tooltip,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0062D2", "#10B981", "#F59E0B", "#EF4444"];

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export const RadialVariant = ({ data }: Props) => {
  const chartData = data.filter(
    (item) =>
      Number.isFinite(item.value) && item.value > 0
  ).map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
        No category data available
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="45%"
          innerRadius="20%"
          outerRadius="75%"
          barSize={14}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            background
            cornerRadius={6}
          />

          <Tooltip
            formatter={(value) => [
              formatCurrency(Number(value)),
              "Amount",
            ]}
          />

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">
                {value}
              </span>
            )}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};
