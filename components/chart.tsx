
import { 
  FileSearch, 
  AreaChart, 
  LineChart, 
  BarChart3 
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { AreaVariant } from "@/components/area-variant";
import { LineVariant } from "@/components/line-variant ";
import { BarVariant } from "@/components/bar-variant";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("area");

 const onTypeChange = (type: string | null) => {
  if (type !== null) {
    setChartType(type);
  }
};

  return (
    <Card className="border-none drop-shadow-sm ml-4 mr-4">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Transactions
        </CardTitle>
        <Select 
        defaultValue={chartType}
        onValueChange={onTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Area chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Line chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart3 className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Bar chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
  <div className="flex flex-col gap-y-4 items-center justify-center h-350px">
    <FileSearch className="size-6 text-muted-foreground" />
    <p className="text-muted-foreground text-sm">
      No data for this period
    </p>
  </div>
) : (
  <>
    {chartType === "area" && <AreaVariant data={data} />}
    {chartType === "line" && <LineVariant data={data} />}
    {chartType === "bar" && <BarVariant data={data} />}
  </>
        )}
      </CardContent>
    </Card>
  );
};