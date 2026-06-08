"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/ui/stat-card";
import IntegratedLoader from "@/components/layout/IntegratedLoader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Plus,
  FileText,
  ChevronRight,
  Info,
  Calendar,
  X,
  Check,
  Eye,
  Activity,
  MessageSquare,
  FileEdit,
  ShieldAlert,
  Send,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type IssueType = 
  | "Machine Failure"
  | "Machine Maintenance"
  | "Material Shortage"
  | "Worker Absence"
  | "Quality Defect"
  | "Safety Incident"
  | "Production Delay"
  | "Equipment Breakdown"
  | "Other";

type PriorityLevel = "High" | "Medium" | "Low";
type StatusType = "Open" | "In Progress" | "Resolved" | "Escalated";

type Issue = {
  id: string;
  title: string;
  type: IssueType;
  reportedBy: string;
  department: string;
  priority: PriorityLevel;
  status: StatusType;
  reportedDate: string;
  description: string;
  affectedMachine?: string;
  resolutionNotes?: string;
  resolutionDate?: string;
  escalationReason?: string;
  escalationNotes?: string;
  evidenceAttached?: string;
};

type ActivityLog = {
  id: string;
  text: string;
  time: string;
  type: "reported" | "status" | "escalated" | "resolved" | "system";
};

type CriticalAlert = {
  id: string;
  text: string;
  icon: string;
};

