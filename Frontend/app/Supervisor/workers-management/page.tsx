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
  Users,
  UserCheck,
  UserX,
  Clock,
  ClipboardList,
  CheckSquare,
  Plus,
  Check,
  X,
  AlertTriangle,
  Eye,
  Calendar,
  AlertCircle,
  FileText,
  ChevronRight,
  UserCog,
  MessageSquare,
  TrendingUp,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type Worker = {
  id: string;
  name: string;
  department: string;
  shift: string;
  attendance: "Present" | "Absent";
  currentTask: string;
  status: "Working" | "Idle" | "Absent";
  // Details Modal Fields
  attendancePercentage: number;
  completedTasksCount: number;
  joiningDate: string;
  remarks: string;
  // Summary Details
  presentDays: number;
  absentDays: number;
  leaveDays: number;
};

type ActiveTask = {
  id: string;
  name: string;
  assignedWorker: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  status: "In Progress" | "Completed" | "Pending";
};

type WorkerAttentionAlert = {
  id: string;
  workerName: string;
  reason: string;
  severity: "Critical" | "High" | "Medium" | "Low";
};

type ActivityLog = {
  id: string;
  text: string;
  time: string;
  type: "task" | "attendance" | "checkin" | "complete" | "issue" | "update";
};

export default function WorkersManagement() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "info"; message: string } | null>(null);

  // Stats Counters
  const [totalWorkers, setTotalWorkers] = useState(28);
  const [presentCount, setPresentCount] = useState(24);
  const [absentCount, setAbsentCount] = useState(4);
  const [tasksCompleted, setTasksCompleted] = useState(45);
  const [pendingTasksCount, setPendingTasksCount] = useState(3);
  const [shiftEfficiency, setShiftEfficiency] = useState(94);

  // List States
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "EMP-201",
      name: "Amit Kumar",
      department: "Assembly",
      shift: "Morning Shift",
      attendance: "Present",
      currentTask: "Machine Inspection",
      status: "Working",
      attendancePercentage: 92,
      completedTasksCount: 38,
      joiningDate: "12 May 2024",
      remarks: "Highly reliable. Follows safety protocols meticulously.",
      presentDays: 24,
      absentDays: 2,
      leaveDays: 0
    },
    {
      id: "EMP-202",
      name: "Rahul Singh",
      department: "Packaging",
      shift: "Morning Shift",
      attendance: "Present",
      currentTask: "Packaging Review",
      status: "Working",
      attendancePercentage: 95,
      completedTasksCount: 42,
      joiningDate: "18 Aug 2024",
      remarks: "Great efficiency, packaging output above shift standard.",
      presentDays: 25,
      absentDays: 1,
      leaveDays: 0
    },
    {
      id: "EMP-203",
      name: "Rohan Sharma",
      department: "Assembly",
      shift: "Morning Shift",
      attendance: "Absent",
      currentTask: "No Task Assigned",
      status: "Absent",
      attendancePercentage: 74,
      completedTasksCount: 22,
      joiningDate: "05 Jan 2025",
      remarks: "Needs monitoring on attendance frequency.",
      presentDays: 18,
      absentDays: 6,
      leaveDays: 2
    },
    {
      id: "EMP-204",
      name: "Sunil Verma",
      department: "Quality Control",
      shift: "Morning Shift",
      attendance: "Present",
      currentTask: "Inspect Batch B-12",
      status: "Working",
      attendancePercentage: 88,
      completedTasksCount: 31,
      joiningDate: "22 Oct 2024",
      remarks: "Accurate inspection logs. Detail-oriented worker.",
      presentDays: 23,
      absentDays: 3,
      leaveDays: 0
    }
  ]);

  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([
    { id: "TSK-301", name: "Machine Inspection", assignedWorker: "Amit Kumar", priority: "High", deadline: "Today", status: "In Progress" },
    { id: "TSK-302", name: "Packaging Review", assignedWorker: "Rahul Singh", priority: "Medium", deadline: "Today", status: "Completed" },
    { id: "TSK-303", name: "Inspect Batch B-12", assignedWorker: "Sunil Verma", priority: "High", deadline: "Today", status: "In Progress" }
  ]);

  const [alerts, setAlerts] = useState<WorkerAttentionAlert[]>([
    { id: "ALT-01", workerName: "Rohan Sharma", reason: "Attendance below 80%", severity: "High" },
    { id: "ALT-02", workerName: "Sunil Verma", reason: "Task overdue by 2 hours", severity: "Medium" },
    { id: "ALT-03", workerName: "Rohan Sharma", reason: "Worker absent for 3 consecutive days", severity: "Critical" },
    { id: "ALT-04", workerName: "Amit Kumar", reason: "Performance issue reported on Line 2", severity: "Low" }
  ]);

  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: "ACT-01", text: "Task 'Machine Inspection' assigned to Amit Kumar", time: "10 mins ago", type: "task" },
    { id: "ACT-02", text: "Attendance marked for Morning Shift", time: "1 hour ago", type: "attendance" },
    { id: "ACT-03", text: "Worker Amit Kumar checked in", time: "2 hours ago", type: "checkin" },
    { id: "ACT-04", text: "Task 'Packaging Review' marked completed", time: "3 hours ago", type: "complete" },
    { id: "ACT-05", text: "Worker Rohan Sharma absent issue reported", time: "4 hours ago", type: "issue" },
    { id: "ACT-06", text: "Shift assignment updated for Assembly Line 1", time: "5 hours ago", type: "update" }
  ]);

  // Modal States
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isMarkAttendanceModalOpen, setIsMarkAttendanceModalOpen] = useState(false);
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);

  // Form Fields State
  const [taskWorker, setTaskWorker] = useState("Amit Kumar");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [taskDeadline, setTaskDeadline] = useState("Today");
  const [taskDescription, setTaskDescription] = useState("");

  const [issueWorkerName, setIssueWorkerName] = useState("Rohan Sharma");
  const [issueReason, setIssueReason] = useState("Attendance below 80%");
  const [issueSeverity, setIssueSeverity] = useState<"Critical" | "High" | "Medium" | "Low">("High");

  // Editable Remarks in Details Modal
  const [currentRemarks, setCurrentRemarks] = useState("");

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

  const showToast = (type: "success" | "info", message: string) => {
    setToast({ type, message });
  };

  const addActivity = (text: string, type: ActivityLog["type"]) => {
    const newAct: ActivityLog = {
      id: `ACT-${Date.now()}`,
      text,
      time: "Just now",
      type
    };
    setActivities([newAct, ...activities]);
  };

  // Actions
  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    // Create New Task
    const newTask: ActiveTask = {
      id: `TSK-${Math.floor(300 + Math.random() * 600)}`,
      name: taskTitle,
      assignedWorker: taskWorker,
      priority: taskPriority,
      deadline: taskDeadline,
      status: "In Progress"
    };

    setActiveTasks([newTask, ...activeTasks]);
    setPendingTasksCount(prev => prev + 1);

    // Update Worker current task
    setWorkers(prevWorkers =>
      prevWorkers.map(w => {
        if (w.name === taskWorker) {
          return { ...w, currentTask: taskTitle, status: "Working" };
        }
        return w;
      })
    );

    addActivity(`Task '${taskTitle}' assigned to ${taskWorker}`, "task");
    setIsAssignTaskModalOpen(false);
    setTaskTitle("");
    setTaskDescription("");
    showToast("success", "Task assigned successfully");
  };

  const handleMarkAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate updating shift attendance to full attendance
    setPresentCount(workers.length);
    setAbsentCount(0);
    setWorkers(prev => 
      prev.map(w => ({ ...w, attendance: "Present", status: w.status === "Absent" ? "Idle" : w.status }))
    );
    addActivity("Attendance marked for all scheduled workers", "attendance");
    setIsMarkAttendanceModalOpen(false);
    showToast("success", "Attendance marked successfully");
  };

  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAlert: WorkerAttentionAlert = {
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      workerName: issueWorkerName,
      reason: issueReason,
      severity: issueSeverity
    };

    setAlerts([newAlert, ...alerts]);
    addActivity(`Worker issue reported for ${issueWorkerName}: ${issueReason}`, "issue");
    setIsReportIssueModalOpen(false);
    showToast("success", `Issue reported for ${issueWorkerName}`);
  };

  const handleCompleteTask = (taskId: string) => {
    setActiveTasks(prev =>
      prev.map(t => {
        if (t.id === taskId && t.status !== "Completed") {
          addActivity(`Task '${t.name}' completed`, "complete");
          setTasksCompleted(prev => prev + 1);
          setPendingTasksCount(prev => Math.max(0, prev - 1));
          showToast("success", `Task '${t.name}' marked completed`);

          // Update corresponding worker status
          setWorkers(prevWorkers =>
            prevWorkers.map(w => {
              if (w.name === t.assignedWorker) {
                return { 
                  ...w, 
                  currentTask: "No Task Assigned", 
                  status: "Idle",
                  completedTasksCount: w.completedTasksCount + 1
                };
              }
              return w;
            })
          );

          return { ...t, status: "Completed" };
        }
        return t;
      })
    );
  };

  const handleOpenDetails = (worker: Worker) => {
    setSelectedWorker(worker);
    setCurrentRemarks(worker.remarks);
  };

  const handleSaveRemarks = () => {
    if (!selectedWorker) return;
    
    setWorkers(prev =>
      prev.map(w => (w.id === selectedWorker.id ? { ...w, remarks: currentRemarks } : w))
    );
    
    setSelectedWorker(prev => prev ? { ...prev, remarks: currentRemarks } : null);
    addActivity(`Remarks updated for ${selectedWorker.name}`, "update");
    showToast("success", "Supervisor remarks saved.");
  };

  const handleScrollToSummary = () => {
    const summaryCard = document.getElementById("shift-summary-section");
    if (summaryCard) {
      summaryCard.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            Workers Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Monitor workers, assign tasks, track attendance, and manage daily workforce activities.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={() => setIsAssignTaskModalOpen(true)}
            className="px-5 py-2.5 bg-white text-teal-700 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <Plus className="h-4.5 w-4.5" />
            Assign Task
          </Button>
          <Button
            onClick={() => setIsMarkAttendanceModalOpen(true)}
            className="px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <UserCheck className="h-4.5 w-4.5" />
            Mark Attendance
          </Button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workers"
          value={`${totalWorkers}`}
          subtitle="Workers assigned to current department"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Present Today"
          value={`${presentCount}`}
          subtitle="Workers currently present"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Absent"
          value={`${absentCount}`}
          subtitle="Workers absent today"
          icon={UserX}
          color="red"
        />
        <StatCard
          title="Tasks Completed"
          value={`${tasksCompleted}`}
          subtitle="Tasks completed during current shift"
          icon={CheckSquare}
          color="indigo"
        />
      </section>

      {/* Workers Overview Table */}
      <section className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl overflow-hidden p-5 sm:p-6">
        <div className="pb-3 border-b border-slate-100 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-850">Workers Overview</h3>
            <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Daily activity and status log</p>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-4xs">
            {presentCount} Present today
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-150">
                <TableHead className="font-bold text-slate-500 text-xs py-3">Worker ID</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3">Worker Name</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3">Department</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Shift</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Attendance</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3">Current Task</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                  <TableCell className="font-mono font-bold text-slate-600 text-xs py-4">{worker.id}</TableCell>
                  <TableCell className="font-extrabold text-slate-800 text-xs sm:text-sm py-4">{worker.name}</TableCell>
                  <TableCell className="font-semibold text-slate-500 text-xs py-4">{worker.department}</TableCell>
                  <TableCell className="font-semibold text-slate-500 text-xs py-4 text-center">{worker.shift}</TableCell>
                  <TableCell className="text-center py-4">
                    <Badge
                      className={cn(
                        "font-bold px-2 py-0.5 text-4xs rounded border uppercase tracking-wider",
                        worker.attendance === "Present"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                          : "bg-rose-50 text-rose-700 border-rose-250"
                      )}
                    >
                      {worker.attendance}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 text-xs py-4 max-w-[150px] truncate">
                    {worker.currentTask}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Badge
                      className={cn(
                        "font-bold px-2 py-0.5 text-4xs rounded border uppercase tracking-wider",
                        worker.status === "Working"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : worker.status === "Idle"
                          ? "bg-amber-50 text-amber-700 border-amber-250"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      )}
                    >
                      {worker.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Button
                      size="sm"
                      onClick={() => handleOpenDetails(worker)}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-4xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 mx-auto"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Attendance Summary & Active Tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Attendance Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="font-bold text-slate-500 text-xs py-3">Worker Name</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Present Days</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Absent Days</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Leave Days</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-right">Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((w) => (
                    <TableRow key={w.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                      <TableCell className="font-extrabold text-slate-700 text-xs sm:text-sm py-3.5">{w.name}</TableCell>
                      <TableCell className="font-bold text-slate-600 text-xs py-3.5 text-center">{w.presentDays}d</TableCell>
                      <TableCell className="font-bold text-slate-600 text-xs py-3.5 text-center text-red-500">{w.absentDays}d</TableCell>
                      <TableCell className="font-bold text-slate-600 text-xs py-3.5 text-center text-purple-500">{w.leaveDays}d</TableCell>
                      <TableCell className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={cn(
                            "text-3xs font-extrabold",
                            w.attendancePercentage >= 90
                              ? "text-emerald-600"
                              : w.attendancePercentage >= 80
                              ? "text-blue-600"
                              : "text-rose-600"
                          )}>
                            {w.attendancePercentage}%
                          </span>
                          <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                w.attendancePercentage >= 90
                                  ? "bg-emerald-500"
                                  : w.attendancePercentage >= 80
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                              )} 
                              style={{ width: `${w.attendancePercentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Active Tasks list */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Active Tasks</h3>
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-extrabold px-2 py-0.5 text-4xs">
                {pendingTasksCount} Pending
              </Badge>
            </div>
            <div className="space-y-4">
              {activeTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl hover:bg-slate-50 transition-all space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-750 leading-tight">{t.name}</h4>
                      <p className="text-5xs font-bold text-slate-400">Assigned: {t.assignedWorker}</p>
                    </div>
                    <Badge 
                      className={cn(
                        "font-bold text-5xs px-1.5 py-0.2 rounded border flex-shrink-0 uppercase",
                        t.priority === "High"
                          ? "bg-rose-50 text-rose-700 border-rose-250"
                          : t.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-250"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      )}
                    >
                      {t.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-4xs font-bold pt-1.5 border-t border-slate-100">
                    <span className="text-slate-400">Deadline: {t.deadline}</span>
                    {t.status === "In Progress" ? (
                      <button
                        onClick={() => handleCompleteTask(t.id)}
                        className="text-emerald-600 hover:text-emerald-700 font-black transition-colors uppercase"
                      >
                        Complete Task
                      </button>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-0.5 font-black uppercase">
                        <Check className="h-3 w-3" /> Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Workers Requiring Attention & Recent Activities */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workers Requiring Attention */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Workers Requiring Attention</h3>
              <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Urgent alerts, delays, and absences</p>
            </div>
            <Badge className="bg-red-50 text-red-700 border border-red-200 font-extrabold px-2.5 py-1 text-4xs animate-pulse">
              Alert
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all relative overflow-hidden",
                  alert.severity === "Critical"
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : alert.severity === "High"
                    ? "bg-orange-50 border-orange-200 text-orange-800"
                    : alert.severity === "Medium"
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-sky-50 border-sky-200 text-sky-850"
                )}
              >
                <div 
                  className={cn(
                    "absolute top-0 left-0 bottom-0 w-1",
                    alert.severity === "Critical"
                      ? "bg-rose-500"
                      : alert.severity === "High"
                      ? "bg-orange-500"
                      : alert.severity === "Medium"
                      ? "bg-amber-500"
                      : "bg-sky-500"
                  )}
                />
                <div className="pl-1.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={cn(
                        "font-extrabold text-5xs px-1 py-0.2 rounded border uppercase",
                        alert.severity === "Critical"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : alert.severity === "High"
                          ? "bg-orange-100 text-orange-850 border-orange-300"
                          : alert.severity === "Medium"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-sky-100 text-sky-850 border-sky-300"
                      )}
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-5xs font-bold text-slate-400">{alert.id}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold leading-tight text-slate-750">{alert.workerName}</h4>
                  <p className="text-4xs font-bold text-slate-500 uppercase tracking-wide leading-normal">{alert.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent workforce activities timeline */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Recent Workforce Activities</h3>
            </div>
            <div className="relative border-l-2 border-slate-100 pl-4 ml-2.5 py-1 space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="relative group">
                  <div
                    className={cn(
                      "absolute -left-[23.5px] top-1 h-3 w-3 rounded-full border-2 border-white shadow transition-all",
                      act.type === "task"
                        ? "bg-blue-500"
                        : act.type === "attendance"
                        ? "bg-emerald-500"
                        : act.type === "checkin"
                        ? "bg-indigo-500"
                        : act.type === "complete"
                        ? "bg-emerald-600"
                        : act.type === "issue"
                        ? "bg-rose-500"
                        : "bg-slate-400"
                    )}
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-750 leading-snug">{act.text}</p>
                    <span className="text-5xs font-bold text-slate-400 uppercase tracking-wider block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Quick Actions Panel */}
      <section className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
        <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => setIsAssignTaskModalOpen(true)}
            className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <CheckSquare className="h-5 w-5" />
            <span>Assign Task</span>
          </Button>
          <Button
            onClick={() => setIsMarkAttendanceModalOpen(true)}
            className="py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <UserCheck className="h-5 w-5" />
            <span>Mark Attendance</span>
          </Button>
          <Button
            onClick={handleScrollToSummary}
            className="py-4 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <Activity className="h-5 w-5" />
            <span>View Shift Summary</span>
          </Button>
          <Button
            onClick={() => setIsReportIssueModalOpen(true)}
            className="py-4 bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Report Worker Issue</span>
          </Button>
        </div>
      </section>

      {/* Current Shift Summary */}
      <section id="shift-summary-section" className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
        <div className="pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-bold text-slate-800">Current Shift Summary</h3>
          <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Metrics gathered from daily operations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Total Workers</p>
            <p className="text-lg sm:text-xl font-black text-slate-700 mt-1">{totalWorkers}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Present Workers</p>
            <p className="text-lg sm:text-xl font-black text-emerald-600 mt-1">{presentCount}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Absent Workers</p>
            <p className="text-lg sm:text-xl font-black text-red-500 mt-1">{absentCount}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Tasks Completed</p>
            <p className="text-lg sm:text-xl font-black text-blue-600 mt-1">{tasksCompleted}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Pending Tasks</p>
            <p className="text-lg sm:text-xl font-black text-amber-500 mt-1">{pendingTasksCount}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Shift Efficiency</p>
            <p className="text-lg sm:text-xl font-black text-purple-600 mt-1">{shiftEfficiency}%</p>
          </div>
        </div>
      </section>

      {/* --- MODALS --- */}

      {/* 1. Worker Details Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Worker Details Profile</h3>
              <button 
                onClick={() => setSelectedWorker(null)} 
                className="text-slate-450 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Worker ID</span>
                  <p className="text-xs font-mono font-bold text-slate-650">{selectedWorker.id}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Full Name</span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800">{selectedWorker.name}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Department</span>
                  <p className="text-xs font-bold text-slate-650">{selectedWorker.department}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Shift</span>
                  <p className="text-xs font-bold text-slate-650">{selectedWorker.shift}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Attendance %</span>
                  <p className="text-xs sm:text-sm font-extrabold text-emerald-600">{selectedWorker.attendancePercentage}%</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Current Task</span>
                  <p className="text-xs font-bold text-slate-800 truncate">{selectedWorker.currentTask}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Completed Tasks</span>
                  <p className="text-xs font-bold text-slate-800">{selectedWorker.completedTasksCount}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Joining Date</span>
                  <p className="text-xs font-bold text-slate-650">{selectedWorker.joiningDate}</p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                  <div className="pt-0.5">
                    <Badge
                      className={cn(
                        "font-bold px-2 py-0.5 text-5xs rounded border uppercase tracking-wider",
                        selectedWorker.status === "Working"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : selectedWorker.status === "Idle"
                          ? "bg-amber-50 text-amber-700 border-amber-250"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      )}
                    >
                      {selectedWorker.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Editable remarks */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Supervisor Remarks</label>
                <textarea
                  value={currentRemarks}
                  onChange={(e) => setCurrentRemarks(e.target.value)}
                  placeholder="Update worker notes, observation, warnings or details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs font-medium text-slate-700 min-h-[60px]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => setSelectedWorker(null)}
                  variant="outline"
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Close
                </Button>
                <Button
                  onClick={handleSaveRemarks}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Save Remarks
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Assign Task Modal */}
      {isAssignTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Assign Workforce Task</h3>
              <button 
                onClick={() => setIsAssignTaskModalOpen(false)} 
                className="text-slate-450 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAssignTaskSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Select Worker</label>
                <select
                  value={taskWorker}
                  onChange={(e) => setTaskWorker(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  {workers.filter(w => w.attendance === "Present").map(w => (
                    <option key={w.id} value={w.name}>{w.name} ({w.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Clean packaging belt 3"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Deadline</label>
                <input
                  type="text"
                  required
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  placeholder="e.g., Today / In 2 hours"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Instructions for the task assignment..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700 min-h-[70px]"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAssignTaskModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Assign Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Mark Attendance Modal */}
      {isMarkAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Mark Morning Shift Attendance</h3>
              <button 
                onClick={() => setIsMarkAttendanceModalOpen(false)} 
                className="text-slate-450 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleMarkAttendanceSubmit} className="p-5 space-y-4">
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Confirming attendance will mark all scheduled workers as present for today's shift. To record an individual absence or leave, update the worker's status directly from the worker table actions.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 leading-relaxed font-bold text-4xs text-slate-500 space-y-1">
                <div>Scheduled Personnel: <span className="text-slate-850 font-black">{totalWorkers}</span></div>
                <div>Currently Marked Present: <span className="text-slate-850 font-black">{presentCount}</span></div>
                <div>Currently Marked Absent: <span className="text-slate-850 font-black">{absentCount}</span></div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMarkAttendanceModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Mark All Present
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Report Worker Issue Modal */}
      {isReportIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Report Worker Attention Alert</h3>
              <button 
                onClick={() => setIsReportIssueModalOpen(false)} 
                className="text-slate-450 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleReportIssueSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Select Worker</label>
                <select
                  value={issueWorkerName}
                  onChange={(e) => setIssueWorkerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.name}>{w.name} ({w.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Reason / Alert Type</label>
                <select
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  <option value="Attendance below 80%">Attendance below 80%</option>
                  <option value="Task overdue by 2+ hours">Task overdue</option>
                  <option value="Worker absent for 3 consecutive days">Worker absent for 3 consecutive days</option>
                  <option value="Performance issue reported">Performance issue reported</option>
                  <option value="Safety violation observed">Safety violation observed</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Severity Level</label>
                <select
                  value={issueSeverity}
                  onChange={(e) => setIssueSeverity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReportIssueModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Report Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
