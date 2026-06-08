"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/ui/stat-card";
import IntegratedLoader from "@/components/layout/IntegratedLoader";

import {
  Activity,
  TrendingUp,
  FileText,
  Download,
  Settings,
  Users,
  AlertTriangle,
  ClipboardList,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingDown,
  BarChart3,
  X,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Zap,
  Info,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function OperationsAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Handlers ---
  const handleExportAnalytics = () => {
    setToast("Exporting Operations Analytics Spreadsheet...");
    const element = document.createElement("a");
    const csvContent = "Metric,Value\n" + 
      "Production Efficiency,92%\n" +
      "Machine Utilization,89%\n" +
      "Employee Productivity,91%\n" +
      "Attendance Rate,95%\n" +
      "Order Completion Rate,87%\n" +
      "Downtime Hours,12 Hrs";
    const file = new Blob([csvContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = `Operations_Analytics_${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setToast("Analytics database refreshed successfully!");
    }, 1000);
  };

  // --- Chart 1: Production Trend (Line Chart) ---
  const productionTrendData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Actual Output (Units)',
        data: [12000, 13500, 14000, 14500, 15400, 14800, 15900],
        borderColor: 'rgba(59, 130, 246, 1)', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        tension: 0.35,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverRadius: 6,
      }
    ],
  };

  const productionTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: {
      y: { beginAtZero: false, suggestedMin: 10000, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      x: { grid: { display: false } }
    },
  };

  // --- Chart 2: Target vs Actual (Grouped Bar Chart) ---
  const targetVsActualData = {
    labels: ['Assembly', 'Packaging', 'Quality Control', 'Warehouse', 'Dispatch'],
    datasets: [
      {
        label: 'Target Production',
        data: [5000, 3000, 2000, 4000, 4000],
        backgroundColor: 'rgba(99, 102, 241, 0.85)', // Indigo-500
        borderRadius: 6,
      },
      {
        label: 'Actual Production',
        data: [4700, 3200, 1800, 3850, 3600],
        backgroundColor: 'rgba(16, 185, 129, 0.85)', // Emerald-500
        borderRadius: 6,
      },
    ],
  };

  const targetVsActualOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      x: { grid: { display: false } }
    },
  };

  // --- Chart 3: Machine Status Summary (Pie Chart) ---
  const machinePieData = {
    labels: ['Running Machines', 'Idle Machines', 'Maintenance Machines'],
    datasets: [
      {
        data: [35, 7, 3],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Green
          'rgba(245, 158, 11, 0.85)',  // Amber
          'rgba(239, 68, 68, 0.85)'    // Red
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      }
    ]
  };

  // --- Chart 4: Employee Productivity (Bar Chart - Top 10) ---
  const productivityBarData = {
    labels: [
      'Amit Kumar', 'Rahul Singh', 'Harsh Gupta', 'Vikas Sharma', 
      'Sarah Jenkins', 'Rajesh Sharma', 'Karan Johar', 'Suresh Mehta', 
      'Anil Verma', 'Sunil Sen'
    ],
    datasets: [
      {
        label: 'Productivity %',
        data: [98, 95, 92, 89, 86, 85, 84, 82, 81, 80],
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 4,
      }
    ]
  };

  const productivityBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      x: { grid: { display: false } }
    }
  };

  // --- Chart 5: Attendance Overview (Pie Chart) ---
  const attendancePieData = {
    labels: ['Present', 'Absent', 'Leave'],
    datasets: [
      {
        data: [89, 11, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',
          'rgba(239, 68, 68, 0.85)',
          'rgba(245, 158, 11, 0.85)'
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <IntegratedLoader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700/50 animate-slideInRight">
          <div className="bg-emerald-500 text-white rounded-full p-1 animate-pulse">
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="space-y-1 sm:space-y-2 relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg leading-tight">
            Operations Analytics
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Analyze production, workforce, machine performance, and operational efficiency in real time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={handleExportAnalytics}
            className="px-5 py-2.5 bg-white text-indigo-755 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Analytics
          </Button>
          <Button
            onClick={handleRefresh}
            className={cn(
              "px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
              refreshing && "animate-pulse"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </header>

      {/* Top 6 KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Production Efficiency"
          value="92%"
          subtitle="+3% this week"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Machine Utilization"
          value="89%"
          subtitle="Average daily load"
          icon={Settings}
          color="blue"
        />
        <StatCard
          title="Employee Productivity"
          value="91%"
          subtitle="Direct shift logs active"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Attendance Rate"
          value="95%"
          subtitle="Present workforce"
          icon={UserCheck}
          color="purple"
        />
        <StatCard
          title="Order Completion Rate"
          value="87%"
          subtitle="Target: 90% completion"
          icon={CheckCircle}
          color="amber"
        />
        <StatCard
          title="Downtime Hours"
          value="12 Hours"
          subtitle="-4% downtime hours"
          icon={Clock}
          color="red"
        />
      </section>

      {/* Production Trend & Target vs Actual Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Production Trend */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Production Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Line data={productionTrendData} options={productionTrendOptions} />
          </CardContent>
        </Card>

        {/* Target vs Actual Production */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-650 bg-clip-text text-transparent flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Target vs Actual Production
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Bar data={targetVsActualData} options={targetVsActualOptions} />
          </CardContent>
        </Card>
      </section>

      {/* Machine & Attendance Overview Pie Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Machine Status Overview */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Machine Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative flex items-center justify-center">
            <div className="h-full w-full relative">
              <Pie data={machinePieData} options={pieOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-650 bg-clip-text text-transparent flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative flex items-center justify-center">
            <div className="h-full w-full relative">
              <Pie data={attendancePieData} options={pieOptions} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Employee Productivity & Department Performance Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Top Employee Productivity */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl lg:col-span-2 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Top Employee Productivity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Bar data={productivityBarData} options={productivityBarOptions} />
          </CardContent>
        </Card>

        {/* Department Performance List */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl lg:col-span-1 flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-650">
                <ClipboardList className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              {[
                { name: "Assembly", score: 95, color: "bg-green-500" },
                { name: "Packaging", score: 88, color: "bg-blue-500" },
                { name: "Quality Control", score: 91, color: "bg-emerald-500" },
                { name: "Warehouse", score: 84, color: "bg-amber-500" },
                { name: "Dispatch", score: 89, color: "bg-indigo-500" }
              ].map((dept, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700">
                    <span>{dept.name}</span>
                    <span className="text-indigo-650 font-black">{dept.score}%</span>
                  </div>
                  <Progress value={dept.score} className="h-2 bg-slate-100" />
                </div>
              ))}
            </CardContent>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 rounded-b-2xl">
            <Info className="h-4 w-4 text-indigo-500 flex-shrink-0" />
            <p className="text-3xs text-slate-500 font-bold">Performance score represents output consistency index.</p>
          </div>
        </Card>
      </section>

      {/* Operational Alerts & Recent Performance Trends Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Operational Alerts */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-650 animate-pulse">
              <AlertCircle className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Operational Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3.5">
            {[
              { title: "Production below target", desc: "Assembly Line 2 output lagging behind weekly benchmark" },
              { title: "Machine health below threshold", desc: "Hydraulic Press MC-103 reported critical health score (42%)" },
              { title: "Maintenance overdue", desc: "Robotic Assembler MC-104 inspection overdue by 28 days" },
              { title: "Attendance below expected level", desc: "Night shift registers overall attendance below 85% threshold" },
              { title: "Quality issue detected", desc: "Quality Control reported calibration warning on batch Q-401" }
            ].map((alert, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-red-50 bg-red-50/20 flex gap-3 hover:shadow-md transition-shadow">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-850 text-xs sm:text-sm">{alert.title}</h4>
                  <p className="text-3xs text-slate-500 font-semibold mt-0.5">{alert.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Performance Trends */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-650">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Recent Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-2 gap-4">
              {[
                { name: "Production Growth", rate: "+5%", desc: "Increase in daily units", type: "up" },
                { name: "Efficiency Growth", rate: "+3%", desc: "Improvement in output index", type: "up" },
                { name: "Attendance Growth", rate: "+2%", desc: "Increase in shift logs", type: "up" },
                { name: "Downtime Reduction", rate: "-4%", desc: "Decrease in equipment outages", type: "down" }
              ].map((trend, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-4 rounded-xl border text-center flex flex-col justify-between items-center gap-2.5 hover:shadow-lg transition-all duration-300",
                    trend.type === "up" ? "border-green-150/40 bg-green-50/10" : "border-indigo-150/40 bg-indigo-50/10"
                  )}
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{trend.name}</h4>
                    <p className="text-3xs text-slate-400 font-semibold mt-0.5">{trend.desc}</p>
                  </div>
                  <Badge className={cn(
                    "text-xs font-black py-1 px-3 border rounded-full",
                    trend.type === "up" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"
                  )}>
                    {trend.rate}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </div>
          {/* Security Limitation disclaimer */}
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <ShieldAlert className="h-4 w-4 text-indigo-600 flex-shrink-0" />
            <p className="text-3xs text-slate-450 font-semibold">Managerial Scope: You have read-only analytics access to this system view (no credential or settings configuration permissions).</p>
          </div>
        </Card>
      </section>
    </div>
  );
}

// --- Common Pie Options ---
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const }
  }
};
