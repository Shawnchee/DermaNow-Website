"use client"

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  BarChart,
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MoreHorizontal,
  Search,
  Settings,
  Users,
  Wallet,
  Building,
  CalendarCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const fundAllocationData = [
    { name: 'Zakat', value: 45 },
    { name: 'Waqf', value: 30 },
    { name: 'Sadaqah', value: 25 },
  ];

  const monthlyDonationsData = [
    { month: 'Jan', donations: 12000 },
    { month: 'Feb', donations: 19000 },
    { month: 'Mar', donations: 15000 },
    { month: 'Apr', donations: 22000 },
    { month: 'May', donations: 28000 },
    { month: 'Jun', donations: 32000 },
  ];

  const projectsData = [
    {
      id: 1,
      name: 'Orphanage Construction',
      type: 'Waqf',
      progress: 70,
      raised: '240,000',
      goal: '300,000',
      status: 'In Progress',
      nextMilestone: 'Roof Construction',
    },
    {
      id: 2,
      name: 'Food Distribution Program',
      type: 'Zakat',
      progress: 90,
      raised: '92,000',
      goal: '100,000',
      status: 'In Progress',
      nextMilestone: 'Final Distribution',
    },
    {
      id: 3,
      name: 'Water Well Construction',
      type: 'Sadaqah',
      progress: 40,
      raised: '20,000',
      goal: '50,000',
      status: 'In Progress',
      nextMilestone: 'Equipment Purchase',
    },
    {
      id: 4,
      name: 'Islamic School Renovation',
      type: 'Waqf',
      progress: 100,
      raised: '150,000',
      goal: '150,000',
      status: 'Completed',
      nextMilestone: 'Completed',
    },
  ];

  const pendingVerificationsData = [
    {
      id: 1,
      projectName: 'Medical Aid for Gaza',
      type: 'Zakat',
      submittedDate: '15 Apr 2025',
      requestedAmount: '75,000',
    },
    {
      id: 2,
      projectName: 'Yemen Food Relief',
      type: 'Sadaqah',
      submittedDate: '16 Apr 2025',
      requestedAmount: '45,000',
    },
    {
      id: 3,
      projectName: 'Mosque Renovation',
      type: 'Waqf',
      submittedDate: '17 Apr 2025',
      requestedAmount: '120,000',
    }
  ];

  const pendingDisbursementsData = [
    {
      id: 1,
      projectName: 'Orphanage Construction',
      milestone: 'Foundation Completion',
      amount: '50,000',
      dueDate: '22 Apr 2025',
    },
    {
      id: 2,
      projectName: 'Food Distribution Program',
      milestone: 'Supply Purchase',
      amount: '25,000',
      dueDate: '20 Apr 2025',
    }
  ];

  const stakingRewardsData = [
    {
      id: 1,
      source: 'Mudarabah Pool A',
      amount: '3,250',
      distribution: 'Zakat Pool',
      date: '15 Apr 2025',
    },
    {
      id: 2,
      source: 'Sukuk Investment',
      amount: '1,750',
      distribution: 'Waqf Pool',
      date: '17 Apr 2025',
    }
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
     

      {/* Main Content */}
      <div className="container mx-auto px-8 py-24 flex-1">
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="project-verification" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Project Verification
            </TabsTrigger>
            <TabsTrigger value="fund-management" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Fund Management
            </TabsTrigger>
            <TabsTrigger value="milestone-oversight" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Milestone Oversight
            </TabsTrigger>
            <TabsTrigger value="fund-disbursement" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Fund Disbursement
            </TabsTrigger>
            <TabsTrigger value="staking-integration" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Staking Integration
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Funds Collected</p>
                      <h3 className="text-2xl font-bold mt-1">$847,250</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Projects</p>
                      <h3 className="text-2xl font-bold mt-1">14</h3>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                      <h3 className="text-2xl font-bold mt-1">7</h3>
                    </div>
                    <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed Projects</p>
                      <h3 className="text-2xl font-bold mt-1">28</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fund Allocation</CardTitle>
                  <CardDescription>Distribution across Zakat, Waqf and Sadaqah pools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fundAllocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {fundAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Donations</CardTitle>
                  <CardDescription>Total donations received over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyDonationsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="donations" stroke="#2563eb" fill="#93c5fd" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Overview of all currently active charitable initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Project Name</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Type</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Progress</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Raised/Goal</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Status</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Next Milestone</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectsData.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 text-sm">{project.name}</td>
                          <td className="py-3 px-2 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.type === 'Zakat' ? 'bg-blue-100 text-blue-700' :
                              project.type === 'Waqf' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {project.type}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  project.progress >= 100 ? 'bg-green-500' :
                                  project.progress >= 70 ? 'bg-emerald-500' :
                                  project.progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                          </td>
                          <td className="py-3 px-2 text-sm">${project.raised} / ${project.goal}</td>
                          <td className="py-3 px-2 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm">{project.nextMilestone}</td>
                          <td className="py-3 px-2 text-sm">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <button className="text-sm text-blue-600 font-medium">View All Projects</button>
                <button className="text-sm text-emerald-600 font-medium">Add New Project</button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Project Verification Tab */}
          <TabsContent value="project-verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Project Verifications</CardTitle>
                <CardDescription>Review and approve new charity projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Project Name</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Type</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Submitted Date</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Requested Amount</th>
                        <th className="pb-3 px-2 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingVerificationsData.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 text-sm font-medium">{project.projectName}</td>
                          <td className="py-3 px-2 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.type === 'Zakat' ? 'bg-blue-100 text-blue-700' :
                              project.type === 'Waqf' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {project.type}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm">{project.submittedDate}</td>
                          <td className="py-3 px-2 text-sm">${project.requestedAmount}</td>
                          <td className="py-3 px-2 text-sm">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium hover:bg-emerald-200">
                                Review
                              </button>
                              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200">
                                Approve
                              </button>
                              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200">
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <button className="text-sm text-blue-600 font-medium">View Project Verification Guidelines</button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shariah Compliance Checklist</CardTitle>
                  <CardDescription>Ensure projects meet Islamic finance requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" id="zakat-eligible" />
                      <label htmlFor="zakat-eligible" className="text-sm">
                        <div className="font-medium">Zakat Eligibility</div>
                        <p className="text-gray-500">Project falls under one of the eight eligible categories for Zakat</p>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" id="waqf-conditions" />
                      <label htmlFor="waqf-conditions" className="text-sm">
                        <div className="font-medium">Waqf Conditions</div>
                        <p className="text-gray-500">Project meets perpetuity and permanence requirements</p>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" id="halal-activities" />
                      <label htmlFor="halal-activities" className="text-sm">
                        <div className="font-medium">Halal Activities</div>
                        <p className="text-gray-500">All project activities and investments are Shariah-compliant</p>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" id="documentation" />
                      <label htmlFor="documentation" className="text-sm">
                        <div className="font-medium">Documentation</div>
                        <p className="text-gray-500">All required legal and religious documentation is complete</p>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" id="transparency" />
                      <label htmlFor="transparency" className="text-sm">
                        <div className="font-medium">Transparency</div>
                        <p className="text-gray-500">Project has clear reporting and accountability mechanisms</p>
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700">
                    Submit Evaluation
                  </button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Documentation</CardTitle>
                  <CardDescription>Review project supporting documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Project Proposal.pdf</span>
                      </div>
                      <button className="text-xs text-blue-600 font-medium">View</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Budget Breakdown.xlsx</span>
                      </div>
                      <button className="text-xs text-blue-600 font-medium">View</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Shariah Compliance Certificate.pdf</span>
                      </div>
                      <button className="text-xs text-blue-600 font-medium">View</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Organization Registration.pdf</span>
                      </div>
                      <button className="text-xs text-blue-600 font-medium">View</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Implementation Timeline.pdf</span>
                      </div>
                      <button className="text-xs text-blue-600 font-medium">View</button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="text-sm text-blue-600 font-medium">Request Additional Documents</button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Fund Management Tab */}
          <TabsContent value="fund-management" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Zakat Pool</CardTitle>
                  <CardDescription>Funds designated for Zakat distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">$382,250</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Allocated to Projects</span>
                      <span className="font-medium">$245,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available for Allocation</span>
                      <span className="font-medium">$137,250</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    Manage Zakat Funds
                  </button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Waqf Pool</CardTitle>
                  <CardDescription>Perpetual endowment funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-700">$275,000</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Allocated to Projects</span>
                      <span className="font-medium">$180,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available for Allocation</span>
                      <span className="font-medium">$95,000</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700">
                    Manage Waqf Funds
                  </button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Sadaqah Pool</CardTitle>
                  <CardDescription>Voluntary charity funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-700">$190,000</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Allocated to Projects</span>
                      <span className="font-medium">$120,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available for Allocation</span>
                      <span className="font-medium">$70,000</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700">
                    Manage Sadaqah Funds
                  </button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fund Allocation Tool</CardTitle>
                <CardDescription>Manage and distribute funds across projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Orphanage Construction</option>
                      <option>Food Distribution Program</option>
                      <option>Water Well Construction</option>
                      <option>Medical Aid for Gaza</option>
                      <option>Yemen Food Relief</option>
                    </select>
                  </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Fund Pool</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Zakat Pool</option>
                        <option>Waqf Pool</option>
                        <option>Sadaqah Pool</option>
                        </select>
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Allocate</label>
                    <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="$0.00" />
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        Allocate Funds
                    </button>
                </div>
                </CardContent>
                <CardFooter>
                    <button className="text-sm text-blue-600 font-medium">View Fund Allocation History</button>
                </CardFooter>
            </Card>
            </TabsContent>
            </Tabs>
            </div>
            </div>
  )}