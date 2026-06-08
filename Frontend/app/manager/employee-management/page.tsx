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
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  FileText,
  Download,
  Calendar,
  X,
  AlertTriangle,
  Award,
  CheckCircle,
  Briefcase,
  Play,
  ArrowUpRight,
  Settings,
  ClipboardList,
  AlertCircle,
  Plus,
  Send,
  ShieldAlert,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Bar, Pie } from "react-chartjs-2";
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
interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  attendanceRate: number;
  productivity: number;
  status: "Active" | "Warning" | "Suspended";
  assignedTasks: number;
  completedTasks: number;
  joiningDate: string;
}

interface Task {
  title: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  status: "In Progress" | "Completed" | "Overdue" | "Pending";
}

interface AttendanceSummary {
  name: string;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  rate: number;
}

export default function EmployeeManagementPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Task Assignment State ---
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // --- Complete Employee List ---
  const employees: Employee[] = [
    { id: "EMP-101", name: "Amit Kumar", role: "CNC Operator", department: "Assembly", shift: "Morning", attendanceRate: 98, productivity: 98, status: "Active", assignedTasks: 12, completedTasks: 10, joiningDate: "15 Jan 2024" },
    { id: "EMP-102", name: "Rahul Singh", role: "Assembly Tech", department: "Assembly", shift: "Morning", attendanceRate: 96, productivity: 95, status: "Active", assignedTasks: 8, completedTasks: 7, joiningDate: "01 Feb 2024" },
    { id: "EMP-103", name: "Harsh Gupta", role: "Warehouse Lead", department: "Warehouse", shift: "Evening", attendanceRate: 94, productivity: 92, status: "Active", assignedTasks: 15, completedTasks: 13, joiningDate: "10 Mar 2024" },
    { id: "EMP-104", name: "Vikas Sharma", role: "QC Inspector", department: "Quality Control", shift: "Night", attendanceRate: 90, productivity: 89, status: "Active", assignedTasks: 6, completedTasks: 5, joiningDate: "20 May 2024" },
    { id: "EMP-105", name: "Sarah Jenkins", role: "Maintenance Tech", department: "Assembly", shift: "Night", attendanceRate: 85, productivity: 75, status: "Warning", assignedTasks: 4, completedTasks: 2, joiningDate: "15 Apr 2025" },
    { id: "EMP-106", name: "Rajesh Sharma", role: "Log Staff", department: "Warehouse", shift: "Morning", attendanceRate: 92, productivity: 88, status: "Active", assignedTasks: 9, completedTasks: 8, joiningDate: "12 Nov 2024" },
    { id: "EMP-107", name: "Karan Johar", role: "Boiler Tech", department: "Packaging", shift: "Evening", attendanceRate: 78, productivity: 82, status: "Warning", assignedTasks: 5, completedTasks: 3, joiningDate: "18 Jun 2025" },
    { id: "EMP-108", name: "Suresh Mehta", role: "Crane Op", department: "Dispatch", shift: "Morning", attendanceRate: 88, productivity: 84, status: "Active", assignedTasks: 7, completedTasks: 4, joiningDate: "05 Dec 2024" }
  ];

  // --- Active Tasks List ---
  const [activeTasks, setActiveTasks] = useState<Task[]>([
    { title: "Recalibrate CNC Press MC-101", assignedTo: "Amit Kumar", priority: "High", deadline: "12 Jun 2026", status: "In Progress" },
    { title: "Sort Warehouse Bay 4 Layout", assignedTo: "Harsh Gupta", priority: "Medium", deadline: "15 Jun 2026", status: "Completed" },
    { title: "Inspect Boiler MC-111 Steam Leaks", assignedTo: "Sarah Jenkins", priority: "High", deadline: "10 Jun 2026", status: "Overdue" }
  ]);

  // --- Attendance Summary Records ---
  const attendanceSummary: AttendanceSummary[] = [
    { name: "Amit Kumar", presentDays: 24, absentDays: 1, leaveDays: 1, rate: 98 },
    { name: "Rahul Singh", presentDays: 23, absentDays: 2, leaveDays: 1, rate: 96 },
    { name: "Harsh Gupta", presentDays: 22, absentDays: 3, leaveDays: 1, rate: 94 },
    { name: "Vikas Sharma", presentDays: 21, absentDays: 4, leaveDays: 1, rate: 90 },
    { name: "Sarah Jenkins", presentDays: 18, absentDays: 5, leaveDays: 3, rate: 85 }
  ];

  // --- Chart 1: Attendance Distribution (Pie Chart) ---
  const attendancePieData = {
    labels: ['Present', 'Absent', 'On Leave'],
    datasets: [
      {
        data: [89, 11, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Green-500
          'rgba(239, 68, 68, 0.85)',   // Red-500
          'rgba(245, 158, 11, 0.85)'   // Amber-500
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      }
    ]
  };

  const attendancePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  // --- Chart 2: Employee Productivity (Bar Chart) ---
  const productivityBarData = {
    labels: ['Amit Kumar', 'Rahul Singh', 'Harsh Gupta', 'Vikas Sharma'],
    datasets: [
      {
        label: 'Productivity (%)',
        data: [98, 95, 92, 89],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(99, 102, 241, 0.85)',
          'rgba(245, 158, 11, 0.85)'
        ],
        borderRadius: 6,
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
  const handleExportReport = () => {
    setToast("Exporting Employee Performance CSV...");
    const element = document.createElement("a");
    const csvContent = "Employee ID,Name,Role,Department,Shift,Attendance,Productivity,Status\n" + 
      employees.map(e => `${e.id},${e.name},${e.role},${e.department},${e.shift},${e.attendanceRate}%,${e.productivity}%,${e.status}`).join("\n");
    const file = new Blob([csvContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = `Employee_Performance_Export_${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGenerateAttendance = () => {
    setToast("Generating Attendance PDF Audit Log...");
    const element = document.createElement("a");
    const file = new Blob(["Attendance Overview Log\nPresent Today: 89\nAbsent: 11\nOn Leave: 5"], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Attendance_Report_${Date.now()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskAssignee || !taskDeadline) {
      setToast("Please fill all required task fields");
      return;
    }

    const newTask: Task = {
      title: taskTitle,
      assignedTo: taskAssignee,
      priority: taskPriority,
      deadline: taskDeadline,
      status: "In Progress"
    };

    setActiveTasks([newTask, ...activeTasks]);
    setToast(`Task successfully assigned to ${taskAssignee}`);

    // Reset Form
    setTaskTitle("");
    setTaskAssignee("");
    setTaskPriority("Medium");
    setTaskDeadline("");
    setTaskDescription("");
  };

  const handleViewDetails = (emp: Employee) => {
    setSelectedEmp(emp);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedEmp(null);
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
            Employee Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Monitor workforce attendance, productivity, performance, and task assignments.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={handleExportReport}
            className="px-5 py-2.5 bg-white text-indigo-750 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Employee Report
          </Button>
          <Button
            onClick={handleGenerateAttendance}
            className="px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Generate Attendance Report
          </Button>
        </div>
      </header>

      {/* Top 6 KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Employees"
          value="100"
          subtitle="Registered operators"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Present Today"
          value="89"
          subtitle="Duty shifts A/B active"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Absent Today"
          value="11"
          subtitle="Unexcused absentees"
          icon={UserX}
          color="red"
        />
        <StatCard
          title="On Leave"
          value="5"
          subtitle="Approved holiday leaves"
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Avg Productivity"
          value="91%"
          subtitle="Target: 90% benchmark"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Completed Today"
          value="245"
          subtitle="Workforce task submissions"
          icon={CheckCircle}
          color="purple"
        />
      </section>

      {/* Attendance & Productivity Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Attendance Distribution */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative flex items-center justify-center">
            <div className="h-full w-full relative">
              <Pie data={attendancePieData} options={attendancePieOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Employee Productivity */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-650 bg-clip-text text-transparent flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Employee Productivity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 sm:h-72 lg:h-80 relative">
            <Bar data={productivityBarData} options={productivityBarOptions} />
          </CardContent>
        </Card>
      </section>

      {/* Employee List Table */}
      <section>
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Employee Management Directory
              </CardTitle>
            </div>
            <Badge className="text-2xs bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">Active Duty</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold text-left">
                  <th className="py-3 px-4 font-bold">Employee ID</th>
                  <th className="py-3 px-4 font-bold">Employee Name</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Department</th>
                  <th className="py-3 px-4 font-bold">Shift</th>
                  <th className="py-3 px-4 text-center font-bold">Attendance %</th>
                  <th className="py-3 px-4 text-center font-bold">Productivity %</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">{emp.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{emp.name}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{emp.role}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{emp.department}</td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">{emp.shift}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-750">{emp.attendanceRate}%</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-650">{emp.productivity}%</td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        "text-3xs font-black px-2 py-0.5 rounded-full border",
                        emp.status === "Active" && "bg-green-50 text-green-700 border-green-200",
                        emp.status === "Warning" && "bg-amber-50 text-amber-700 border-amber-200",
                        emp.status === "Suspended" && "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Button
                        onClick={() => handleViewDetails(emp)}
                        variant="outline"
                        size="sm"
                        className="text-2xs font-bold border-indigo-200 text-indigo-750 hover:bg-indigo-50/55 rounded-lg flex items-center gap-1 mx-auto"
                      >
                        View Details
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Task Assignment & Active Tasks Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Task Assignment Form */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl lg:col-span-1">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Assign Task
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-4">
            <form onSubmit={handleAssignTask} className="space-y-3">
              {/* Employee Selector */}
              <div className="space-y-1">
                <label className="text-3xs uppercase tracking-wider font-bold text-slate-400">Employee</label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  required
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Employee...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.name}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              {/* Task Title */}
              <div className="space-y-1">
                <label className="text-3xs uppercase tracking-wider font-bold text-slate-400">Task Title</label>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Priority & Deadline Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider font-bold text-slate-400">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider font-bold text-slate-400">Deadline</label>
                  <input
                    type="text"
                    placeholder="15 Jun 2026"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    required
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-3xs uppercase tracking-wider font-bold text-slate-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                Assign Task
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Tasks Table */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl lg:col-span-2">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Active Operational Tasks
              </CardTitle>
            </div>
            <Badge className="text-2xs bg-purple-50 text-purple-750 font-bold border border-purple-200">Workforce Backlog</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold text-left">
                  <th className="py-3 px-4 font-bold">Task</th>
                  <th className="py-3 px-4 font-bold">Assigned To</th>
                  <th className="py-3 px-4 text-center font-bold">Priority</th>
                  <th className="py-3 px-4 font-bold">Deadline</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeTasks.map((task, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">{task.title}</td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">{task.assignedTo}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={cn(
                        "text-3xs font-black px-2 py-0.5 rounded-full border",
                        task.priority === "High" && "bg-red-50 text-red-650 border-red-200",
                        task.priority === "Medium" && "bg-amber-50 text-amber-650 border-amber-200",
                        task.priority === "Low" && "bg-blue-50 text-blue-650 border-blue-200"
                      )}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">{task.deadline}</td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        "text-3xs font-black px-2 py-0.5 rounded-full border",
                        task.status === "Completed" && "bg-green-50 text-green-700 border-green-200",
                        task.status === "In Progress" && "bg-blue-50 text-blue-700 border-blue-200",
                        task.status === "Overdue" && "bg-red-50 text-red-700 border-red-200",
                        task.status === "Pending" && "bg-gray-50 text-slate-600 border-slate-200"
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

      {/* Attendance Summary Table */}
      <section>
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Weekly Attendance Summary
              </CardTitle>
            </div>
            <Badge className="text-2xs bg-orange-50 text-orange-750 font-bold border border-orange-200">Attendance Log</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold text-left">
                  <th className="py-3 px-4 font-bold">Employee</th>
                  <th className="py-3 px-4 text-center font-bold">Present Days</th>
                  <th className="py-3 px-4 text-center font-bold">Absent Days</th>
                  <th className="py-3 px-4 text-center font-bold">Leave Days</th>
                  <th className="py-3 px-4 text-center font-bold">Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {attendanceSummary.map((record, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-700">{record.name}</td>
                    <td className="py-3 px-4 text-center text-slate-600 font-medium">{record.presentDays}</td>
                    <td className="py-3 px-4 text-center text-slate-650 font-medium">{record.absentDays}</td>
                    <td className="py-3 px-4 text-center text-slate-500 font-medium">{record.leaveDays}</td>
                    <td className="py-3 px-4 text-center font-black text-indigo-650">{record.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Top Performers & Requiring Attention Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Performers */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-650">
                <Award className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Top Performing Operators
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "EMP-101", name: "Amit Kumar", score: 98, medal: "🥇" },
                { id: "EMP-102", name: "Rahul Singh", score: 95, medal: "🥈" },
                { id: "EMP-103", name: "Harsh Gupta", score: 92, medal: "🥉" }
              ].map((perf, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center flex flex-col items-center justify-between gap-3 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-2xl">{perf.medal}</div>
                  <div>
                    <h4 className="font-bold text-slate-850 text-xs sm:text-sm">{perf.name}</h4>
                    <p className="text-3xs text-slate-450 font-semibold mt-0.5">{perf.id}</p>
                  </div>
                  <Badge className="bg-indigo-50 text-indigo-750 text-xs font-black py-0.5 px-2 border border-indigo-200">
                    {perf.score}% Prod
                  </Badge>
                </div>
              ))}
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-amber-50/20 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <p className="text-2xs text-slate-500 font-bold">Amit Kumar holds the highest production rating this cycle.</p>
          </div>
        </Card>

        {/* Employees Requiring Attention */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-50 text-red-650 animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Employees Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Sarah Jenkins", reason: "Low Productivity", score: "75%", badge: "Productivity Alert" },
                { name: "Karan Johar", reason: "Low Attendance", score: "78%", badge: "Attendance Drop" },
                { name: "Suresh Mehta", reason: "Overdue Tasks", score: "3 Tasks", badge: "Task Backlog" }
              ].map((warn, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-red-50 bg-red-50/10 text-center flex flex-col items-center justify-between gap-3 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-2xl text-red-550">⚠️</div>
                  <div>
                    <h4 className="font-bold text-slate-850 text-xs sm:text-sm">{warn.name}</h4>
                    <p className="text-3xs text-slate-400 font-bold mt-0.5">{warn.reason}</p>
                  </div>
                  <Badge className="bg-red-50 text-red-650 text-xs font-black py-0.5 px-2 border border-red-200">
                    {warn.score} ({warn.badge})
                  </Badge>
                </div>
              ))}
            </CardContent>
          </div>
          <div className="px-6 py-3 bg-red-50/20 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-2xs text-red-650 font-bold">Attention required for low-rating workforce targets.</p>
          </div>
        </Card>
      </section>

      {/* Employee Alerts & Recent Activities Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Employee Alerts */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 animate-pulse">
              <AlertCircle className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Workforce Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3">
            {[
              { text: "Attendance below threshold", desc: "Karan Johar attendance rate dropped to 78%", type: "error" },
              { text: "Productivity drop detected", desc: "Sarah Jenkins recorded 75% output efficiency", type: "warning" },
              { text: "Task overdue", desc: "Inspect Boiler MC-111 is 2 days overdue (Sarah Jenkins)", type: "error" },
              { text: "Shift shortage warning", desc: "Night shift has 2 missing operators in Assembly", type: "warning" }
            ].map((alert, i) => (
              <div key={i} className={cn(
                "p-3.5 rounded-xl border flex gap-3 hover:shadow-md transition-shadow",
                alert.type === "error" && "border-red-100 bg-red-50/30",
                alert.type === "warning" && "border-amber-100 bg-amber-50/30"
              )}>
                <AlertTriangle className={cn(
                  "h-5 w-5 flex-shrink-0 mt-0.5",
                  alert.type === "error" && "text-red-600",
                  alert.type === "warning" && "text-amber-600"
                )} />
                <div>
                  <h4 className="font-bold text-slate-850 text-xs sm:text-sm">{alert.text}</h4>
                  <p className="text-3xs text-slate-500 font-semibold mt-0.5">{alert.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities Timeline */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="relative pl-6 space-y-4 border-l border-slate-100/80 py-1">
              {[
                { action: "Task assigned to Amit Kumar", time: "10 mins ago" },
                { action: "Attendance log updated by Shift Supervisor", time: "1 hour ago" },
                { action: "Task completed: Sort Warehouse Layout (Harsh Gupta)", time: "3 hours ago" },
                { action: "Shift changed for Sarah Jenkins to Night Shift", time: "1 day ago" },
                { action: "Performance review submitted for Amit Kumar", time: "2 days ago" }
              ].map((log, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 bg-white border-4 border-indigo-500 h-4 w-4 rounded-full shadow-sm"></span>
                  <div className="flex justify-between items-start gap-4 hover:bg-slate-50/50 rounded-lg p-1 -m-1 transition-all duration-300">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-700 text-xs sm:text-sm">{log.action}</h4>
                      <p className="text-3xs text-slate-400 font-semibold">EcoHub Manager Portal</p>
                    </div>
                    <span className="text-3xs text-slate-400 font-bold whitespace-nowrap">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Employee Details Modal */}
      {isModalOpen && selectedEmp && (
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
                <p className="text-3xs uppercase tracking-wider font-bold text-blue-100 font-black">Workforce Operations Profile</p>
                <CardTitle className="text-lg sm:text-xl font-black">
                  {selectedEmp.id} — {selectedEmp.name}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Designated Role</p>
                  <p className="font-bold text-slate-800">{selectedEmp.role}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Department</p>
                  <p className="font-bold text-slate-800">{selectedEmp.department}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Assigned Shift</p>
                  <p className="font-bold text-slate-700">{selectedEmp.shift}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Current Status</p>
                  <Badge className={cn(
                    "text-3xs font-black px-2 py-0.5 border rounded-full",
                    selectedEmp.status === "Active" && "bg-green-50 text-green-700 border-green-200",
                    selectedEmp.status === "Warning" && "bg-amber-50 text-amber-700 border-amber-200",
                    selectedEmp.status === "Suspended" && "bg-red-50 text-red-700 border-red-200"
                  )}>
                    {selectedEmp.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Attendance Percentage</p>
                  <p className="font-bold text-slate-800">{selectedEmp.attendanceRate}%</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Productivity Percentage</p>
                  <p className="font-bold text-indigo-650 font-black">{selectedEmp.productivity}%</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Assigned Tasks</p>
                  <p className="font-semibold text-slate-700">{selectedEmp.assignedTasks} Tasks</p>
                </div>

                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Completed Tasks</p>
                  <p className="font-semibold text-slate-700">{selectedEmp.completedTasks} Tasks</p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Joining Date</p>
                  <p className="font-semibold text-slate-500">{selectedEmp.joiningDate}</p>
                </div>
              </div>

              {/* Close and ERP warning note */}
              <div className="pt-4 flex justify-end border-t border-slate-100 mt-2">
                <Button onClick={closeDetailsModal} className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold px-5 py-2 rounded-xl">
                  Close Details
                </Button>
              </div>

              <div className="flex items-center gap-1.5 text-3xs text-slate-450 bg-slate-50 p-2.5 rounded-xl border border-slate-150/40">
                <ShieldAlert className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <span>Managerial Role Exclusions: You do not have permission to delete this user, modify account roles, or manage user account credentials.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
