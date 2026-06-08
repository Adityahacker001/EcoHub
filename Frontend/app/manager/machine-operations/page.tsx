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
  Settings,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Clock,
  FileText,
  Download,
  BarChart3,
  Users,
  Key,
  ShieldAlert,
  X,
  AlertCircle,
  Play,
  CheckCircle,
  ArrowUpRight,
  Shield,
  Globe,
  Lock,
  BellRing,
  Box,
  Layers,
  HelpCircle,
  Wrench,
  Search,
  Check,
  Calendar,
  Zap,
  Info
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

// --- Interfaces & Types ---
interface MachineData {
  id: string;
  name: string;
  type: string;
  department: string;
  operator: string;
  healthScore: number;
  utilization: number;
  status: "Running" | "Idle" | "Maintenance" | "Overdue";
  runtime: string;
  downtimeHours: number;
  lastService: string;
  nextService: string;
  history: string[];
}

interface MaintenanceTask {
  machineId: string;
  machineName: string;
  lastService: string;
  nextService: string;
  daysRemaining: number;
  status: "Scheduled" | "Urgent" | "Overdue" | "Maintenance";
}

export default function MachineOperationsPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);
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

  // --- Complete Machine Data Set ---
  const machines: MachineData[] = [
    {
      id: "MC-101",
      name: "CNC Machine",
      type: "CNC Milling Lathe",
      department: "Assembly",
      operator: "Amit Kumar",
      healthScore: 95,
      utilization: 92,
      status: "Running",
      runtime: "480 Hours",
      downtimeHours: 1.5,
      lastService: "01 Jun 2026",
      nextService: "01 Jul 2026",
      history: ["Hydraulic fluid refill (01 Jun 2026)", "Axis calibration (15 May 2026)"]
    },
    {
      id: "MC-102",
      name: "Conveyor Belt",
      type: "High-Load Conveyor",
      department: "Packaging",
      operator: "Harsh Gupta",
      healthScore: 88,
      utilization: 80,
      status: "Running",
      runtime: "320 Hours",
      downtimeHours: 4.2,
      lastService: "15 May 2026",
      nextService: "15 Jun 2026",
      history: ["Belt alignment review (15 May 2026)", "Motor bearing lubrication (01 May 2026)"]
    },
    {
      id: "MC-103",
      name: "Hydraulic Press",
      type: "50-Ton Press",
      department: "Assembly",
      operator: "Sarah Jenkins",
      healthScore: 42,
      utilization: 78,
      status: "Idle",
      runtime: "620 Hours",
      downtimeHours: 18.5,
      lastService: "20 May 2026",
      nextService: "10 Jun 2026",
      history: ["Valve seal replacement (20 May 2026)", "Pressure sensor calibration (10 May 2026)"]
    },
    {
      id: "MC-104",
      name: "Robotic Assembler",
      type: "6-Axis Pick & Place",
      department: "Assembly",
      operator: "Suresh Mehta",
      healthScore: 45,
      utilization: 62,
      status: "Maintenance",
      runtime: "840 Hours",
      downtimeHours: 32.0,
      lastService: "10 Apr 2026",
      nextService: "10 May 2026",
      history: ["Main controller swap (10 Apr 2026)", "Grip force adjustments (25 Mar 2026)"]
    },
    {
      id: "MC-105",
      name: "Quality Scanner",
      type: "Optical Inspection Rig",
      department: "Quality Control",
      operator: "Rajesh Sharma",
      healthScore: 91,
      utilization: 84,
      status: "Running",
      runtime: "290 Hours",
      downtimeHours: 0.8,
      lastService: "25 May 2026",
      nextService: "25 Jun 2026",
      history: ["Lens cleaning & test scan (25 May 2026)"]
    },
    {
      id: "MC-111",
      name: "Steam Boiler",
      type: "High-Temp Boiler",
      department: "Packaging",
      operator: "Karan Johar",
      healthScore: 38,
      utilization: 85,
      status: "Idle",
      runtime: "710 Hours",
      downtimeHours: 14.8,
      lastService: "02 May 2026",
      nextService: "02 Jun 2026",
      history: ["Pressure release valve inspect (02 May 2026)"]
    },
    {
      id: "MC-220",
      name: "Laser Cutter",
      type: "CNC Fiber Laser",
      department: "Assembly",
      operator: "Rohit Sharma",
      healthScore: 45,
      utilization: 75,
      status: "Running",
      runtime: "380 Hours",
      downtimeHours: 8.5,
      lastService: "18 May 2026",
      nextService: "18 Jun 2026",
      history: ["Optical alignment calibration (18 May 2026)"]
    }
  ];

  // --- Maintenance Schedule List ---
  const maintenanceSchedule: MaintenanceTask[] = [
    { machineId: "MC-101", machineName: "CNC Machine", lastService: "01 Jun 2026", nextService: "01 Jul 2026", daysRemaining: 18, status: "Scheduled" },
    { machineId: "MC-102", machineName: "Conveyor Belt", lastService: "15 May 2026", nextService: "15 Jun 2026", daysRemaining: 3, status: "Urgent" },
    { machineId: "MC-103", machineName: "Hydraulic Press", lastService: "20 May 2026", nextService: "10 Jun 2026", daysRemaining: 0, status: "Overdue" },
    { machineId: "MC-104", machineName: "Robotic Assembler", lastService: "10 Apr 2026", nextService: "10 May 2026", daysRemaining: -28, status: "Maintenance" }
  ];

  // --- Chart 1: Status Distribution (Pie Chart) ---
  const pieData = {
    labels: ['Running', 'Idle', 'Maintenance'],
    datasets: [
      {
        data: [35, 7, 3],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Green-500
          'rgba(245, 158, 11, 0.85)', // Amber-500
          'rgba(239, 68, 68, 0.85)'   // Red-500
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    }
  };

  // --- Chart 2: Health Overview (Bar Chart) ---
  const healthData = {
    labels: ['MC-101', 'MC-102', 'MC-103', 'MC-104', 'MC-105'],
    datasets: [
      {
        label: 'Health Score (%)',
        data: [95, 88, 72, 45, 91],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // MC-101 (Excellent)
          'rgba(59, 130, 246, 0.85)',  // MC-102 (Good)
          'rgba(59, 130, 246, 0.85)',  // MC-103 (Good)
          'rgba(239, 68, 68, 0.85)',   // MC-104 (Critical)
          'rgba(16, 185, 129, 0.85)'  // MC-105 (Excellent)
        ],
        borderRadius: 6,
      }
    ]
  };

  const healthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      x: { grid: { display: false } }
    }
  };

  // --- Chart 3: Machine Utilization (Bar Chart) ---
  const utilizationData = {
    labels: ['Production A', 'Production B', 'Packaging', 'Assembly', 'Quality Control'],
    datasets: [
      {
        label: 'Utilization Rate (%)',
        data: [92, 85, 80, 78, 84],
        backgroundColor: 'rgba(99, 102, 241, 0.85)', // Indigo-500
        borderRadius: 6,
      }
    ]
  };

  const utilizationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      x: { grid: { display: false } }
    }
  };

  // --- Chart 4: Downtime Analysis (Line Chart) ---
  const downtimeTrendData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Downtime Hours',
        data: [2, 1, 4, 2, 3, 1, 2],
        borderColor: 'rgba(239, 68, 68, 1)', // Red-500
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        tension: 0.3,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointHoverRadius: 6,
      }
    ]
  };

  const downtimeTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: {
      y: { beginAtZero: true, suggestedMax: 6, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
      x: { grid: { display: false } }
    }
  };

  // --- Action triggers ---
  const handleGenerateReport = () => {
    setToast("Generating Factory Machine Health Audit...");
    const element = document.createElement("a");
    const file = new Blob(["Machine Operations Report\nTotal Machines: 45\nAvg Health: 87%\nServiced: 3 Under Maintenance"], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Machine_Health_Report_${Date.now()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportAnalytics = () => {
    setToast("Exporting Machine Downtime & Utilization CSV...");
    const element = document.createElement("a");
    const csvContent = "Machine ID,Name,Health,Utilization,Status,Downtime\n" + 
      machines.map(m => `${m.id},${m.name},${m.healthScore}%,${m.utilization}%,${m.status},${m.downtimeHours} Hrs`).join("\n");
    const file = new Blob([csvContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = `Machine_Analytics_${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleScheduleMaintenance = (machineId: string) => {
    setToast(`Maintenance request queued for ${machineId}`);
    closeDetailsModal();
  };

  const handleAssignInspection = (machineId: string) => {
    setToast(`Inspection order dispatched for ${machineId}`);
    closeDetailsModal();
  };

  const openDetailsModal = (machineId: string) => {
    const found = machines.find(m => m.id === machineId) || null;
    if (found) {
      setSelectedMachine(found);
      setIsModalOpen(true);
    }
  };

  const closeDetailsModal = () => {
    setSelectedMachine(null);
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
            Machine Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Monitor machine health, performance, utilization, downtime, and maintenance activities in real time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={handleGenerateReport}
            className="px-5 py-2.5 bg-white text-indigo-750 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Generate Machine Report
          </Button>
          <Button
            onClick={handleExportAnalytics}
            className="px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Analytics
          </Button>
        </div>
      </header>

      {/* Top 6 KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Machines"
          value="45"
          subtitle="Registered factory assets"
          icon={Settings}
          color="blue"
        />
        <StatCard
          title="Running Machines"
          value="35"
          subtitle="Currently operational"
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Average Health Score"
          value="87%"
          subtitle="Overall condition score"
          icon={ShieldCheck}
          color="indigo"
        />
        <StatCard
          title="Machine Utilization"
          value="89%"
          subtitle="Average daily load"
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Under Maintenance"
          value="3"
          subtitle="Currently being serviced"
          icon={Wrench}
          color="amber"
        />
        <StatCard
          title="Downtime Hours"
          value="12 Hours"
          subtitle="Total downtime this month"
          icon={Clock}
          color="red"
        />
      </section>

      {/* Machine Status Distribution & Health Overview Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Machine Status Distribution */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Machine Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative flex items-center justify-center">
            <div className="h-full w-full relative">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Machine Health Overview */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-650 bg-clip-text text-transparent flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              Machine Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Bar data={healthData} options={healthOptions} />
          </CardContent>
        </Card>
      </section>

      {/* Machine Utilization & Downtime Trends Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Machine Utilization */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-650 bg-clip-text text-transparent flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Machine Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Bar data={utilizationData} options={utilizationOptions} />
          </CardContent>
        </Card>

        {/* Downtime Analysis */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-red-600 to-rose-650 bg-clip-text text-transparent flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              Downtime Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Line data={downtimeTrendData} options={downtimeTrendOptions} />
          </CardContent>
        </Card>
      </section>

      {/* Maintenance Schedule Table */}
      <section>
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Wrench className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Maintenance Schedule
              </CardTitle>
            </div>
            <Badge className="text-2xs bg-indigo-50 text-indigo-750 font-bold border border-indigo-200">System Checklist</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold text-left">
                  <th className="py-3 px-4 font-bold">Machine ID</th>
                  <th className="py-3 px-4 font-bold">Machine Name</th>
                  <th className="py-3 px-4 font-bold">Last Service Date</th>
                  <th className="py-3 px-4 font-bold">Next Service Date</th>
                  <th className="py-3 px-4 text-center font-bold">Days Remaining</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceSchedule.map((task, i) => (
                  <tr
                    key={i}
                    onClick={() => openDetailsModal(task.machineId)}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{task.machineId}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{task.machineName}</td>
                    <td className="py-3 px-4 text-slate-550 font-semibold">{task.lastService}</td>
                    <td className="py-3 px-4 text-slate-550 font-semibold">{task.nextService}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-750">
                      {task.daysRemaining >= 0 ? `${task.daysRemaining} Days` : "Overdue"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        "text-3xs font-black px-2 py-0.5 rounded-full border",
                        task.status === "Scheduled" && "bg-blue-50 text-blue-700 border-blue-200",
                        task.status === "Urgent" && "bg-amber-50 text-amber-700 border-amber-200",
                        task.status === "Overdue" && "bg-red-50 text-red-700 border-red-200",
                        task.status === "Maintenance" && "bg-purple-50 text-purple-700 border-purple-200"
                      )}>
                        {task.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Machine Alerts Section */}
      <section className="space-y-4">
        <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent px-1 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-indigo-500 animate-pulse" />
          Machine Alerts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {[
            { text: "Machine MC-103 health score below 50%", time: "10m ago", severity: "high" },
            { text: "Machine MC-205 requires inspection", time: "1h ago", severity: "medium" },
            { text: "Machine MC-110 downtime exceeded threshold", time: "3h ago", severity: "high" },
            { text: "Maintenance overdue for Machine MC-302", time: "1d ago", severity: "high" },
            { text: "Machine utilization below acceptable range", time: "2d ago", severity: "low" }
          ].map((alert, i) => (
            <Card key={i} className={cn(
              "border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300",
              alert.severity === "high" && "border-red-100 bg-red-50/20",
              alert.severity === "medium" && "border-amber-100 bg-amber-50/20",
              alert.severity === "low" && "border-blue-100 bg-blue-50/20"
            )}>
              <CardContent className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="flex gap-2">
                  <AlertTriangle className={cn(
                    "h-4 w-4 flex-shrink-0 mt-0.5",
                    alert.severity === "high" && "text-red-600",
                    alert.severity === "medium" && "text-amber-600",
                    alert.severity === "low" && "text-blue-600"
                  )} />
                  <p className="text-xs font-bold text-slate-700 leading-tight">{alert.text}</p>
                </div>
                <div className="flex justify-between items-center text-3xs font-bold text-slate-400 mt-2">
                  <span>Logged: {alert.time}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded border",
                    alert.severity === "high" && "bg-red-100/50 text-red-700 border-red-200/50",
                    alert.severity === "medium" && "bg-amber-100/50 text-amber-700 border-amber-200/50",
                    alert.severity === "low" && "bg-blue-100/50 text-blue-750 border-blue-200/50"
                  )}>{alert.severity.toUpperCase()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Performing Machines & Machines Requiring Attention Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Performing Machines */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-650">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Top Performing Machines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "MC-101", name: "CNC Machine", efficiency: 96, medal: "🥇" },
                { id: "MC-205", name: "Laser Welder", efficiency: 94, medal: "🥈" },
                { id: "MC-301", name: "Auto Solder", efficiency: 91, medal: "🥉" }
              ].map((mac, i) => (
                <div
                  key={i}
                  onClick={() => openDetailsModal(mac.id)}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center flex flex-col items-center justify-between gap-3 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="text-2xl">{mac.medal}</div>
                  <div>
                    <h4 className="font-bold text-slate-850 text-xs sm:text-sm">{mac.id}</h4>
                    <p className="text-3xs text-slate-400 font-bold mt-0.5">{mac.name}</p>
                  </div>
                  <Badge className="bg-indigo-50 text-indigo-700 text-xs font-black py-0.5 px-2 border border-indigo-200">
                    {mac.efficiency}% Efficiency
                  </Badge>
                </div>
              ))}
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-amber-50/20 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <p className="text-2xs text-slate-500 font-bold">MC-101 leads operational load consistency.</p>
          </div>
        </Card>

        {/* Machines Requiring Attention */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-50 text-red-650 animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Machines Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "MC-103", name: "Hydraulic Press", score: 42, color: "bg-red-500" },
                { id: "MC-111", name: "Steam Boiler", score: 38, color: "bg-rose-500" },
                { id: "MC-220", name: "Laser Cutter", score: 45, color: "bg-red-500" }
              ].map((mac, i) => (
                <div
                  key={i}
                  onClick={() => openDetailsModal(mac.id)}
                  className="p-4 rounded-xl border border-red-50 bg-red-50/10 text-center flex flex-col items-center justify-between gap-3 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h4 className="font-bold text-slate-850 text-xs sm:text-sm">{mac.id}</h4>
                    <p className="text-3xs text-slate-400 font-bold mt-0.5">{mac.name}</p>
                  </div>
                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between text-3xs font-black text-red-650">
                      <span>Health</span>
                      <span>{mac.score}%</span>
                    </div>
                    <Progress value={mac.score} className="h-1.5 bg-slate-100" />
                  </div>
                </div>
              ))}
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-red-50/20 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-2xs text-red-650 font-bold">3 critical assets report health score under 50% threshold.</p>
          </div>
        </Card>
      </section>

      {/* Recent Activity & Quick Actions Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Machine Activities */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Recent Machine Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="relative pl-6 space-y-4 border-l border-slate-100/80 py-1">
              {[
                { action: "Maintenance completed for MC-101", time: "12 mins ago" },
                { action: "Machine MC-102 entered maintenance mode", time: "45 mins ago" },
                { action: "Health score updated automatically (MC-103)", time: "2 hours ago" },
                { action: "Inspection assigned to Technician (MC-205)", time: "3 hours ago" },
                { action: "Downtime logged (MC-110, 4.5 hours)", time: "1 day ago" },
                { action: "Operator Amit Kumar reassigned to MC-101", time: "2 days ago" }
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
                onClick={() => setToast("Navigating to Maintenance schedule view...")}
                variant="outline"
                className="justify-start py-6 border-blue-100 text-blue-800 hover:bg-blue-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <Wrench className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Maintenance Schedule</p>
                  <span className="text-3xs text-blue-500 font-medium mt-0.5 block">Inspect active schedules</span>
                </div>
              </Button>
              <Button
                onClick={handleGenerateReport}
                variant="outline"
                className="justify-start py-6 border-indigo-100 text-indigo-800 hover:bg-indigo-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <FileText className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Generate Report</p>
                  <span className="text-3xs text-indigo-500 font-medium mt-0.5 block">Audit machine condition</span>
                </div>
              </Button>
              <Button
                onClick={() => setToast("Opening active Machine Alerts logs...")}
                variant="outline"
                className="justify-start py-6 border-purple-100 text-purple-800 hover:bg-purple-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <AlertCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Review Alerts</p>
                  <span className="text-3xs text-purple-500 font-medium mt-0.5 block">Filter critical warnings</span>
                </div>
              </Button>
              <Button
                onClick={handleExportAnalytics}
                variant="outline"
                className="justify-start py-6 border-emerald-100 text-emerald-800 hover:bg-emerald-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105"
              >
                <Download className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Utilization Report</p>
                  <span className="text-3xs text-emerald-500 font-medium mt-0.5 block">Export stats spreadsheets</span>
                </div>
              </Button>
              <Button
                onClick={() => setToast("Opening Downtime Analysis view...")}
                variant="outline"
                className="justify-start py-6 border-amber-100 text-amber-800 hover:bg-amber-50/55 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 sm:col-span-2"
              >
                <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">View Downtime Analysis</p>
                  <span className="text-3xs text-amber-500 font-medium mt-0.5 block">Inspect weekly outages</span>
                </div>
              </Button>
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <Info className="h-4 w-4 text-indigo-500 flex-shrink-0" />
            <p className="text-2xs text-slate-500 font-semibold">Verify asset operations before scheduling downtime.</p>
          </div>
        </Card>
      </section>

      {/* Machine Details Modal */}
      {isModalOpen && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDetailsModal}></div>
          <Card className="relative z-10 w-full max-w-lg bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-650 text-white pb-6 pt-5 relative">
              <Button
                onClick={closeDetailsModal}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1 border-0"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-blue-100">Machine Operations Profile</p>
                <CardTitle className="text-lg sm:text-xl font-black">
                  {selectedMachine.id} — {selectedMachine.name}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Machine Type</p>
                  <p className="font-bold text-slate-800">{selectedMachine.type}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Department</p>
                  <p className="font-bold text-slate-800">{selectedMachine.department}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Assigned Operator</p>
                  <p className="font-bold text-slate-700">{selectedMachine.operator}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Current Status</p>
                  <Badge className={cn(
                    "text-3xs font-black px-2 py-0.5 border rounded-full",
                    selectedMachine.status === "Running" && "bg-green-50 text-green-700 border-green-200",
                    selectedMachine.status === "Idle" && "bg-amber-50 text-amber-700 border-amber-200",
                    selectedMachine.status === "Maintenance" && "bg-purple-50 text-purple-700 border-purple-200",
                    selectedMachine.status === "Overdue" && "bg-red-50 text-red-700 border-red-200"
                  )}>
                    {selectedMachine.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Health Score</p>
                  <div className="flex items-center gap-1.5">
                    <p className={cn(
                      "font-black",
                      selectedMachine.healthScore >= 90 ? "text-green-600" : selectedMachine.healthScore >= 70 ? "text-blue-600" : selectedMachine.healthScore >= 50 ? "text-amber-600" : "text-red-650"
                    )}>
                      {selectedMachine.healthScore}%
                    </p>
                    <span className="text-3xs text-slate-400 font-bold">
                      ({selectedMachine.healthScore >= 90 ? "Excellent" : selectedMachine.healthScore >= 70 ? "Good" : selectedMachine.healthScore >= 50 ? "Warning" : "Critical"})
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Utilization</p>
                  <p className="font-bold text-slate-700">{selectedMachine.utilization}%</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Total Runtime</p>
                  <p className="font-semibold text-slate-700">{selectedMachine.runtime}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Downtime Hours</p>
                  <p className="font-semibold text-slate-700">{selectedMachine.downtimeHours} Hours</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Last Service</p>
                  <p className="font-semibold text-slate-500">{selectedMachine.lastService}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Next Service</p>
                  <p className="font-semibold text-slate-500">{selectedMachine.nextService}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Maintenance History Log</p>
                <div className="space-y-1">
                  {selectedMachine.history.map((log, i) => (
                    <div key={i} className="text-2xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manager Actions inside Modal */}
              <div className="pt-4 flex flex-wrap gap-2 justify-between border-t border-slate-100/60 mt-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleScheduleMaintenance(selectedMachine.id)}
                    className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-2xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Schedule Maintenance
                  </Button>
                  <Button
                    onClick={() => handleAssignInspection(selectedMachine.id)}
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-2xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Assign Inspection
                  </Button>
                </div>
                <Button
                  onClick={closeDetailsModal}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-2xs px-3.5 py-2 rounded-lg"
                >
                  Close
                </Button>
              </div>

              {/* ERP Restrictive Note */}
              <div className="flex items-center gap-1.5 text-3xs text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <ShieldAlert className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                <span>You do not have permissions to edit machine metadata or delete this asset record.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
