import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DailyDonation {
  date: string;
  amount: number;
}

interface DonationChartProps {
  data: DailyDonation[];
  timeframe: string;
}

export function DonationChart({ data, timeframe }: DonationChartProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="text-sm text-gray-600">{`Date: ${label}`}</p>
          <p className="text-sm font-medium text-blue-600">{`Amount: ${formatCurrency(
            payload[0].value
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-blue-100 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-blue-900">
              Donations Over Time
            </CardTitle>
            <CardDescription>Daily donation amounts</CardDescription>
          </div>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            <Calendar className="h-3 w-3 mr-1" />
            {timeframe === "7d"
              ? "Last 7 days"
              : timeframe === "30d"
              ? "Last 30 days"
              : timeframe === "90d"
              ? "Last 90 days"
              : "Last year"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `RM${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Donation Amount"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface MilestoneData {
  project_id: number;
  project_title: string;
  milestone_id: number;
  title: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  due_date: string;
}

interface MilestoneTableProps {
  milestones: MilestoneData[];
}

export function MilestoneTable({ milestones }: MilestoneTableProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Project
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Milestone
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Amount
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Due Date
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((milestone) => (
            <tr
              key={milestone.milestone_id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="font-medium">{milestone.project_title}</div>
                <div className="text-xs text-gray-500">
                  ID: {milestone.project_id}
                </div>
              </td>
              <td className="py-3 px-4">{milestone.title}</td>
              <td className="py-3 px-4 font-medium">
                {formatCurrency(milestone.amount)}
              </td>
              <td className="py-3 px-4">
                {new Date(milestone.due_date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant="outline"
                  className={`
                    ${
                      milestone.status === "completed"
                        ? "border-green-200 text-green-700 bg-green-50"
                        : milestone.status === "pending"
                        ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                        : "border-red-200 text-red-700 bg-red-50"
                    }
                  `}
                >
                  {milestone.status === "completed" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : milestone.status === "pending" ? (
                    <Clock className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {milestone.status.charAt(0).toUpperCase() +
                    milestone.status.slice(1)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
