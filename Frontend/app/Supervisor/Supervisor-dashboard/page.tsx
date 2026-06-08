"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/ui/stat-card";
import IntegratedLoader from "@/components/layout/IntegratedLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Activity,
  Users,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  FileText,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Zap,
  Info,
  Calendar,
  MoreVertical,
  Briefcase,
  Play,
  RotateCcw,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type Worker = {
  id: string;
  name: string;
  department: string;
  shift: string;
  status: "Present" | "Absent";
  currentStatus: "Working" | "Not Available" | "Break";
};

type Task = {
  id: string;
  name: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  status: "Completed" | "In Progress" | "Pending";
};

type Directive = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status: "In Progress" | "Pending" | "Completed";
};

type Issue = {
  id: string;
  title: string;
  time: string;
  status: "Open" | "In Progress" | "Resolved";
  severity: "Critical" | "High" | "Medium" | "Low";
};

type ActivityLog = {
  id: string;
  time: string;
  text: string;
  type: "production" | "task" | "issue" | "attendance" | "system";
};

export default function SupervisorDashboard() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "info"; message: string } | null>(null);

  // Dynamic States
  const [productionOutput, setProductionOutput] = useState(4850);
  const productionTarget = 5000;
  
  const [workers, setWorkers] = useState<Worker[]>([
    { id: "EMP-101", name: "Amit Kumar", department: "Assembly", shift: "Morning", status: "Present", currentStatus: "Working" },
    { id: "EMP-102", name: "Rahul Singh", department: "Packaging", shift: "Morning", status: "Present", currentStatus: "Working" },
    { id: "EMP-103", name: "Rohan Sharma", department: "Assembly", shift: "Morning", status: "Absent", currentStatus: "Not Available" },
    { id: "EMP-104", name: "Sunil Verma", department: "Quality Control", shift: "Morning", status: "Present", currentStatus: "Working" },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "TSK-01", name: "Machine Inspection", assignedTo: "Amit Kumar", priority: "High", deadline: "Today", status: "Completed" },
    { id: "TSK-02", name: "Packaging Review", assignedTo: "Rahul Singh", priority: "Medium", deadline: "Today", status: "In Progress" },
    { id: "TSK-03", name: "Quality Check Line 3", assignedTo: "Sunil Verma", priority: "High", deadline: "Today", status: "Pending" },
  ]);

  const [directives] = useState<Directive[]>([
    { id: "DIR-01", title: "Increase Production by 10%", priority: "High", dueDate: "20 Jun 2026", status: "In Progress" },
    { id: "DIR-02", title: "Machine Inspection Drive", priority: "Medium", dueDate: "18 Jun 2026", status: "Pending" },
  ]);

  const [issues, setIssues] = useState<Issue[]>([
    { id: "ISS-01", title: "Machine MC-103 stopped unexpectedly", time: "10 mins ago", status: "Open", severity: "Critical" },
    { id: "ISS-02", title: "Raw material shortage detected", time: "1 hour ago", status: "In Progress", severity: "High" },
    { id: "ISS-03", title: "Worker absent during shift", time: "2 hours ago", status: "Open", severity: "Medium" },
    { id: "ISS-04", title: "Quality issue reported", time: "3 hours ago", status: "Resolved", severity: "Medium" }
  ]);

  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: "ACT-01", time: "Just now", text: "Production updated (+150 units)", type: "production" },
    { id: "ACT-02", time: "15 mins ago", text: "Task 'Machine Inspection' marked complete by Amit Kumar", type: "task" },
    { id: "ACT-03", time: "30 mins ago", text: "Issue 'Machine MC-103 stopped unexpectedly' reported", type: "issue" },
    { id: "ACT-04", time: "1 hour ago", text: "Worker attendance updated (24 present)", type: "attendance" },
    { id: "ACT-05", time: "2 hours ago", text: "Shift report draft saved", type: "system" }
  ]);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [isShiftReportModalOpen, setIsShiftReportModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // New Form Fields
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Amit Kumar");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueSeverity, setNewIssueSeverity] = useState<"Critical" | "High" | "Medium" | "Low">("High");

  const [productionIncrement, setProductionIncrement] = useState("150");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "info", message: string) => {
    setToast({ type, message });
  };

  const addActivity = (text: string, type: ActivityLog["type"]) => {
    const newAct: ActivityLog = {
      id: `ACT-${Date.now()}`,
      time: "Just now",
      text,
      type
    };
    setActivities([newAct, ...activities]);
  };

  // Actions
  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName) return;

    const newTask: Task = {
      id: `TSK-${Math.floor(10 + Math.random() * 90)}`,
      name: newTaskName,
      assignedTo: newTaskAssignee,
      priority: newTaskPriority,
      deadline: "Today",
      status: "Pending"
    };

    setTasks([...tasks, newTask]);
    addActivity(`Task '${newTaskName}' assigned to ${newTaskAssignee}`, "task");
    setIsTaskModalOpen(false);
    setNewTaskName("");
    showToast("success", `Assigned task to ${newTaskAssignee}!`);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask) {
      addActivity(`Task '${targetTask.name}' status updated to ${newStatus}`, "task");
      showToast("success", `Task status updated to ${newStatus}.`);
    }
  };

  const handleMarkTaskComplete = (taskId: string) => {
    handleUpdateTaskStatus(taskId, "Completed");
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle) return;

    const newIssue: Issue = {
      id: `ISS-${Math.floor(10 + Math.random() * 90)}`,
      title: newIssueTitle,
      time: "Just now",
      status: "Open",
      severity: newIssueSeverity
    };

    setIssues([newIssue, ...issues]);
    addActivity(`Issue '${newIssueTitle}' reported`, "issue");
    setIsIssueModalOpen(false);
    setNewIssueTitle("");
    showToast("success", "Issue submitted successfully!");
  };

  const handleUpdateIssueStatus = (issueId: string, newStatus: Issue["status"]) => {
    setIssues(issues.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
    const targetIssue = issues.find(i => i.id === issueId);
    if (targetIssue) {
      addActivity(`Issue '${targetIssue.title}' updated to ${newStatus}`, "issue");
      showToast("success", `Issue status updated to ${newStatus}.`);
    }
  };

  const handleResolveIssue = (issueId: string) => {
    handleUpdateIssueStatus(issueId, "Resolved");
  };

  const handleEscalateIssue = (issueId: string) => {
    const targetIssue = issues.find(i => i.id === issueId);
    if (targetIssue) {
      addActivity(`Issue '${targetIssue.title}' escalated to Manager`, "issue");
      showToast("info", "Issue escalated to Manager.");
    }
  };

  const handleUpdateProduction = (e: React.FormEvent) => {
    e.preventDefault();
    const inc = parseInt(productionIncrement, 10);
    if (isNaN(inc) || inc <= 0) return;

    const newOutput = Math.min(productionOutput + inc, productionTarget * 1.1);
    setProductionOutput(newOutput);
    addActivity(`Production updated (+${inc} units)`, "production");
    setIsProductionModalOpen(false);
    showToast("success", `Updated production output to ${newOutput.toLocaleString()} units.`);
  };

  const handleSubmitShiftReport = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity("Shift report submitted successfully to Manager", "system");
    setIsShiftReportModalOpen(false);
    showToast("success", "Shift report submitted successfully!");
  };

  const workersPresent = workers.filter(w => w.status === "Present").length;
  const workersTotal = workers.length;
  const runningMachinesCount = 12;
  const openIssuesCount = issues.filter(i => i.status !== "Resolved").length;
  const pendingDirectivesCount = directives.filter(d => d.status !== "Completed").length;
  const tasksCompletedCount = tasks.filter(t => t.status === "Completed").length;

  const productionProgress = Math.round((productionOutput / productionTarget) * 100);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <IntegratedLoader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn relative pb-10">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700/50 animate-slideInRight">
          <div className="bg-emerald-500 text-white rounded-full p-1 animate-pulse">
            <Check className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="space-y-1 sm:space-y-2 relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg leading-tight">
            Supervisor Dashboard
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Monitor daily operations, workforce activities, production progress, machine status, and shift performance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={() => setIsProductionModalOpen(true)}
            className="px-5 py-2.5 bg-white text-teal-700 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Update Production
          </Button>
          <Button
            onClick={() => setIsShiftReportModalOpen(true)}
            className="px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Submit Shift Report
          </Button>
        </div>
      </header>

      {/* Top 6 KPI Cards Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Today's Production */}
        <StatCard
          title="Today's Production"
          value={`${productionOutput.toLocaleString()} Units`}
          subtitle={`Target: ${productionTarget.toLocaleString()} (${productionProgress}%)`}
          icon={Activity}
          color="green"
          onClick={() => setIsProductionModalOpen(true)}
        />
        {/* KPI 2: Workers Present */}
        <StatCard
          title="Workers Present"
          value={`${workersPresent} / ${workersTotal}`}
          subtitle="Current shift attendance"
          icon={Users}
          color="blue"
        />
        {/* KPI 3: Running Machines */}
        <StatCard
          title="Running Machines"
          value={`${runningMachinesCount}`}
          subtitle="Machines operational"
          icon={Settings}
          color="indigo"
        />
        {/* KPI 4: Tasks Completed */}
        <StatCard
          title="Tasks Completed"
          value={`${tasksCompletedCount}`}
          subtitle="Completed today"
          icon={CheckCircle}
          color="emerald"
        />
        {/* KPI 5: Open Issues */}
        <StatCard
          title="Open Issues"
          value={`${openIssuesCount}`}
          subtitle="Awaiting resolution"
          icon={AlertTriangle}
          color="red"
        />
        {/* KPI 6: Pending Directives */}
        <StatCard
          title="Pending Directives"
          value={`${pendingDirectivesCount}`}
          subtitle="Awaiting execution"
          icon={Clock}
          color="amber"
        />
      </section>

      {/* Production Progress & Shift Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Production Progress Card */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Production Progress</h3>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 text-3xs">
              {productionProgress}% Achieved
            </Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Current Output</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800">{productionOutput.toLocaleString()} <span className="text-xs text-slate-400 font-bold">/ {productionTarget.toLocaleString()} Units</span></span>
            </div>
            <Progress value={productionProgress} className="h-3.5 bg-slate-100 rounded-full" />
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Daily Target</p>
                <p className="text-sm font-black text-slate-700 mt-0.5">{productionTarget.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Current</p>
                <p className="text-sm font-black text-slate-750 mt-0.5">{productionOutput.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Remaining</p>
                <p className="text-sm font-black text-slate-700 mt-0.5">{Math.max(0, productionTarget - productionOutput).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Shift Overview Card */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Current Shift Overview</h3>
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 text-3xs">
                Morning Shift
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Scheduled Workers</span>
                <span className="text-slate-800 font-extrabold">{workersTotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Workers Present</span>
                <span className="text-slate-800 font-extrabold text-blue-600">{workersPresent}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Running Machines</span>
                <span className="text-slate-800 font-extrabold text-indigo-600">{runningMachinesCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Attendance Rate</span>
                <span className="text-slate-800 font-extrabold text-emerald-600">86%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Shift Efficiency</span>
                <span className="text-slate-800 font-extrabold text-purple-600">97%</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Workforce Supervision & Attendance */}
      <section className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-md font-bold text-slate-800">Worker Attendance</h3>
            <p className="text-xs text-slate-500">Monitor active shift workforce status and assignment.</p>
          </div>
          <Badge className="bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 px-2.5 py-1 font-bold text-2xs uppercase">
            {workersPresent} Present Today
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-150">
              <TableRow>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3 pl-6">Employee ID</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Employee Name</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Department</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Shift</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Attendance</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3 pr-6">Current Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0 transition-colors">
                  <TableCell className="font-semibold text-slate-800 text-xs py-3 pl-6">{worker.id}</TableCell>
                  <TableCell className="font-bold text-slate-700 text-xs py-3">{worker.name}</TableCell>
                  <TableCell className="text-slate-500 text-xs font-semibold py-3">{worker.department}</TableCell>
                  <TableCell className="text-slate-500 text-xs font-semibold py-3">{worker.shift}</TableCell>
                  <TableCell className="py-3">
                    <Badge className={cn(
                      "font-extrabold text-4xs px-2 py-0.5 border rounded-full uppercase tracking-wider",
                      worker.status === "Present"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {worker.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 pr-6">
                    <span className={cn(
                      "text-xs font-bold",
                      worker.currentStatus === "Working" && "text-emerald-600",
                      worker.currentStatus === "Not Available" && "text-slate-400",
                      worker.currentStatus === "Break" && "text-amber-600"
                    )}>
                      {worker.currentStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Task Management */}
      <section className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50">
          <div>
            <h3 className="text-md font-bold text-slate-800">Task Management</h3>
            <p className="text-xs text-slate-500">Assign floor tasks and verify completion.</p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-slate-800 text-white hover:bg-slate-900 rounded-xl font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Assign Task
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-150">
              <TableRow>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3 pl-6">Task Name</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Assigned To</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Priority</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Deadline</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3">Status</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3 pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0 transition-colors">
                  <TableCell className="font-semibold text-slate-800 text-xs py-3 pl-6">{task.name}</TableCell>
                  <TableCell className="font-bold text-slate-700 text-xs py-3">{task.assignedTo}</TableCell>
                  <TableCell className="py-3">
                    <Badge className={cn(
                      "font-extrabold text-4xs px-2 py-0.5 border rounded-full uppercase tracking-wider",
                      task.priority === "High" && "bg-red-50 text-red-700 border-red-200",
                      task.priority === "Medium" && "bg-amber-50 text-amber-700 border-amber-200",
                      task.priority === "Low" && "bg-slate-50 text-slate-600 border-slate-200"
                    )}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs font-semibold py-3">{task.deadline}</TableCell>
                  <TableCell className="py-3">
                    <Badge className={cn(
                      "font-extrabold text-4xs px-2 py-0.5 border rounded-full uppercase tracking-wider",
                      task.status === "Completed" && "bg-green-50 text-green-700 border-green-200",
                      task.status === "In Progress" && "bg-blue-50 text-blue-700 border-blue-200",
                      task.status === "Pending" && "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {task.status !== "Completed" && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkTaskComplete(task.id)}
                          className="h-7 px-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-700 font-bold text-3xs rounded-lg shadow-sm"
                        >
                          Mark Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setSelectedTask(task); }}
                        className="h-7 px-2.5 text-slate-600 hover:bg-slate-100 font-bold text-3xs rounded-lg"
                      >
                        View Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Machine Status Overview & Active Directives */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Machine Status Overview Card */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Machine Status Overview</h3>
              <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2 py-0.5 text-3xs">
                15 total units
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                <p className="text-4xs font-bold text-emerald-600 uppercase tracking-wider">Running</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">12</p>
              </div>
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-center">
                <p className="text-4xs font-bold text-slate-500 uppercase tracking-wider">Idle</p>
                <p className="text-xl sm:text-2xl font-black text-slate-700 mt-1">2</p>
              </div>
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                <p className="text-4xs font-bold text-red-500 uppercase tracking-wider">Maintenance</p>
                <p className="text-xl sm:text-2xl font-black text-red-800 mt-1">1</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => showToast("info", "Navigating to Machine Status Detail view...")}
            className="w-full py-2.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm"
          >
            View Machine Details
          </Button>
        </Card>

        {/* Active Directives Card */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Active Directives</h3>
          </div>
          <div className="space-y-3">
            {directives.map((dir) => (
              <div key={dir.id} className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-xl transition-all flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{dir.title}</h4>
                  <div className="flex items-center gap-2.5">
                    <span className="text-4xs text-slate-400 font-bold uppercase">Due: {dir.dueDate}</span>
                    <Badge className={cn(
                      "font-extrabold text-5xs px-1.5 py-0.2 border rounded-full uppercase tracking-wider",
                      dir.priority === "High" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {dir.priority} Priority
                    </Badge>
                  </div>
                </div>
                <Badge className={cn(
                  "font-extrabold text-4xs px-2 py-0.5 border rounded-full uppercase tracking-wider",
                  dir.status === "In Progress" && "bg-blue-50 text-blue-700 border-blue-200",
                  dir.status === "Pending" && "bg-slate-100 text-slate-500 border-slate-200"
                )}>
                  {dir.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Operational Issues & Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Issues & Incidents Card */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 bg-white">
            <div>
              <h3 className="text-base font-bold text-slate-800">Operational Issues & Incidents</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Track and report workshop incidents immediately.</p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsIssueModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Report Issue
            </Button>
          </div>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {issues.map((issue) => (
              <div key={issue.id} className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-xl transition-all flex items-center justify-between group">
                <div className="space-y-1 min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full flex-shrink-0 animate-pulse",
                      issue.status === "Open" && "bg-red-500",
                      issue.status === "In Progress" && "bg-amber-500",
                      issue.status === "Resolved" && "bg-emerald-500"
                    )} />
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{issue.title}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xs text-slate-400 font-semibold">{issue.time}</span>
                    <Badge className={cn(
                      "font-extrabold text-5xs px-1.5 py-0.2 border rounded-full uppercase tracking-wider",
                      issue.severity === "Critical" && "bg-red-100 text-red-800 border-red-200",
                      issue.severity === "High" && "bg-orange-100 text-orange-800 border-orange-200",
                      issue.severity === "Medium" && "bg-amber-100 text-amber-800 border-amber-200",
                      issue.severity === "Low" && "bg-slate-100 text-slate-600 border-slate-200"
                    )}>
                      {issue.severity} Severity
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {issue.status !== "Resolved" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleResolveIssue(issue.id)}
                        className="h-7 px-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-700 font-bold text-3xs rounded-lg"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEscalateIssue(issue.id)}
                        className="h-7 px-2 text-red-600 hover:bg-red-50 font-bold text-3xs rounded-lg"
                      >
                        Escalate
                      </Button>
                    </>
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-4xs font-extrabold">RESOLVED</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Timeline Activities Card */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Recent Activities</h3>
          </div>
          <div className="relative pl-4 border-l border-slate-200 ml-1.5 space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Bullet Icon */}
                <span className={cn(
                  "absolute -left-[20.5px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white flex-shrink-0 flex items-center justify-center shadow-md",
                  act.type === "production" && "bg-green-500",
                  act.type === "task" && "bg-blue-500",
                  act.type === "issue" && "bg-red-500",
                  act.type === "attendance" && "bg-indigo-500",
                  act.type === "system" && "bg-slate-400"
                )} />
                <div className="space-y-0.5">
                  <p className="text-2xs font-bold text-slate-700 leading-normal">{act.text}</p>
                  <p className="text-4xs text-slate-400 font-semibold">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Performance Summary & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {/* Performance metrics */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Shift Performance Summary</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Target Output</p>
                <p className="text-lg font-black text-slate-750 mt-1">{productionTarget.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Actual Output</p>
                <p className="text-lg font-black text-slate-750 mt-1 text-emerald-600">{productionOutput.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Efficiency</p>
                <p className="text-lg font-black text-slate-750 mt-1 text-purple-600">{productionProgress}%</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Tasks Done</p>
                <p className="text-lg font-black text-slate-750 mt-1 text-blue-600">{tasksCompletedCount}</p>
              </div>
            </div>
            {/* Shift Summary Report List details */}
            <div className="mt-5 bg-slate-50/50 p-4 border border-slate-200 rounded-2xl space-y-2.5 text-xs text-slate-600 font-semibold">
              <p className="font-bold text-slate-850 uppercase text-3xs tracking-wider border-b border-slate-100 pb-1 mb-2">Today's Shift Summary</p>
              <div className="flex justify-between">
                <span>Production Output</span>
                <span className="text-slate-800 font-bold">{productionOutput.toLocaleString()} Units</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Percentage</span>
                <span className="text-slate-800 font-bold">86%</span>
              </div>
              <div className="flex justify-between">
                <span>Tasks Completed</span>
                <span className="text-slate-800 font-bold">{tasksCompletedCount} of {tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Issues Reported</span>
                <span className="text-slate-800 font-bold">{issues.filter(i => i.status !== "Resolved").length} open</span>
              </div>
              <div className="flex justify-between">
                <span>Machines Running</span>
                <span className="text-slate-800 font-bold">{runningMachinesCount} / 15</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              onClick={() => setIsTaskModalOpen(true)}
              className="py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-2xs rounded-xl flex flex-col items-center justify-center gap-1 shadow"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Assign Task</span>
            </Button>
            <Button
              onClick={() => setIsProductionModalOpen(true)}
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl flex flex-col items-center justify-center gap-1 shadow"
            >
              <Activity className="h-4.5 w-4.5" />
              <span>Update Production</span>
            </Button>
            <Button
              onClick={() => setIsIssueModalOpen(true)}
              className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-2xs rounded-xl flex flex-col items-center justify-center gap-1 shadow"
            >
              <AlertTriangle className="h-4.5 w-4.5" />
              <span>Report Issue</span>
            </Button>
            <Button
              onClick={() => setIsShiftReportModalOpen(true)}
              className="py-3 bg-indigo-650 hover:bg-indigo-755 text-white font-bold text-2xs rounded-xl flex flex-col items-center justify-center gap-1 shadow"
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Submit Report</span>
            </Button>
            <Button
              onClick={() => showToast("info", "Scrolling to Worker Attendance...")}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-2xs rounded-xl flex flex-col items-center justify-center gap-1"
            >
              <Users className="h-4.5 w-4.5" />
              <span>View Attendance</span>
            </Button>
            <Button
              onClick={() => showToast("info", "Navigating to Machine Status overview...")}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-2xs rounded-xl flex flex-col items-center justify-center gap-1"
            >
              <Settings className="h-4.5 w-4.5" />
              <span>Machine Status</span>
            </Button>
          </div>
        </Card>
      </section>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Assign Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-850 text-sm sm:text-base">Assign New Floor Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAssignTask} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider">Task Name</label>
                <input
                  type="text"
                  required
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g., Check belt tension on Line 2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-655 uppercase tracking-wider">Assign To</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700"
                >
                  {workers.map(w => <option key={w.id} value={w.name}>{w.name} ({w.id})</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-655 uppercase tracking-wider">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["High", "Medium", "Low"] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={cn(
                        "py-2 border rounded-xl font-bold text-2xs transition-all",
                        newTaskPriority === p
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-3 border border-slate-200 rounded-xl text-3xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Info className="h-4 w-4 text-slate-450" />
                <span>Assigned tasks must be completed before shift sign-off.</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)} className="h-10 px-4 font-bold text-slate-600 hover:bg-slate-150 text-xs rounded-xl">Cancel</Button>
                <Button type="submit" className="h-10 px-5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md">Assign Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Report Issue Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-850 text-sm sm:text-base">Report Operational Issue</h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleReportIssue} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-655 uppercase tracking-wider">Issue Description</label>
                <input
                  type="text"
                  required
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  placeholder="e.g., Conveyor belt alignment slip"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-655 uppercase tracking-wider">Severity Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Critical", "High", "Medium", "Low"] as const).map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewIssueSeverity(sev)}
                      className={cn(
                        "py-2 border rounded-xl font-bold text-4xs uppercase tracking-wider transition-all",
                        newIssueSeverity === sev
                          ? "bg-red-600 text-white border-red-600 shadow shadow-red-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                      )}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-red-50/50 p-3 border border-red-100 rounded-xl text-3xs text-red-700 font-semibold leading-normal flex items-start gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-red-500 flex-shrink-0" />
                <p>Critical issues trigger immediate alarms for on-duty engineers and are auto-logged to state reports.</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsIssueModalOpen(false)} className="h-10 px-4 font-bold text-slate-600 hover:bg-slate-150 text-xs rounded-xl">Cancel</Button>
                <Button type="submit" className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md">Log Issue</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Update Production Modal */}
      {isProductionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-850 text-sm sm:text-base">Update Production Output</h3>
              <button onClick={() => setIsProductionModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdateProduction} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider">Output Increment (Units)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={productionIncrement}
                  onChange={(e) => setProductionIncrement(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-base font-extrabold text-slate-750 text-center"
                />
              </div>
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-1.5 text-3xs text-slate-550 font-semibold leading-normal">
                <div className="flex justify-between font-bold">
                  <span>Current Output:</span>
                  <span>{productionOutput.toLocaleString()} Units</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-1.5 text-slate-800">
                  <span>Forecast Output:</span>
                  <span>{(productionOutput + (parseInt(productionIncrement, 10) || 0)).toLocaleString()} Units</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsProductionModalOpen(false)} className="h-10 px-4 font-bold text-slate-600 hover:bg-slate-150 text-xs rounded-xl">Cancel</Button>
                <Button type="submit" className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">Add Output</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Submit Shift Report Modal */}
      {isShiftReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-850 text-sm sm:text-base">Submit Shift Report</h3>
              <button onClick={() => setIsShiftReportModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmitShiftReport} className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-2.5 text-xs text-slate-600 font-semibold">
                <p className="font-bold text-slate-800 uppercase text-3xs tracking-wider border-b border-slate-100 pb-1 mb-2">Compiled Data Summary</p>
                <div className="flex justify-between">
                  <span>Shift Name</span>
                  <span className="text-slate-850 font-bold">Morning Shift</span>
                </div>
                <div className="flex justify-between">
                  <span>Production Output</span>
                  <span className="text-slate-850 font-bold text-emerald-600">{productionOutput.toLocaleString()} Units</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff Attendance</span>
                  <span className="text-slate-850 font-bold">{workersPresent} Present / {workersTotal} Total</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasks Status</span>
                  <span className="text-slate-850 font-bold text-blue-600">{tasksCompletedCount} Completed / {tasks.length} Total</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Issues</span>
                  <span className="text-slate-850 font-bold text-red-600">{issues.filter(i => i.status !== "Resolved").length} unresolved</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-655 uppercase tracking-wider">Comments / Shift Notes</label>
                <textarea
                  placeholder="e.g., Raw material shortage has been reported. Belt tension verified on conveyor line A."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsShiftReportModalOpen(false)} className="h-10 px-4 font-bold text-slate-600 hover:bg-slate-150 text-xs rounded-xl">Cancel</Button>
                <Button type="submit" className="h-10 px-5 bg-indigo-650 hover:bg-indigo-755 text-white font-bold text-xs rounded-xl shadow-md">Submit to Manager</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. View Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-850 text-sm sm:text-base">Task Details</h3>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Task Title</p>
                <p className="text-sm font-bold text-slate-800">{selectedTask.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Assigned to</p>
                  <p className="text-xs font-bold text-slate-700">{selectedTask.assignedTo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Deadline</p>
                  <p className="text-xs font-semibold text-slate-700">{selectedTask.deadline}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Priority Level</p>
                  <Badge className="font-extrabold text-5xs px-2 py-0.5 border rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 border-slate-200">
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <Badge className="font-extrabold text-5xs px-2 py-0.5 border rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 border-slate-200">
                    {selectedTask.status}
                  </Badge>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <Button onClick={() => setSelectedTask(null)} className="h-10 px-5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md">Close view</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
