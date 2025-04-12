"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, DollarSign, Leaf, Users } from "lucide-react";

interface CampaignProgressCardProps {
  totalRaised: number;
  targetAmount: number;
  ethToMyrRate: number;
  myrValues: {
    totalRaised: number;
    targetAmount: number;
    remainingAmount: number;
  };
}

export default function CampaignProgressCard({
  totalRaised,
  targetAmount,
  ethToMyrRate,
  myrValues,
}: CampaignProgressCardProps) {
  const percentRaised = Math.min(
    Math.round((totalRaised / targetAmount) * 100),
    100
  );
  const remainingAmount =
    targetAmount - totalRaised > 0 ? targetAmount - totalRaised : 0;

  const data = [
    { name: "Raised", value: totalRaised, color: "#2563eb" }, // blue-600
    { name: "Remaining", value: remainingAmount, color: "#e2e8f0" }, // slate-200
  ];

  return (
    <div className="mb-12">
      <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 overflow-hidden">
        <div className="relative">
          <img
            src="/classroom.jpg"
            alt="Campaign Banner"
            className="h-[200px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-blue-600 rounded-full px-3 py-1 text-xs font-medium">
                  Active Campaign
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-black/30 text-white border-white/20 rounded-full px-3 py-1 text-xs font-medium"
                >
                  Goal: {(targetAmount * ethToMyrRate).toLocaleString()} MYR (
                  {targetAmount.toFixed(2)} ETH)
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                Education for Kids in Rural Areas
              </h1>
              <p className="text-zinc-200 text-sm max-w-3xl mb-3">
                A comprehensive initiative to build and equip modern schools for
                underserved students in remote Malaysian villages.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  <Leaf className="h-3 w-3 mr-1" />
                  Sustainable Design
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Educational Resources
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  <Users className="h-3 w-3 mr-1" />
                  Community Involvement
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3 h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold text-2xl fill-blue-600"
                  >
                    {percentRaised}%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      Raised so far
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {percentRaised}% of goal
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-medium text-blue-700 dark:text-blue-400">
                    {myrValues.totalRaised.toLocaleString()} MYR /{" "}
                    {myrValues.targetAmount.toLocaleString()}.00 MYR
                  </div>
                  <div className="text-xs text-zinc-500">
                    ≈ {totalRaised.toFixed(4)} ETH
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Raised</div>
                  <div className="font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                    {myrValues.totalRaised.toLocaleString()} MYR
                  </div>
                  <div className="text-xs text-gray-500">
                    ≈ {totalRaised.toFixed(4)} ETH
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Remaining</div>
                  <div className="font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 text-slate-600 mr-1" />
                    {myrValues.remainingAmount.toLocaleString()} MYR
                  </div>
                  <div className="text-xs text-gray-500">
                    ≈ {remainingAmount.toFixed(4)} ETH
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{payload[0].value.toFixed(4)} ETH</p>
      </div>
    );
  }
  return null;
}