export default function IncidentReportPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "info"; message: string } | null>(null);

  // Filter state for table
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // KPI Counters
  const [openCount, setOpenCount] = useState(12);
  const [resolvedTodayCount, setResolvedTodayCount] = useState(8);
  const [criticalCount, setCriticalCount] = useState(2);
  const [escalatedCount, setEscalatedCount] = useState(3);

  // Issues Data State
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "ISS-101",
      title: "CNC Machine MC-101 stopped unexpectedly",
      type: "Machine Failure",
      reportedBy: "Amit Kumar",
      department: "Production",
      priority: "High",
      status: "Open",
      reportedDate: "12 Jun 2026",
      affectedMachine: "CNC MC-101",
      description: "CNC Machine MC-101 stopped unexpectedly during morning operations due to a power surge. Spindle motor is overheating.",
      evidenceAttached: "cnc_error_log.png"
    },
    {
      id: "ISS-102",
      title: "Material shortage affecting production",
      type: "Material Shortage",
      reportedBy: "Rahul Singh",
      department: "Packaging",
      priority: "Medium",
      status: "In Progress",
      reportedDate: "12 Jun 2026",
      affectedMachine: "PK-202",
      description: "Shortage of premium packaging boxes detected at line 3. Buffer stock is completely depleted."
    },
    {
      id: "ISS-103",
      title: "Quality defect detected in Batch #105",
      type: "Quality Defect",
      reportedBy: "Harsh Gupta",
      department: "Quality Control",
      priority: "High",
      status: "Escalated",
      reportedDate: "11 Jun 2026",
      affectedMachine: "QC-Line 1",
      description: "Visual defects detected in Batch #105. Extruded parts exhibit surface cracks beyond tolerance limits.",
      escalationReason: "Technical support needed for extrusion settings",
      escalationNotes: "Quality parameters failed multiple passes. Requesting materials department inspection."
    }
  ]);

  // Timeline Activities
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: "ACT-01", text: "Issue reported: CNC Machine MC-101 stopped", time: "Just now", type: "reported" },
    { id: "ACT-02", text: "Issue status updated for ISS-102 to In Progress", time: "20 mins ago", type: "status" },
    { id: "ACT-03", text: "Issue ISS-103 escalated to Manager", time: "2 hours ago", type: "escalated" },
    { id: "ACT-04", text: "Issue ISS-099 resolved successfully", time: "4 hours ago", type: "resolved" },
    { id: "ACT-05", text: "Manager notified of high-priority quality defect", time: "5 hours ago", type: "system" }
  ]);

  // Alerts List
  const [alerts, setAlerts] = useState<CriticalAlert[]>([
    { id: "ALT-01", text: "⚠ CNC Machine MC-101 stopped unexpectedly", icon: "Machine" },
    { id: "ALT-02", text: "⚠ Material shortage affecting production", icon: "Material" },
    { id: "ALT-03", text: "⚠ Quality defect detected in Batch #105", icon: "Quality" },
    { id: "ALT-04", text: "⚠ Safety incident reported in Assembly Department", icon: "Safety" }
  ]);

  // Modal Control States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Sub-action Form Modals inside details view
  const [isResolveFormOpen, setIsResolveFormOpen] = useState(false);
  const [isEscalateFormOpen, setIsEscalateFormOpen] = useState(false);
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);

  // New Issue Fields
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<IssueType>("Machine Failure");
  const [newDept, setNewDept] = useState("Production");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("High");
  const [newDesc, setNewDesc] = useState("");
  const [newMachine, setNewMachine] = useState("");
  const [newReporter, setNewReporter] = useState("Alex Mercer");
  const [attachedFileName, setAttachedFileName] = useState("");

  // Resolve Form Fields
  const [resNotes, setResNotes] = useState("");
  const [resDate, setResDate] = useState("Today");

  // Escalate Form Fields
  const [escReason, setEscReason] = useState("Technical support needed");
  const [escNotes, setEscNotes] = useState("");

  // Update Status Fields
  const [updatedStatus, setUpdatedStatus] = useState<StatusType>("In Progress");

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
  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newIssue: Issue = {
      id: `ISS-${Math.floor(104 + Math.random() * 896)}`,
      title: newTitle,
      type: newType,
      reportedBy: newReporter,
      department: newDept,
      priority: newPriority,
      status: "Open",
      reportedDate: "12 Jun 2026",
      description: newDesc,
      affectedMachine: newMachine || undefined,
      evidenceAttached: attachedFileName || undefined
    };

    setIssues([newIssue, ...issues]);
    setOpenCount(prev => prev + 1);
    if (newPriority === "High") {
      setCriticalCount(prev => prev + 1);
      setAlerts([
        { id: `ALT-${Date.now()}`, text: `⚠ ${newTitle}`, icon: newType.split(" ")[0] },
        ...alerts
      ]);
    }

    addActivity(`Issue reported: ${newTitle}`, "reported");
    setIsReportModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewMachine("");
    setAttachedFileName("");
    showToast("success", "Issue reported successfully");
  };

  const handleResolveIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setIssues(prevIssues =>
      prevIssues.map(issue => {
        if (issue.id === selectedIssue.id) {
          const updated = {
            ...issue,
            status: "Resolved" as StatusType,
            resolutionNotes: resNotes,
            resolutionDate: resDate
          };
          // Set detail modal focus to updated object
          setSelectedIssue(updated);
          return updated;
        }
        return issue;
      })
    );

    setOpenCount(prev => Math.max(0, prev - 1));
    setResolvedTodayCount(prev => prev + 1);
    if (selectedIssue.priority === "High") {
      setCriticalCount(prev => Math.max(0, prev - 1));
      setAlerts(prev => prev.filter(a => !a.text.includes(selectedIssue.title)));
    }

    addActivity(`Issue ${selectedIssue.id} resolved`, "resolved");
    setIsResolveFormOpen(false);
    setResNotes("");
    showToast("success", "Issue resolved successfully");
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setIssues(prevIssues =>
      prevIssues.map(issue => {
        if (issue.id === selectedIssue.id) {
          const updated = {
            ...issue,
            status: "Escalated" as StatusType,
            escalationReason: escReason,
            escalationNotes: escNotes
          };
          setSelectedIssue(updated);
          return updated;
        }
        return issue;
      })
    );

    setEscalatedCount(prev => prev + 1);
    addActivity(`Issue ${selectedIssue.id} escalated: ${escReason}`, "escalated");
    setIsEscalateFormOpen(false);
    setEscNotes("");
    showToast("info", "Issue escalated to Manager. Notification sent.");
  };

  const handleStatusUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setIssues(prevIssues =>
      prevIssues.map(issue => {
        if (issue.id === selectedIssue.id) {
          const updated = { ...issue, status: updatedStatus };
          setSelectedIssue(updated);
          return updated;
        }
        return issue;
      })
    );

    addActivity(`Issue ${selectedIssue.id} status updated to ${updatedStatus}`, "status");
    setIsStatusFormOpen(false);
    showToast("success", `Status updated to ${updatedStatus}`);
  };

  const handleQuickActionResolve = () => {
    // Pick the first Open issue to resolve
    const openIssue = issues.find(i => i.status === "Open" || i.status === "In Progress");
    if (openIssue) {
      setSelectedIssue(openIssue);
      setIsResolveFormOpen(true);
    } else {
      showToast("info", "No open issues found to resolve.");
    }
  };

  const handleQuickActionEscalate = () => {
    const openIssue = issues.find(i => i.status === "Open" || i.status === "In Progress");
    if (openIssue) {
      setSelectedIssue(openIssue);
      setIsEscalateFormOpen(true);
    } else {
      showToast("info", "No open issues found to escalate.");
    }
  };

  const filteredIssues = statusFilter === "All"
    ? issues
    : issues.filter(i => i.status === statusFilter);

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
            Issues & Incident Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Track, report, resolve, and escalate operational issues during daily production activities.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={() => setIsReportModalOpen(true)}
            className="px-5 py-2.5 bg-white text-teal-700 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <Plus className="h-4.5 w-4.5" />
            Report New Issue
          </Button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Issues"
          value={`${openCount}`}
          subtitle="Issues currently awaiting resolution"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Resolved Today"
          value={`${resolvedTodayCount}`}
          subtitle="Issues successfully resolved"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Critical Issues"
          value={`${criticalCount}`}
          subtitle="High-priority incidents requiring attention"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Escalated Issues"
          value={`${escalatedCount}`}
          subtitle="Issues forwarded to management"
          icon={ArrowUpRight}
          color="purple"
        />
      </section>

      {/* Issues Table Section */}
      <section className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl overflow-hidden p-5 sm:p-6">
        <div className="pb-3 border-b border-slate-100 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-850">Issues Overview</h3>
            <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">All operational incidents & breakdowns</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-2xs font-extrabold bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-150">
                <TableHead className="font-bold text-slate-500 text-xs py-3">Issue ID</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3">Issue Type</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3">Reported By</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3">Department</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Priority</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Reported Date</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => (
                <TableRow key={issue.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                  <TableCell className="font-mono font-bold text-slate-600 text-xs py-4">{issue.id}</TableCell>
                  <TableCell className="font-extrabold text-slate-800 text-xs sm:text-sm py-4">{issue.type}</TableCell>
                  <TableCell className="font-semibold text-slate-600 text-xs py-4">{issue.reportedBy}</TableCell>
                  <TableCell className="font-semibold text-slate-500 text-xs py-4">{issue.department}</TableCell>
                  <TableCell className="text-center py-4">
                    <Badge
                      className={cn(
                        "font-bold px-2 py-0.5 text-5xs rounded border uppercase tracking-wider",
                        issue.priority === "High"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : issue.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-250"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      )}
                    >
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Badge
                      className={cn(
                        "font-bold px-2 py-0.5 text-5xs rounded border uppercase tracking-wider",
                        issue.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                          : issue.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : issue.status === "Escalated"
                          ? "bg-purple-50 text-purple-705 border-purple-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-semibold text-slate-550 text-xs py-4 text-center">{issue.reportedDate}</TableCell>
                  <TableCell className="text-center py-4">
                    <Button
                      size="sm"
                      onClick={() => setSelectedIssue(issue)}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-4xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 mx-auto"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredIssues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 font-bold text-slate-400">
                    No issues matching filters found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Critical Issues Alerts & Recent Updates Activity Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Issues Requiring Attention */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-850">Critical Issues Requiring Attention</h3>
              <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">High importance blockages</p>
            </div>
            <Badge className="bg-red-50 text-red-700 border border-red-200 font-extrabold px-2.5 py-1 text-4xs animate-pulse">
              Attention Required
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl border border-red-100 bg-red-50/40 text-red-800 flex items-start gap-3 relative overflow-hidden transition-all hover:bg-red-50/60"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500" />
                <AlertTriangle className="h-5 w-5 text-red-650 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-extrabold leading-snug">{alert.text}</p>
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Active Alarm</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Issue Activities timeline */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Recent Issue Activities</h3>
            </div>
            <div className="relative border-l-2 border-slate-100 pl-4 ml-2.5 py-1.5 space-y-5">
              {activities.map((act) => (
                <div key={act.id} className="relative group">
                  <div
                    className={cn(
                      "absolute -left-[23.5px] top-1 h-3 w-3 rounded-full border-2 border-white shadow transition-all duration-300",
                      act.type === "reported"
                        ? "bg-red-500"
                        : act.type === "status"
                        ? "bg-blue-500"
                        : act.type === "escalated"
                        ? "bg-purple-500"
                        : act.type === "resolved"
                        ? "bg-emerald-500"
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
        <h3 className="text-base font-bold text-slate-850 pb-3 border-b border-slate-100 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button
            onClick={() => setIsReportModalOpen(true)}
            className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Report New Issue</span>
          </Button>
          <Button
            onClick={() => setStatusFilter("Open")}
            className="py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <Clock className="h-5 w-5" />
            <span>View Open Issues</span>
          </Button>
          <Button
            onClick={handleQuickActionResolve}
            className="py-4 bg-emerald-705 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Submit Resolution</span>
          </Button>
          <Button
            onClick={handleQuickActionEscalate}
            className="py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <ArrowUpRight className="h-5 w-5" />
            <span>Escalate Issue</span>
          </Button>
        </div>
      </section>

      {/* Shift Summary Section */}
      <section id="shift-summary-section" className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
        <div className="pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-bold text-slate-800">Today's Issue Summary</h3>
          <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Overview of daily stoppages & resolutions</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Total Issues Reported</p>
            <p className="text-lg sm:text-xl font-black text-slate-700 mt-1">{issues.length + resolvedTodayCount}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Issues Resolved</p>
            <p className="text-lg sm:text-xl font-black text-emerald-600 mt-1">{resolvedTodayCount}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Critical Issues</p>
            <p className="text-lg sm:text-xl font-black text-red-500 mt-1">{criticalCount}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Escalated Issues</p>
            <p className="text-lg sm:text-xl font-black text-purple-650 mt-1">{escalatedCount}</p>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150 col-span-2 md:col-span-1">
            <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Avg. Resolution Time</p>
            <p className="text-lg sm:text-xl font-black text-blue-600 mt-1">45 mins</p>
          </div>
        </div>
      </section>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Report New Issue Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Report New Operational Issue</h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleReportIssueSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Issue Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Packaging belt slip Line 3"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Issue Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as IssueType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    <option value="Machine Failure">Machine Failure</option>
                    <option value="Machine Maintenance">Machine Maintenance</option>
                    <option value="Material Shortage">Material Shortage</option>
                    <option value="Worker Absence">Worker Absence</option>
                    <option value="Quality Defect">Quality Defect</option>
                    <option value="Safety Incident">Safety Incident</option>
                    <option value="Production Delay">Production Delay</option>
                    <option value="Equipment Breakdown">Equipment Breakdown</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    <option value="Production">Production</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Assembly">Assembly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Affected Machine (Optional)</label>
                  <input
                    type="text"
                    value={newMachine}
                    onChange={(e) => setNewMachine(e.target.value)}
                    placeholder="e.g., CNC-101"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Reported By</label>
                <input
                  type="text"
                  required
                  value={newReporter}
                  onChange={(e) => setNewReporter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Issue Description</label>
                <textarea
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Elaborate details of the issue..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700 min-h-[70px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Attach Image (Optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={attachedFileName}
                    onChange={(e) => setAttachedFileName(e.target.value)}
                    placeholder="mock_filename.png"
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700"
                  />
                  <Button
                    type="button"
                    onClick={() => setAttachedFileName("captured_incident_proof.png")}
                    className="px-3 py-2 bg-slate-100 border border-slate-250 text-slate-700 hover:bg-slate-200 text-3xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <Upload className="h-3.5 w-3.5" /> Attach
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-555 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Submit Issue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Issue Details Modal with Sub actions */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scaleIn flex flex-col max-h-[85vh]">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="font-black text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-teal-600" />
                Incident Case details - {selectedIssue.id}
              </h3>
              <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Issue Title</span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-tight">{selectedIssue.title}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Issue Type</span>
                  <p className="text-xs font-bold text-slate-700">{selectedIssue.type}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Department</span>
                  <p className="text-xs font-semibold text-slate-655">{selectedIssue.department}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Reported By</span>
                  <p className="text-xs font-semibold text-slate-600">{selectedIssue.reportedBy}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Reported Date</span>
                  <p className="text-xs font-semibold text-slate-650">{selectedIssue.reportedDate}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Affected Machine</span>
                  <p className="text-xs font-mono font-bold text-slate-700">{selectedIssue.affectedMachine || "None"}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Priority</span>
                  <div className="pt-0.5">
                    <Badge className="font-extrabold text-5xs px-1.5 py-0.2 rounded border uppercase tracking-wider bg-rose-50 text-rose-700 border-rose-250">
                      {selectedIssue.priority}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <div className="pt-0.5">
                    <Badge className="font-extrabold text-5xs px-1.5 py-0.2 rounded border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-250">
                      {selectedIssue.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Description</span>
                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed bg-white border border-slate-150 p-3 rounded-xl">
                  {selectedIssue.description}
                </p>
              </div>

              {selectedIssue.evidenceAttached && (
                <div className="space-y-1">
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest">Attached Evidence</span>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <AlertTriangle className="h-4.5 w-4.5 text-teal-650 flex-shrink-0" />
                    <span className="text-xs font-mono text-slate-600 truncate">{selectedIssue.evidenceAttached}</span>
                  </div>
                </div>
              )}

              {/* Display Resolution Details if resolved */}
              {selectedIssue.status === "Resolved" && (
                <div className="bg-emerald-50/60 p-4 border border-emerald-200 rounded-xl space-y-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle className="h-4.5 w-4.5" /> Resolution Logs
                  </h4>
                  <div className="space-y-1 text-xs text-slate-650">
                    <div><span className="font-bold text-emerald-800">Date:</span> {selectedIssue.resolutionDate}</div>
                    <div><span className="font-bold text-emerald-800">Notes:</span> {selectedIssue.resolutionNotes || "No notes provided."}</div>
                  </div>
                </div>
              )}

              {/* Display Escalation Details if escalated */}
              {selectedIssue.status === "Escalated" && (
                <div className="bg-purple-50 p-4 border border-purple-200 rounded-xl space-y-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-purple-800 flex items-center gap-1.5">
                    <ShieldAlert className="h-4.5 w-4.5" /> Escalated to Management
                  </h4>
                  <div className="space-y-1 text-xs text-slate-650">
                    <div><span className="font-bold text-purple-800">Reason:</span> {selectedIssue.escalationReason}</div>
                    <div><span className="font-bold text-purple-800">Notes:</span> {selectedIssue.escalationNotes || "No additional comments."}</div>
                  </div>
                </div>
              )}

              {/* Sub-action Forms Rendered in Detail Modal Context */}
              {isResolveFormOpen && (
                <form onSubmit={handleResolveIssueSubmit} className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3 mt-4">
                  <h4 className="font-extrabold text-xs text-emerald-800 uppercase tracking-wider">Confirm Resolution</h4>
                  <div className="space-y-1">
                    <label className="block text-5xs font-bold text-slate-400 uppercase tracking-widest">Resolution Notes</label>
                    <textarea
                      required
                      value={resNotes}
                      onChange={(e) => setResNotes(e.target.value)}
                      placeholder="e.g., Cleaned debris from conveyor. Re-aligned track belt."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 min-h-[60px] bg-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsResolveFormOpen(false)}
                      className="flex-1 py-1.5 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold"
                    >
                      Save Resolution
                    </Button>
                  </div>
                </form>
              )}

              {isEscalateFormOpen && (
                <form onSubmit={handleEscalateSubmit} className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-3 mt-4">
                  <h4 className="font-extrabold text-xs text-purple-800 uppercase tracking-wider">Confirm Manager Escalation</h4>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="block text-5xs font-bold text-slate-400 uppercase tracking-widest">Escalation Reason</label>
                      <select
                        value={escReason}
                        onChange={(e) => setEscReason(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white"
                      >
                        <option value="Technical support needed">Technical support needed</option>
                        <option value="Spare parts unavailable">Spare parts unavailable</option>
                        <option value="Safety hazard requiring inspection">Safety hazard requiring inspection</option>
                        <option value="Resource allocation issue">Production delay / resource shift</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-5xs font-bold text-slate-400 uppercase tracking-widest">Additional Notes</label>
                      <textarea
                        value={escNotes}
                        onChange={(e) => setEscNotes(e.target.value)}
                        placeholder="Add additional remarks for the supervisor/manager team..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 min-h-[60px] bg-white focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEscalateFormOpen(false)}
                      className="flex-1 py-1.5 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold"
                    >
                      Escalate Now
                    </Button>
                  </div>
                </form>
              )}

              {isStatusFormOpen && (
                <form onSubmit={handleStatusUpdateSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mt-4">
                  <h4 className="font-extrabold text-xs text-slate-750 uppercase tracking-wider">Update Current Status</h4>
                  <div className="space-y-1">
                    <label className="block text-5xs font-bold text-slate-400 uppercase tracking-widest">Select Status</label>
                    <select
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value as StatusType)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Escalated">Escalated</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsStatusFormOpen(false)}
                      className="flex-1 py-1.5 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold"
                    >
                      Update Status
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <div className="p-5 border-t border-slate-150 bg-slate-50/50 flex flex-wrap gap-2 justify-end flex-shrink-0">
              <Button 
                onClick={() => setSelectedIssue(null)} 
                variant="outline" 
                className="py-2 text-xs font-bold text-slate-550 flex-grow sm:flex-grow-0"
              >
                Close
              </Button>
              {selectedIssue.status !== "Resolved" && selectedIssue.status !== "Escalated" && (
                <>
                  <Button 
                    onClick={() => {
                      setIsResolveFormOpen(false);
                      setIsEscalateFormOpen(false);
                      setIsStatusFormOpen(true);
                    }} 
                    className="py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold flex-grow sm:flex-grow-0"
                  >
                    Update Status
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsStatusFormOpen(false);
                      setIsEscalateFormOpen(false);
                      setIsResolveFormOpen(true);
                    }} 
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex-grow sm:flex-grow-0"
                  >
                    Resolve Issue
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsStatusFormOpen(false);
                      setIsResolveFormOpen(false);
                      setIsEscalateFormOpen(true);
                    }} 
                    className="py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex-grow sm:flex-grow-0"
                  >
                    Escalate To Manager
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
