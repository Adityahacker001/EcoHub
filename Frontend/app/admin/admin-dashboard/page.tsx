'use client';
import { useState, useEffect } from 'react';

import DashboardLayout from '@/components/layout/dashboard-layout';
import {
  People,
  Build,
  ViewModule,
  Groups,
  TrendingUp,
  ReportProblem,
  Settings,
  Notifications,
  Assessment as BarChart3,
  Description as FileText,
  EmojiEvents as Award,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import DashboardCard from '@/components/dashboard/dashboard-card';

// allowed color type used by DashboardCard
type CardColor = 'blue' | 'purple' | 'green' | 'indigo' | 'red' | 'orange';

// Mock data for Industrial Management charts
const chartData = [
  { department: 'Assembly', production: 5200, target: 6000, actual: 5200 },
  { department: 'Packaging', production: 3000, target: 3200, actual: 2900 },
  { department: 'Quality Control', production: 800, target: 900, actual: 850 },
  { department: 'Warehouse', production: 2400, target: 2500, actual: 2400 },
  { department: 'Dispatch', production: 1900, target: 2000, actual: 1900 },
];

const pieData = [
  { name: 'Running', value: 75, color: '#22C55E' },
  { name: 'Idle', value: 15, color: '#F59E0B' },
  { name: 'Maintenance', value: 10, color: '#EF4444' },
];

const efficiencyData = [
  { day: 'Monday', efficiency: 82 },
  { day: 'Tuesday', efficiency: 85 },
  { day: 'Wednesday', efficiency: 80 },
  { day: 'Thursday', efficiency: 88 },
  { day: 'Friday', efficiency: 90 },
];

// Top KPI data for Industrial Management (color is annotated to CardColor)
const kpiData: { title: string; value: string; icon: any; color: CardColor; description?: string }[] = [
  { title: "Total Users", value: "125", icon: People, color: "indigo", description: "Registered system users" },
  { title: "Total Machines", value: "45", icon: Build, color: "blue", description: "Active factory machines" },
  { title: "Production Lines", value: "12", icon: ViewModule, color: "purple", description: "Operational production lines" },
  { title: "Active Workers", value: "89", icon: Groups, color: "green", description: "Present today" },
  { title: "Today's Production", value: "15,400", icon: TrendingUp, color: "blue", description: "Units produced today" },
  { title: "Machine Issues", value: "7", icon: ReportProblem, color: "purple", description: "Reported machine issues" },
  { title: "Maintenance Due", value: "3", icon: Settings, color: "orange", description: "Machines requiring maintenance" },
  { title: "Open Alerts", value: "12", icon: Notifications, color: "red", description: "Active system alerts" },
];

export default function IndustrialDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    const IntegratedLoader = require('@/components/layout/IntegratedLoader').default;
    return <IntegratedLoader />;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
      {/* HEADER */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white drop-shadow-2xl leading-tight">
              Eco-Innovator Hub
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-bold drop-shadow-lg mt-2">
              Industrial Management Dashboard
            </p>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-white/80">
              Monitor production, machines, workforce performance, and operational efficiency in real-time.
            </p>
          </div>
        </div>
      </header>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {kpiData.map((k) => (
          <DashboardCard
            key={k.title}
            title={k.title}
            value={k.value}
            icon={k.icon}
            color={k.color}
            description={k.description}
          />
        ))}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="space-y-4 sm:space-y-6">
        <div className="backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-2">Factory Performance Analytics</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">Real-time monitoring and operational insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Production by Department (Bar Chart) */}
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Production by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="production" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Machine Status Distribution (Pie Chart) */}
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Machine Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Production Target vs Actual (Grouped Bar Chart) */}
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Production Target vs Actual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="target" fill="#3B82F6" name="Target Production" />
                <Bar dataKey="actual" fill="#10B981" name="Actual Production" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Production Efficiency Trend (Line Chart) */}
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Production Efficiency Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">Recent Activities</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue-600"><FileText className="h-6 w-6" /></span>
              <div>
                <p className="font-semibold text-gray-900">Machine M-12 added</p>
                <p className="text-sm text-gray-600">New machine registered to Assembly line</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600"><TrendingUp className="h-6 w-6" /></span>
              <div>
                <p className="font-semibold text-gray-900">Production updated by Manager</p>
                <p className="text-sm text-gray-600">Today's totals adjusted for Packaging</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-indigo-600"><Groups className="h-6 w-6" /></span>
              <div>
                <p className="font-semibold text-gray-900">Attendance submitted</p>
                <p className="text-sm text-gray-600">Worker attendance recorded for morning shift</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-yellow-600"><Build className="h-6 w-6" /></span>
              <div>
                <p className="font-semibold text-gray-900">Maintenance request created</p>
                <p className="text-sm text-gray-600">Request raised for Machine M-05</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-600"><Award className="h-6 w-6" /></span>
              <div>
                <p className="font-semibold text-gray-900">Worker task completed</p>
                <p className="text-sm text-gray-600">QC batch inspection finalized</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-2">Quick Actions</h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">Common operational actions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button className="p-4 sm:p-6 border-2 border-blue-300/50 bg-gradient-to-br from-blue-50/80 to-blue-100/60 backdrop-blur-sm rounded-2xl hover:from-blue-100/90 hover:to-blue-200/70 hover:border-blue-400/60 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105">
            <Build className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-3" />
            <p className="font-black text-base sm:text-lg text-blue-900 mb-2">Add Machine</p>
            <p className="text-sm sm:text-base text-blue-700 font-semibold">Register a new machine</p>
          </button>
          <button className="p-4 sm:p-6 border-2 border-green-300/50 bg-gradient-to-br from-green-50/80 to-green-100/60 backdrop-blur-sm rounded-2xl hover:from-green-100/90 hover:to-green-200/70 hover:border-green-400/60 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mb-3" />
            <p className="font-black text-base sm:text-lg text-green-900 mb-2">Generate Report</p>
            <p className="text-sm sm:text-base text-green-700 font-semibold">Download production reports</p>
          </button>
          <button className="p-4 sm:p-6 border-2 border-purple-300/50 bg-gradient-to-br from-purple-50/80 to-purple-100/60 backdrop-blur-sm rounded-2xl hover:from-purple-100/90 hover:to-purple-200/70 hover:border-purple-400/60 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105">
            <ReportProblem className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-3" />
            <p className="font-black text-base sm:text-lg text-purple-900 mb-2">View Alerts</p>
            <p className="text-sm sm:text-base text-purple-700 font-semibold">Check maintenance and system alerts</p>
          </button>
        </div>
      </div>
    </div>
  );
}