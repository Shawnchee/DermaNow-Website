"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  PieChartIcon,
  BarChart3,
  Calendar,
  Filter,
  Download,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FlaggedTransactions from "@/components/flagging";

// Define types for our data
interface Project {
  id: number;
  title: string;
  total_amount: number;
  raised_amount: number;
  organization_name: string;
  status: "active" | "completed" | "pending";
  milestones_completed: number;
  total_milestones: number;
  category: string;
  created_at: string;
}

interface DailyDonation {
  date: string;
  amount: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MilestoneData {
  project_id: number;
  project_title: string;
  milestone_id: number;
  title: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  due_date: string;
}

const AnalyticsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dailyDonations, setDailyDonations] = useState<DailyDonation[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [totalFundsRaised, setTotalFundsRaised] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [timeframe, setTimeframe] = useState("30d");
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from your API/database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // In a real application, you would fetch this data from your API
      // For now, we'll use mock data

      // Mock projects data
      const mockProjects: Project[] = [
        {
          id: 1,
          title: "Clean Water Initiative",
          total_amount: 50000,
          raised_amount: 35000,
          organization_name: "Water For All",
          status: "active",
          milestones_completed: 2,
          total_milestones: 4,
          category: "Environment",
          created_at: "2023-01-15",
        },
        {
          id: 2,
          title: "Education for Rural Areas",
          total_amount: 75000,
          raised_amount: 75000,
          organization_name: "Education First",
          status: "completed",
          milestones_completed: 5,
          total_milestones: 5,
          category: "Education",
          created_at: "2023-02-10",
        },
        {
          id: 3,
          title: "Medical Supplies for Clinics",
          total_amount: 100000,
          raised_amount: 62000,
          organization_name: "Health Alliance",
          status: "active",
          milestones_completed: 3,
          total_milestones: 6,
          category: "Healthcare",
          created_at: "2023-03-05",
        },
        {
          id: 4,
          title: "Food Bank Expansion",
          total_amount: 30000,
          raised_amount: 28500,
          organization_name: "Food For All",
          status: "active",
          milestones_completed: 2,
          total_milestones: 3,
          category: "Food Security",
          created_at: "2023-03-20",
        },
        {
          id: 5,
          title: "Affordable Housing Project",
          total_amount: 200000,
          raised_amount: 120000,
          organization_name: "Shelter Now",
          status: "active",
          milestones_completed: 1,
          total_milestones: 4,
          category: "Housing",
          created_at: "2023-04-12",
        },
        {
          id: 6,
          title: "Youth Sports Program",
          total_amount: 25000,
          raised_amount: 25000,
          organization_name: "Active Youth",
          status: "completed",
          milestones_completed: 3,
          total_milestones: 3,
          category: "Sports",
          created_at: "2023-05-01",
        },
      ];

      // Generate daily donations for the last 30 days
      const today = new Date();
      const mockDailyDonations: DailyDonation[] = Array.from(
        { length: 30 },
        (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toISOString().split("T")[0],
            amount: Math.floor(Math.random() * 10000) + 1000,
          };
        }
      );

      // Mock category data
      const mockCategoryData: CategoryData[] = [
        { name: "Education", value: 35, color: "#3b82f6" },
        { name: "Healthcare", value: 25, color: "#60a5fa" },
        { name: "Environment", value: 15, color: "#93c5fd" },
        { name: "Food Security", value: 10, color: "#2563eb" },
        { name: "Housing", value: 10, color: "#1d4ed8" },
        { name: "Sports", value: 5, color: "#bfdbfe" },
      ];

      // Mock milestone data
      const mockMilestones: MilestoneData[] = [
        {
          project_id: 1,
          project_title: "Clean Water Initiative",
          milestone_id: 1,
          title: "Site Assessment",
          amount: 10000,
          status: "completed",
          due_date: "2023-02-15",
        },
        {
          project_id: 1,
          project_title: "Clean Water Initiative",
          milestone_id: 2,
          title: "Equipment Purchase",
          amount: 15000,
          status: "completed",
          due_date: "2023-03-30",
        },
        {
          project_id: 1,
          project_title: "Clean Water Initiative",
          milestone_id: 3,
          title: "Installation",
          amount: 20000,
          status: "pending",
          due_date: "2023-05-15",
        },
        {
          project_id: 1,
          project_title: "Clean Water Initiative",
          milestone_id: 4,
          title: "Training & Handover",
          amount: 5000,
          status: "pending",
          due_date: "2023-06-30",
        },
        {
          project_id: 2,
          project_title: "Education for Rural Areas",
          milestone_id: 5,
          title: "Curriculum Development",
          amount: 15000,
          status: "completed",
          due_date: "2023-03-01",
        },
        {
          project_id: 3,
          project_title: "Medical Supplies for Clinics",
          milestone_id: 6,
          title: "Initial Supply Purchase",
          amount: 30000,
          status: "completed",
          due_date: "2023-04-01",
        },
      ];

      // Calculate total funds raised
      const totalRaised = mockProjects.reduce(
        (sum, project) => sum + project.raised_amount,
        0
      );
      const completed = mockProjects.filter(
        (p) => p.status === "completed"
      ).length;

      setProjects(mockProjects);
      setDailyDonations(mockDailyDonations);
      setCategoryData(mockCategoryData);
      setMilestones(mockMilestones);
      setTotalFundsRaised(totalRaised);
      setTotalProjects(mockProjects.length);
      setCompletedProjects(completed);
      setLoading(false);
    };

    fetchData();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto pt-24 pb-16 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                Securities Commission Malaysia
              </h1>
              <p className="text-gray-600 mt-1">
                Charity Fundraising Analytics Dashboard
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-blue-200"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-blue-200"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px] border-blue-200">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-600 font-medium">
                  Total Funds Raised
                </CardDescription>
                <CardTitle className="text-3xl font-bold flex items-center">
                  {formatCurrency(totalFundsRaised)}
                  <span className="text-green-500 text-sm font-normal ml-2 flex items-center">
                    <ArrowUpRight className="h-4 w-4" />
                    12.5%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyDonations.slice(-7)}>
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">vs. previous period</p>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-600 font-medium">
                  Project Completion
                </CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {completedProjects}/{totalProjects}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-medium">
                      {formatPercentage(completedProjects, totalProjects)}
                    </span>
                  </div>
                  <Progress
                    value={(completedProjects / totalProjects) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">
                  {totalProjects - completedProjects} projects in progress
                </p>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-600 font-medium">
                  Milestone Completion
                </CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {milestones.filter((m) => m.status === "completed").length}/
                  {milestones.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-medium">
                      {formatPercentage(
                        milestones.filter((m) => m.status === "completed")
                          .length,
                        milestones.length
                      )}
                    </span>
                  </div>
                  <Progress
                    value={
                      (milestones.filter((m) => m.status === "completed")
                        .length /
                        milestones.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">
                  {milestones.filter((m) => m.status === "pending").length}{" "}
                  milestones pending
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Donations Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-blue-100 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900">
                    Donations Over Time
                  </CardTitle>
                  <CardDescription>Daily donation amounts</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-700"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Last 30 days
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyDonations}
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
        </motion.div>

        {/* Project Tracking and Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Project Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-blue-100 shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Project Tracking
                </CardTitle>
                <CardDescription>
                  Status and progress of all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              project.status === "completed"
                                ? "bg-green-500"
                                : project.status === "active"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          <h3 className="font-medium">{project.title}</h3>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              project.status === "completed"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : project.status === "active"
                                ? "border-blue-200 text-blue-700 bg-blue-50"
                                : "border-yellow-200 text-yellow-700 bg-yellow-50"
                            }
                          `}
                        >
                          {project.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : project.status === "active" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {project.organization_name} • {project.category}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(project.raised_amount)} /{" "}
                          {formatCurrency(project.total_amount)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Fundraising Progress</span>
                          <span>
                            {formatPercentage(
                              project.raised_amount,
                              project.total_amount
                            )}
                          </span>
                        </div>
                        <Progress
                          value={
                            (project.raised_amount / project.total_amount) * 100
                          }
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Milestones: {project.milestones_completed}/
                          {project.total_milestones}
                        </span>
                        <span>
                          Created:{" "}
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demographics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-blue-100 shadow-md h-full">
              <Tabs defaultValue="pie">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-blue-900">
                        Charity Demographics
                      </CardTitle>
                      <CardDescription>
                        Distribution by category
                      </CardDescription>
                    </div>
                    <TabsList className="grid w-20 grid-cols-2">
                      <TabsTrigger value="pie" className="p-1">
                        <PieChartIcon className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="bar" className="p-1">
                        <BarChart3 className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent value="pie" className="mt-0">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="bar" className="mt-0">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                          />
                          <XAxis type="number" tick={{ fontSize: 12 }} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 12 }}
                            width={80}
                          />
                          <Tooltip />
                          <Bar dataKey="value" name="Percentage">
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Top Categories</h4>
                    <div className="space-y-2">
                      {categoryData.slice(0, 3).map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {category.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>

        {/* Flagging */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FlaggedTransactions />
          </motion.div>
        </div>

        {/* Milestone Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-blue-100 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">
                Milestone Tracking
              </CardTitle>
              <CardDescription>
                Track fund disbursement and milestone completion
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                          <div className="font-medium">
                            {milestone.project_title}
                          </div>
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
