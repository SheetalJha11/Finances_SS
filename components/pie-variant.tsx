
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatPercentage } from "@/lib/utils";

const COLORS = ["#0062FF", "#12C6FF", "#FF6474", "#FF9354"];

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export function PieVariant({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip />
        <Legend />

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`Cell - ${index}`} fill={COLORS[index % COLORS.length]}/>
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}