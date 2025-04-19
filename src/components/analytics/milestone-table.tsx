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
