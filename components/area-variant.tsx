



"use client";

import { format, parseISO } from "date-fns";
import {CustomTooltip} from "@/components/custom-tooltip"
import {
  XAxis,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export function AreaVariant({ data = [] }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d82f6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical
          horizontal={false}
          strokeDasharray="2 2"
          stroke="#d4d4d8"
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: string) =>
            format(parseISO(value), "dd MMM")
          }
          tick={{ fontSize: 10, fill: "#737373" }}
          tickMargin={12}
          minTickGap={5}
        />

        <Tooltip content={<CustomTooltip/>}/>

        <Area
          type="monotone"
          dataKey="income"
          stackId="income"
          stroke="#3d82f6"
          strokeWidth={2}
          fill="url(#incomeGradient)"
        />

        <Area
          type="monotone"
          dataKey="expenses"
          stackId="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          fill="url(#expensesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
