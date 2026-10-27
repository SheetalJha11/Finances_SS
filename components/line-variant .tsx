
import {
  XAxis,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { CustomTooltip } from "@/components/custom-tooltip";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export function LineVariant({ data = [] }: Props) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
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
          minTickGap={20}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#737373" }}
          width={45}
          tickFormatter={(value: number) =>
            new Intl.NumberFormat("en-IN", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(value)
          }
        />

        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dot={false}
          activeDot={{ r: 4 }}
          dataKey="income"
          name="Income"
          stroke="#3b82f6"
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dot={false}
          activeDot={{ r: 4 }}
          dataKey="expenses"
          name="Expenses"
          stroke="#f43f5e"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

