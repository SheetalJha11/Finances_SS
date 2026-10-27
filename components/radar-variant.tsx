
"use client"

import {
  PolarGrid,
  PolarRadiusAxis,
  PolarAngleAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export function RadarVariant({ data }: Props) {
  console.log("Radar data:", data);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        No data available
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="70%"
        >
          <PolarGrid />

          <PolarAngleAxis dataKey="name" />

          <PolarRadiusAxis
            angle={30}
            domain={[0, "auto"]}
          />

          <Radar
            name="Value"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />

          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
