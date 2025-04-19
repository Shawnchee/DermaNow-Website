import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  organization: string;
  category: string;
  raisedAmount: number;
  totalAmount: number;
  status: "active" | "completed" | "pending";
  milestonesCompleted: number;
  totalMilestones: number;
  createdAt: string;
}

export function ProjectCard({
  id,
  title,
  organization,
  category,
  raisedAmount,
  totalAmount,
  status,
  milestonesCompleted,
  totalMilestones,
  createdAt,
}: ProjectCardProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number, total: number) => {
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "completed"
                  ? "bg-green-500"
                  : status === "active"
                  ? "bg-blue-500"
                  : "bg-yellow-500"
              }`}
            />
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`
              ${
                status === "completed"
                  ? "border-green-200 text-green-700 bg-green-50"
                  : status === "active"
                  ? "border-blue-200 text-blue-700 bg-blue-50"
                  : "border-yellow-200 text-yellow-700 bg-yellow-50"
              }
            `}
          >
            {status === "completed" ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : status === "active" ? (
              <Clock className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {organization} • {category}
            </span>
            <span className="font-medium">
              {formatCurrency(raisedAmount)} / {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Fundraising Progress</span>
              <span>{formatPercentage(raisedAmount, totalAmount)}</span>
            </div>
            <Progress
              value={(raisedAmount / totalAmount) * 100}
              className="h-2"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Milestones: {milestonesCompleted}/{totalMilestones}
            </span>
            <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
