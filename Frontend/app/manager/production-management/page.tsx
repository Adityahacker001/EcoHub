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
  Briefcase,
  Play,
  ArrowUpRight,
  TrendingDown,
  Box,
  Layers,
  BarChart3,
  X,
  UserCheck,
  AlertCircle,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Bar, Line } from "react-chartjs-2";
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

// --- Types & Interfaces ---
interface DepartmentData {
  name: string;
  target: number;
  actual: number;
  efficiency: number;
  status: "On Target" | "Exceeded" | "Warning";
  supervisor: string;
  machines: string[];
  workers: number;
  weeklyProduction: string;
  monthlyProduction: string;
}

interface ProductionOrder {
  id: string;
  product: string;
  quantity: string;
  deadline: string;
  status: "In Progress" | "Completed" | "Pending";
  department: string;
  weeklyProduction?: string;
  monthlyProduction?: string;
  target?: number;
  actual?: number;
  efficiency?: number;
  supervisor?: string;
  machines?: string[];
  workers?: number;
}

export default function ProductionManagementPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DepartmentData | ProductionOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // --- Department Data ---
  const departments: DepartmentData[] = [
    {
      name: "Assembly",
      target: 5000,
      actual: 4700,
      efficiency: 94,
      status: "On Target",
      supervisor: "Amit Kumar",
      machines: ["CNC Mill MC-101", "Hydraulic Press MC-102", "Robotic Arm MC-103"],
      workers: 18,
      weeklyProduction: "32,400 Units",
      monthlyProduction: "135,000 Units"
    },
    {
      name: "Packaging",
      target: 3000,
      actual: 3200,
      efficiency: 106,
      status: "Exceeded",
      supervisor: "Harsh Gupta",
      machines: ["Sealing machine PK-201", "Labeler PK-202", "Conveyor Belt PK-203"],
      workers: 12,
      weeklyProduction: "21,200 Units",
      monthlyProduction: "88,000 Units"
    },
    {
      name: "Quality Control",
      target: 2000,
      actual: 1800,
      efficiency: 90,
      status: "Warning",
      supervisor: "Sarah Jenkins",
      machines: ["Laser scanner QC-301", "Spectral analyzer QC-302"],
      workers: 8,
      weeklyProduction: "12,800 Units",
      monthlyProduction: "51,000 Units"
    },
    {
      name: "Warehouse",
      target: 4000,
      actual: 3850,
      efficiency: 96,
      status: "On Target",
      supervisor: "Rajesh Sharma",
      machines: ["Electric Forklift WH-401", "Pallet Wrapper WH-402"],
      workers: 15,
      weeklyProduction: "26,950 Units",
      monthlyProduction: "112,000 Units"
    },
    {
      name: "Dispatch",
      target: 4000,
      actual: 3600,
      efficiency: 90,
      status: "Warning",
      supervisor: "Suresh Mehta",
      machines: ["Loading Crane DR-501", "Weight Bridge DR-502"],
      workers: 10,
      weeklyProduction: "25,200 Units",
      monthlyProduction: "105,000 Units"
    }
  ];

  // --- Production Orders ---
  const productionOrders: ProductionOrder[] = [
    {
      id: "ORD-1001",
      product: "Steel Components",
      quantity: "500 Units",
      deadline: "15 Jun 2026",
      status: "In Progress",
      department: "Assembly",
      weeklyProduction: "2,500 Units",
      monthlyProduction: "10,000 Units",
      target: 500,
      actual: 350,
      efficiency: 70,
      supervisor: "Amit Kumar",
      machines: ["CNC Mill MC-101", "Hydraulic Press MC-102"],
      workers: 6
    },
    {
      id: "ORD-1002",
      product: "Packaging Material",
      quantity: "1000 Units",
      deadline: "18 Jun 2026",
      status: "Completed",
      department: "Packaging",
      weeklyProduction: "5,000 Units",
      monthlyProduction: "20,000 Units",
      target: 1000,
      actual: 1000,
      efficiency: 100,
      supervisor: "Harsh Gupta",
      machines: ["Sealing machine PK-201"],
      workers: 4
    },
    {
      id: "ORD-1003",
      product: "Plastic Castings",
      quantity: "800 Units",
      deadline: "22 Jun 2026",
      status: "Pending",
      department: "Assembly",
      weeklyProduction: "0 Units",
      monthlyProduction: "0 Units",
      target: 800,
      actual: 0,
      efficiency: 0,
      supervisor: "Amit Kumar",
      machines: ["Robotic Arm MC-103"],
      workers: 5
    }
  ];

  // --- Chart Data ---
  const lineChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Actual Production (Units)',
        data: [12000, 13500, 14000, 14500, 15400, 14800, 15900],
        borderColor: 'rgba(59, 130, 246, 1)', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        tension: 0.35,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverRadius: 6,
      },
      {
        label: 'Daily Target (18,000 Units)',
        data: [18000, 18000, 18000, 18000, 18000, 18000, 18000],
        borderColor: 'rgba(239, 68, 68, 0.7)', // Red-500
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: { enabled: true },
    },
    scales: {
      y: { 
        beginAtZero: false,
        suggestedMin: 8000,
        suggestedMax: 20000,
        grid: { color: 'rgba(226, 232, 240, 0.6)' }
      },
      x: { grid: { display: false } }
    },
  };

  const barChartData = {
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

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      x: { grid: { display: false } }
    },
  };

  // --- Handlers ---
  const handleGenerateReport = () => {
    setToast("Generating Production PDF Report...");
    // Mock PDF download trigger
    const element = document.createElement("a");
    const file = new Blob(["Production Output Report\nGenerated on: " + new Date().toLocaleDateString() + "\nTotal output: 15,400 Units\nEfficiency: 92%"], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Production_Report_${Date.now()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportData = () => {
    setToast("Exporting Production CSV Logs...");
    // Mock CSV download trigger
    const element = document.createElement("a");
    const csvContent = "Department,Target,Actual,Efficiency,Status\n" + 
      departments.map(d => `${d.name},${d.target},${d.actual},${d.efficiency}%,${d.status}`).join("\n");
    const file = new Blob([csvContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = `Production_Data_${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openDetailsModal = (item: DepartmentData | ProductionOrder) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
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
            Production Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Monitor production targets, output, efficiency, department performance, and operational productivity in real time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={handleGenerateReport}
            className="px-5 py-2.5 bg-white text-indigo-750 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Generate Production Report
          </Button>
          <Button
            onClick={handleExportData}
            className="px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Production Data
          </Button>
        </div>
      </header>

      {/* Top 6 KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Today's Production"
          value="15,400 Units"
          subtitle="Target: 18,000 Units (85%)"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Production Efficiency"
          value="92%"
          subtitle="+5% compared to yesterday"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Completed Orders"
          value="245"
          subtitle="Successfully completed orders"
          icon={CheckCircle}
          color="indigo"
        />
        <StatCard
          title="Pending Orders"
          value="38"
          subtitle="Awaiting completion"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Target Achievement"
          value="85%"
          subtitle="Current target completion"
          icon={ClipboardList}
          color="purple"
        />
        <StatCard
          title="Avg Output / Hour"
          value="642 Units"
          subtitle="Factory hourly rate"
          icon={Settings}
          color="pink"
        />
      </section>

      {/* Production Trend and Target vs Actual Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Production Trend Line Chart */}
        <Card className="bg-gradient-to-br from-white/95 via-blue-50/20 to-indigo-50/10 border border-slate-100/50 shadow-xl rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Daily Production Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Line data={lineChartData} options={lineChartOptions} />
          </CardContent>
        </Card>

        {/* Target vs Actual Bar Chart */}
        <Card className="bg-gradient-to-br from-white/95 via-indigo-50/20 to-purple-50/10 border border-slate-100/50 shadow-xl rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-650 bg-clip-text text-transparent flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Production Target vs Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Bar data={barChartData} options={barChartOptions} />
          </CardContent>
        </Card>
      </section>

      {/* Department Production & Production Orders Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Department Performance Table */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Department Production Performance
              </CardTitle>
            </div>
            <Badge className="text-2xs bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">5 Active Units</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold text-left">
                  <th className="py-3 px-4 font-bold">Department</th>
                  <th className="py-3 px-4 text-center font-bold">Target</th>
                  <th className="py-3 px-4 text-center font-bold">Actual</th>
                  <th className="py-3 px-4 text-center font-bold">Efficiency</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, i) => (
                  <tr
                    key={i}
                    onClick={() => openDetailsModal(dept)}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{dept.name}</td>
                    <td className="py-3 px-4 text-center text-slate-600 font-medium">{dept.target.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center text-slate-800 font-bold">{dept.actual.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-black text-indigo-650">{dept.efficiency}%</td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        "text-3xs font-black px-2 py-0.5 rounded-full border",
                        dept.status === "Exceeded" && "bg-green-50 text-green-700 border-green-200",
                        dept.status === "On Target" && "bg-blue-50 text-blue-700 border-blue-200",
                        dept.status === "Warning" && "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {dept.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Production Orders */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Box className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Production Orders
              </CardTitle>
            </div>
            <Badge className="text-2xs bg-purple-50 text-purple-750 font-bold border border-purple-200">Active Queue</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold text-left">
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 text-center font-bold">Quantity</th>
                  <th className="py-3 px-4 font-bold">Deadline</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {productionOrders.map((ord, i) => (
                  <tr
                    key={i}
                    onClick={() => openDetailsModal(ord)}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{ord.id}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{ord.product}</td>
                    <td className="py-3 px-4 text-center text-slate-800 font-bold">{ord.quantity}</td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">{ord.deadline}</td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        "text-3xs font-black px-2 py-0.5 rounded-full border",
                        ord.status === "Completed" && "bg-green-50 text-green-700 border-green-200",
                        ord.status === "In Progress" && "bg-blue-50 text-blue-700 border-blue-200",
                        ord.status === "Pending" && "bg-gray-55 text-slate-600 border-slate-200"
                      )}>
                        {ord.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Shift Performance & Top Performing Departments Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Shift Performance */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-650">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Shift Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {[
                { name: "Morning Shift", units: 5200, percentage: 86, color: "bg-blue-500" },
                { name: "Evening Shift", units: 4800, percentage: 80, color: "bg-indigo-500" },
                { name: "Night Shift", units: 5400, percentage: 90, color: "bg-purple-500" }
              ].map((shift, i) => (
                <div key={i} className="space-y-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700">
                    <span>{shift.name}</span>
                    <span className="text-indigo-650 font-black">{shift.units.toLocaleString()} Units ({shift.percentage}%)</span>
                  </div>
                  <Progress value={shift.percentage} className="h-2 bg-slate-100" />
                </div>
              ))}
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-2xs text-slate-400 font-bold rounded-b-2xl">
            <span>Overall Productivity Peak: Night Shift</span>
            <Badge className="bg-purple-100 text-purple-700 text-3xs font-black">Peak</Badge>
          </div>
        </Card>

        {/* Top Performing Departments */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-650">
                <Award className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Top Performing Departments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Assembly", efficiency: 96, medal: "🥇" },
                { name: "Packaging", efficiency: 94, medal: "🥈" },
                { name: "Quality Control", efficiency: 91, medal: "🥉" }
              ].map((dept, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center flex flex-col items-center justify-between gap-3 hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl">{dept.medal}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{dept.name}</h4>
                    <p className="text-3xs text-slate-400 font-bold mt-0.5">EcoHub Unit A</p>
                  </div>
                  <Badge className="bg-indigo-50 text-indigo-700 text-xs font-black py-0.5 px-2 border border-indigo-200">
                    {dept.efficiency}% Efficiency
                  </Badge>
                </div>
              ))}
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-amber-50/20 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <p className="text-2xs text-slate-500 font-bold">Assembly leads productivity metrics this week.</p>
          </div>
        </Card>
      </section>

      {/* Production Issues & Active Directives Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Production Issues & Bottlenecks */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 animate-pulse">
              <AlertCircle className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Production Issues & Bottlenecks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3">
            {[
              { text: "Assembly line delay detected", desc: "Line 2 calibrator recalibrating", type: "error" },
              { text: "Machine downtime affecting production", desc: "Press MC-102 undergoing scheduled oil change", type: "warning" },
              { text: "Raw material shortage", desc: "Steel stock below safety threshold", type: "warning" },
              { text: "Quality inspection failure", desc: "Batch Q-401 rejected due to tolerance errors", type: "error" },
              { text: "Delayed order processing", desc: "ORD-1003 awaiting scheduling clearance", type: "info" }
            ].map((issue, i) => (
              <div key={i} className={cn(
                "p-3.5 rounded-xl border flex gap-3 hover:shadow-md transition-shadow",
                issue.type === "error" && "border-red-100 bg-red-50/30",
                issue.type === "warning" && "border-amber-100 bg-amber-50/30",
                issue.type === "info" && "border-blue-100 bg-blue-50/30"
              )}>
                <AlertTriangle className={cn(
                  "h-5 w-5 flex-shrink-0 mt-0.5",
                  issue.type === "error" && "text-red-600",
                  issue.type === "warning" && "text-amber-600",
                  issue.type === "info" && "text-blue-600"
                )} />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{issue.text}</h4>
                  <p className="text-3xs text-slate-500 font-semibold mt-0.5">{issue.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Directives */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Production Directives
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {[
              { title: "Increase Production by 10%", priority: "High", due: "20 Jun 2026", status: "In Progress" },
              { title: "Improve Packaging Efficiency", priority: "Medium", due: "18 Jun 2026", status: "Pending" }
            ].map((dir, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{dir.title}</h4>
                  <p className="text-3xs text-slate-400 font-bold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Due Date: {dir.due}
                  </p>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  <Badge className={cn(
                    "text-3xs font-black px-2 py-0.5 rounded-full border",
                    dir.priority === "High" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"
                  )}>
                    {dir.priority} Priority
                  </Badge>
                  <Badge className={cn(
                    "text-3xs font-black px-2 py-0.5 rounded-full border",
                    dir.status === "In Progress" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"
                  )}>
                    {dir.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Timeline & Quick Actions Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Production Activities */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Recent Production Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="relative pl-6 space-y-4 border-l border-slate-100/80 py-1">
              {[
                { action: "Production updated by Supervisor", time: "12 mins ago" },
                { action: "Daily target revised by Manager", time: "1 hour ago" },
                { action: "Order completed successfully", time: "3 hours ago" },
                { action: "Production report generated", time: "4 hours ago" },
                { action: "Shift report submitted", time: "1 day ago" },
                { action: "Machine downtime recorded", time: "2 days ago" }
              ].map((log, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 bg-white border-4 border-indigo-500 h-4 w-4 rounded-full shadow-sm"></span>
                  <div className="flex justify-between items-start gap-4 hover:bg-slate-50/50 rounded-lg p-1 -m-1 transition-all duration-300">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-700 text-xs sm:text-sm">{log.action}</h4>
                      <p className="text-3xs text-slate-400 font-semibold">EcoHub Factory Site A</p>
                    </div>
                    <span className="text-3xs text-slate-400 font-bold whitespace-nowrap">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-50 text-slate-650">
                <Settings className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleGenerateReport}
                variant="outline"
                className="justify-start py-6 border-blue-100 text-blue-800 hover:bg-blue-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Generate Report</p>
                  <span className="text-3xs text-blue-500 font-medium mt-0.5 block">Export PDF overview</span>
                </div>
              </Button>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="justify-start py-6 border-indigo-100 text-indigo-800 hover:bg-indigo-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <Download className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Export Data</p>
                  <span className="text-3xs text-indigo-500 font-medium mt-0.5 block">Download CSV spreadsheet</span>
                </div>
              </Button>
              <Button
                onClick={() => setToast("Loading Machine Analytics view...")}
                variant="outline"
                className="justify-start py-6 border-purple-100 text-purple-800 hover:bg-purple-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <Settings className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Machine Analytics</p>
                  <span className="text-3xs text-purple-500 font-medium mt-0.5 block">Review asset health</span>
                </div>
              </Button>
              <Button
                onClick={() => setToast("Loading Workforce Performance view...")}
                variant="outline"
                className="justify-start py-6 border-emerald-100 text-emerald-800 hover:bg-emerald-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <Users className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Workforce Performance</p>
                  <span className="text-3xs text-emerald-500 font-medium mt-0.5 block">Monitor shift logs</span>
                </div>
              </Button>
              <Button
                onClick={() => setToast("Loading Production Orders queue...")}
                variant="outline"
                className="justify-start py-6 border-amber-100 text-amber-800 hover:bg-amber-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 sm:col-span-2"
              >
                <Box className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Review Production Orders</p>
                  <span className="text-3xs text-amber-500 font-medium mt-0.5 block">Analyze queued orders</span>
                </div>
              </Button>
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <AlertCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />
            <p className="text-2xs text-slate-500 font-semibold">Select an operation to review log metrics.</p>
          </div>
        </Card>
      </section>

      {/* Details Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDetailsModal}></div>
          <Card className="relative z-10 w-full max-w-lg bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-6 pt-5 relative">
              <Button
                onClick={closeDetailsModal}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1 border-0"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-blue-100">Production Item Details</p>
                <CardTitle className="text-lg sm:text-xl font-black">
                  {"name" in selectedItem ? selectedItem.name : selectedItem.product}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Status</p>
                  <Badge className={cn(
                    "text-3xs font-black px-2 py-0.5 border rounded-full",
                    selectedItem.status === "Exceeded" && "bg-green-50 text-green-700 border-green-200",
                    selectedItem.status === "Completed" && "bg-green-50 text-green-700 border-green-200",
                    selectedItem.status === "On Target" && "bg-blue-50 text-blue-700 border-blue-200",
                    selectedItem.status === "In Progress" && "bg-blue-50 text-blue-700 border-blue-200",
                    selectedItem.status === "Warning" && "bg-amber-50 text-amber-700 border-amber-200",
                    selectedItem.status === "Pending" && "bg-gray-50 text-slate-650 border-slate-200"
                  )}>
                    {selectedItem.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Supervisor</p>
                  <p className="font-bold text-slate-700">{"supervisor" in selectedItem ? selectedItem.supervisor : "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Target Production</p>
                  <p className="font-bold text-slate-700">{"target" in selectedItem ? selectedItem.target?.toLocaleString() : "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Actual Production</p>
                  <p className="font-bold text-slate-700">{"actual" in selectedItem ? selectedItem.actual?.toLocaleString() : "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Efficiency</p>
                  <p className="font-black text-indigo-650">{"efficiency" in selectedItem ? `${selectedItem.efficiency}%` : "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Workers Assigned</p>
                  <p className="font-bold text-slate-700">{"workers" in selectedItem ? selectedItem.workers : "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Weekly Output</p>
                  <p className="font-semibold text-slate-700">{selectedItem.weeklyProduction || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Monthly Output</p>
                  <p className="font-semibold text-slate-700">{selectedItem.monthlyProduction || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Machines Assigned</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {"machines" in selectedItem && selectedItem.machines && selectedItem.machines.length > 0 ? (
                    selectedItem.machines.map((mac, i) => (
                      <Badge key={i} variant="secondary" className="text-3xs font-bold bg-slate-100 text-slate-650 border border-slate-200">
                        {mac}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={closeDetailsModal} className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold px-5 py-2 rounded-xl">
                  Close Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
