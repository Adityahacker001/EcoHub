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
  Activity,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  FileText,
  ChevronRight,
  TrendingUp,
  Zap,
  Info,
  Calendar,
  MoreVertical,
  Check,
  X,
  Eye,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type DepartmentStatus = {
  name: string;
  target: number;
  produced: number;
  status: "On Track" | "Completed" | "Delayed";
};

type ProductionOrder = {
  id: string;
  product: string;
  quantity: number;
  deadline: string;
  status: "In Progress" | "Completed" | "Pending";
};

type ProductionIssue = {
  id: string;
  text: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Resolved";
};

type AssignedDirective = {
  id: string;
  text: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status: "In Progress" | "Pending" | "Completed";
};

type ActivityLog = {
  id: string;
  text: string;
  time: string;
  type: "production" | "order" | "issue" | "report" | "system";
};

export default function ProductionManagement() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "info"; message: string } | null>(null);

  // Dynamic States
  const [productionOutput, setProductionOutput] = useState(4850);
  const productionTarget = 5000;
  
  const [completedOrders, setCompletedOrders] = useState(18);
  const [pendingOrders, setPendingOrders] = useState(4);
  const [reportedIssuesCount, setReportedIssuesCount] = useState(4);
  const [shiftEfficiency, setShiftEfficiency] = useState(97);

  // Modal States
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [isShiftReportModalOpen, setIsShiftReportModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Form Field States
  const [producedToAdd, setProducedToAdd] = useState("150");
  const [updateDepartment, setUpdateDepartment] = useState("Assembly");

  const [supervisorName, setSupervisorName] = useState("Alex Mercer");
  const [shiftNotes, setShiftNotes] = useState("");

  const [issueText, setIssueText] = useState("");
  const [issueSeverity, setIssueSeverity] = useState<"Critical" | "High" | "Medium" | "Low">("High");

  // Dynamic Data Lists
  const [departments, setDepartments] = useState<DepartmentStatus[]>([
    { name: "Assembly", target: 2000, produced: 1900, status: "On Track" },
    { name: "Packaging", target: 1500, produced: 1450, status: "On Track" },
    { name: "Quality Control", target: 1500, produced: 1500, status: "Completed" },
  ]);

  const [orders, setOrders] = useState<ProductionOrder[]>([
    { id: "ORD-101", product: "Steel Components", quantity: 500, deadline: "Today", status: "In Progress" },
    { id: "ORD-102", product: "Packaging Materials", quantity: 1000, deadline: "Today", status: "Completed" },
  ]);

  const [issues, setIssues] = useState<ProductionIssue[]>([
    { id: "ISS-01", text: "Machine downtime affecting output", severity: "Critical", status: "Open" },
    { id: "ISS-02", text: "Material shortage reported", severity: "High", status: "Open" },
    { id: "ISS-03", text: "Quality inspection delay", severity: "Medium", status: "Open" },
    { id: "ISS-04", text: "Packaging delay detected", severity: "Low", status: "Open" },
  ]);

  const [directives, setDirectives] = useState<AssignedDirective[]>([
    { id: "DIR-01", text: "Increase Production by 10%", priority: "High", dueDate: "Today", status: "In Progress" },
    { id: "DIR-02", text: "Reduce Machine Downtime", priority: "Medium", dueDate: "Tomorrow", status: "Pending" },
  ]);

  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: "ACT-01", text: "Production updated", time: "Just now", type: "production" },
    { id: "ACT-02", text: "Order ORD-102 marked completed", time: "15 mins ago", type: "order" },
    { id: "ACT-03", text: "Issue reported: Machine downtime", time: "1 hour ago", type: "issue" },
    { id: "ACT-04", text: "Shift report submitted", time: "2 hours ago", type: "report" },
    { id: "ACT-05", text: "Machine issue resolved on Line 2", time: "3 hours ago", type: "issue" },
  ]);

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
  const handleUpdateProduction = (e: React.FormEvent) => {
    e.preventDefault();
    const addUnits = parseInt(producedToAdd, 10);
    if (isNaN(addUnits) || addUnits <= 0) return;

    // Update Overall output
    const newOutput = productionOutput + addUnits;
    setProductionOutput(newOutput);

    // Update Department Specifics
    setDepartments(prevDeps =>
      prevDeps.map(dep => {
        if (dep.name === updateDepartment) {
          const newProduced = dep.produced + addUnits;
          const status = newProduced >= dep.target ? "Completed" : "On Track";
          return { ...dep, produced: newProduced, status };
        }
        return dep;
      })
    );

    addActivity(`Production updated (+${addUnits.toLocaleString()} units in ${updateDepartment})`, "production");
    setIsProductionModalOpen(false);
    showToast("success", `Updated output: +${addUnits} units for ${updateDepartment}`);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;

    const newIssue: ProductionIssue = {
      id: `ISS-${Math.floor(100 + Math.random() * 900)}`,
      text: issueText,
      severity: issueSeverity,
      status: "Open"
    };

    setIssues([newIssue, ...issues]);
    setReportedIssuesCount(prev => prev + 1);
    addActivity(`New issue reported: ${issueText}`, "issue");
    setIsIssueModalOpen(false);
    setIssueText("");
    showToast("success", "Production issue reported to Maintenance.");
  };

  const handleSubmitShiftReport = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity(`Shift report submitted by ${supervisorName}`, "report");
    setIsShiftReportModalOpen(false);
    setShiftNotes("");
    showToast("success", "Shift report submitted successfully to Manager.");
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId && order.status !== "Completed") {
          addActivity(`Order ${orderId} marked completed`, "order");
          setCompletedOrders(prev => prev + 1);
          setPendingOrders(prev => Math.max(0, prev - 1));
          showToast("success", `Order ${orderId} completed successfully!`);
          return { ...order, status: "Completed" };
        }
        return order;
      })
    );
  };

  const handleResolveIssue = (issueId: string) => {
    setIssues(prevIssues =>
      prevIssues.map(iss => {
        if (iss.id === issueId && iss.status !== "Resolved") {
          addActivity(`Issue resolved: ${iss.text}`, "issue");
          setReportedIssuesCount(prev => Math.max(0, prev - 1));
          showToast("success", `Issue resolved successfully!`);
          return { ...iss, status: "Resolved" };
        }
        return iss;
      })
    );
  };

  const handleScrollToOrders = () => {
    const section = document.getElementById("production-orders-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const targetAchievement = Math.round((productionOutput / productionTarget) * 100);

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
            Production Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Monitor and update daily production activities and shift performance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={() => setIsProductionModalOpen(true)}
            className="px-5 py-2.5 bg-white text-teal-700 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <Plus className="h-4.5 w-4.5" />
            Update Production
          </Button>
          <Button
            onClick={() => setIsShiftReportModalOpen(true)}
            className="px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FileText className="h-4.5 w-4.5" />
            Submit Shift Report
          </Button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Production"
          value={`${productionOutput.toLocaleString()} Units`}
          subtitle="Current production output"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Target Achievement"
          value={`${targetAchievement}%`}
          subtitle="Progress toward daily target"
          icon={Target}
          color="indigo"
        />
        <StatCard
          title="Completed Orders"
          value={`${completedOrders}`}
          subtitle="Orders completed today"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value={`${pendingOrders}`}
          subtitle="Orders awaiting completion"
          icon={Clock}
          color="orange"
        />
      </section>

      {/* Production Progress & Shift Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Progress Card */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Today's Production Progress</h3>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1 text-3xs">
                {targetAchievement}% Completed
              </Badge>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Output</span>
                <span className="text-xl sm:text-2xl font-black text-slate-800">
                  {productionOutput.toLocaleString()}{" "}
                  <span className="text-sm text-slate-400 font-bold">/ {productionTarget.toLocaleString()} Units</span>
                </span>
              </div>
              <Progress value={targetAchievement} className="h-4 bg-slate-100 rounded-full" />
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Daily Target</p>
                  <p className="text-base font-black text-slate-700 mt-1">{productionTarget.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Current Output</p>
                  <p className="text-base font-black text-slate-750 mt-1">{productionOutput.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <p className="text-4xs font-bold text-slate-400 uppercase tracking-wider">Target Achieved</p>
                  <p className="text-base font-black text-emerald-600 mt-1">{targetAchievement}%</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Shift Summary Card */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Today's Shift Summary</h3>
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 text-3xs">
                Morning Shift
              </Badge>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Production Output</span>
                <span className="text-slate-800 font-extrabold">{productionOutput.toLocaleString()} Units</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Target Achievement</span>
                <span className="text-slate-800 font-extrabold text-blue-600">{targetAchievement}%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Orders Completed</span>
                <span className="text-slate-800 font-extrabold text-emerald-600">{completedOrders}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Pending Orders</span>
                <span className="text-slate-800 font-extrabold text-orange-500">{pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Reported Issues</span>
                <span className="text-slate-800 font-extrabold text-red-500">{reportedIssuesCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Shift Efficiency</span>
                <span className="text-slate-800 font-extrabold text-purple-600">{shiftEfficiency}%</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Department Production & Assigned Directives */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Production Status */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Department Production Status</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="font-bold text-slate-500 text-xs py-3">Department</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-right">Target</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-right">Produced</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-right">Progress</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dep) => {
                    const percent = Math.min(100, Math.round((dep.produced / dep.target) * 100));
                    return (
                      <TableRow key={dep.name} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                        <TableCell className="font-extrabold text-slate-700 text-xs sm:text-sm py-4">{dep.name}</TableCell>
                        <TableCell className="font-bold text-slate-500 text-xs sm:text-sm py-4 text-right">{dep.target.toLocaleString()}</TableCell>
                        <TableCell className="font-extrabold text-slate-800 text-xs sm:text-sm py-4 text-right">{dep.produced.toLocaleString()}</TableCell>
                        <TableCell className="py-4 text-right min-w-[100px]">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-3xs font-bold text-slate-400">{percent}%</span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal-500 rounded-full" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <Badge
                            className={cn(
                              "font-bold px-2 py-0.5 text-4xs rounded-md uppercase tracking-wider border",
                              dep.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                                : dep.status === "On Track"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            )}
                          >
                            {dep.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Assigned Directives */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Assigned Directives</h3>
            <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold px-2 py-0.5 text-4xs">
              Directives
            </Badge>
          </div>
          <div className="space-y-4">
            {directives.map((dir) => (
              <div
                key={dir.id}
                className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/60 rounded-xl transition-all flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-750 leading-tight">
                    {dir.text}
                  </h4>
                  <Badge
                    className={cn(
                      "font-bold px-2 py-0.5 text-5xs rounded border flex-shrink-0 uppercase",
                      dir.priority === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-250"
                        : dir.priority === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-250"
                        : "bg-sky-50 text-sky-700 border-sky-200"
                    )}
                  >
                    {dir.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-4xs font-bold text-slate-400 uppercase tracking-wider pt-1 border-t border-slate-100/65">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span>Due: {dir.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-slate-500 font-bold">{dir.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Production Orders & Timeline */}
      <section id="production-orders-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Orders */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Production Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="font-bold text-slate-500 text-xs py-3">Order ID</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3">Product</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-right">Quantity</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Deadline</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Status</TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs py-3 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((ord) => (
                    <TableRow key={ord.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                      <TableCell className="font-mono font-bold text-slate-600 text-xs py-4">{ord.id}</TableCell>
                      <TableCell className="font-extrabold text-slate-700 text-xs sm:text-sm py-4">{ord.product}</TableCell>
                      <TableCell className="font-bold text-slate-800 text-xs sm:text-sm py-4 text-right">{ord.quantity.toLocaleString()} Units</TableCell>
                      <TableCell className="font-semibold text-slate-500 text-xs py-4 text-center">{ord.deadline}</TableCell>
                      <TableCell className="text-center py-4">
                        <Badge
                          className={cn(
                            "font-bold px-2 py-0.5 text-4xs rounded-md uppercase tracking-wider border",
                            ord.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                              : ord.status === "In Progress"
                              ? "bg-amber-50 text-amber-700 border-amber-250"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          )}
                        >
                          {ord.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {ord.status === "In Progress" ? (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteOrder(ord.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-4xs px-2.5 py-1 rounded-lg transition-all"
                          >
                            Complete
                          </Button>
                        ) : (
                          <span className="text-slate-400 font-bold text-3xs flex items-center justify-center gap-1">
                            <Check className="h-3 w-3 text-emerald-500" /> Done
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* Recent Production Updates (Timeline) */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Recent Production Updates</h3>
            </div>
            <div className="relative border-l-2 border-slate-100 pl-4 ml-2.5 py-1.5 space-y-5">
              {activities.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Indicator Dot */}
                  <div
                    className={cn(
                      "absolute -left-[23.5px] top-1 h-3 w-3 rounded-full border-2 border-white shadow transition-all duration-300 group-hover:scale-125",
                      act.type === "production"
                        ? "bg-blue-500"
                        : act.type === "order"
                        ? "bg-emerald-500"
                        : act.type === "issue"
                        ? "bg-red-500"
                        : act.type === "report"
                        ? "bg-purple-500"
                        : "bg-slate-400"
                    )}
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-750 leading-snug">
                      {act.text}
                    </p>
                    <span className="text-5xs font-bold text-slate-400 uppercase tracking-wider block">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Production Issues Alerts Section */}
      <section className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-850">Production Issues</h3>
            <p className="text-3xs text-slate-450 font-bold uppercase tracking-wider">Active alerts & stoppages</p>
          </div>
          <Button
            onClick={() => setIsIssueModalOpen(true)}
            className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <AlertTriangle className="h-4 w-4" />
            Report Issue
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={cn(
                "p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all relative overflow-hidden",
                issue.status === "Resolved"
                  ? "bg-slate-50 border-slate-200 text-slate-500"
                  : issue.severity === "Critical"
                  ? "bg-rose-50/70 border-rose-200 text-rose-800"
                  : issue.severity === "High"
                  ? "bg-orange-50/70 border-orange-200 text-orange-800"
                  : issue.severity === "Medium"
                  ? "bg-amber-50/70 border-amber-200 text-amber-800"
                  : "bg-sky-50/70 border-sky-200 text-sky-800"
              )}
            >
              {/* Highlight bar inside card */}
              <div 
                className={cn(
                  "absolute top-0 left-0 bottom-0 w-1.5",
                  issue.status === "Resolved"
                    ? "bg-slate-300"
                    : issue.severity === "Critical"
                    ? "bg-rose-500"
                    : issue.severity === "High"
                    ? "bg-orange-500"
                    : issue.severity === "Medium"
                    ? "bg-amber-500"
                    : "bg-sky-500"
                )}
              />
              <div className="pl-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge 
                    className={cn(
                      "font-bold text-5xs px-1.5 py-0.5 rounded border uppercase",
                      issue.status === "Resolved"
                        ? "bg-slate-100 text-slate-600 border-slate-300"
                        : issue.severity === "Critical"
                        ? "bg-rose-100 text-rose-700 border-rose-300"
                        : issue.severity === "High"
                        ? "bg-orange-100 text-orange-700 border-orange-350"
                        : issue.severity === "Medium"
                        ? "bg-amber-100 text-amber-700 border-amber-350"
                        : "bg-sky-100 text-sky-700 border-sky-300"
                    )}
                  >
                    {issue.severity}
                  </Badge>
                  <span className="text-5xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                    {issue.id}
                  </span>
                </div>
                <p className={cn(
                  "text-xs sm:text-sm font-extrabold leading-tight",
                  issue.status === "Resolved" ? "line-through text-slate-400" : ""
                )}>
                  {issue.text}
                </p>
              </div>
              <div className="pl-2 pt-2 border-t border-slate-100/50 flex items-center justify-between">
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-wider">
                  {issue.status === "Resolved" ? "RESOLVED" : "ACTIVE ALARM"}
                </span>
                {issue.status !== "Resolved" ? (
                  <button
                    onClick={() => handleResolveIssue(issue.id)}
                    className="text-4xs font-black text-slate-600 hover:text-slate-800 transition-colors uppercase tracking-wider"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <Check className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="bg-white/95 border border-slate-200/80 shadow-md rounded-2xl p-5 sm:p-6">
        <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => setIsProductionModalOpen(true)}
            className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <Activity className="h-5 w-5" />
            <span>Update Production</span>
          </Button>
          <Button
            onClick={() => setIsShiftReportModalOpen(true)}
            className="py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <FileText className="h-5 w-5" />
            <span>Submit Shift Report</span>
          </Button>
          <Button
            onClick={() => setIsIssueModalOpen(true)}
            className="py-4 bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Report Issue</span>
          </Button>
          <Button
            onClick={handleScrollToOrders}
            className="py-4 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
          >
            <Eye className="h-5 w-5" />
            <span>View Orders</span>
          </Button>
        </div>
      </section>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Update Production Modal */}
      {isProductionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Update Production Output</h3>
              <button 
                onClick={() => setIsProductionModalOpen(false)} 
                className="text-slate-450 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProduction} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Department</label>
                <select
                  value={updateDepartment}
                  onChange={(e) => setUpdateDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  <option value="Assembly">Assembly Line</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Quality Control">Quality Control</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Units Produced to Add</label>
                <input
                  type="number"
                  required
                  value={producedToAdd}
                  onChange={(e) => setProducedToAdd(e.target.value)}
                  placeholder="e.g., 150"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex items-center gap-3">
                <Info className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <p className="text-4xs font-bold text-slate-450 leading-normal">
                  Adding units updates the supervisor-specific KPI summary and notifies the manager automatically.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProductionModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Confirm Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Submit Shift Report Modal */}
      {isShiftReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Submit Daily Shift Report</h3>
              <button 
                onClick={() => setIsShiftReportModalOpen(false)} 
                className="text-slate-455 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitShiftReport} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Shift Supervisor</label>
                <input
                  type="text"
                  required
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Shift Details & Metrics</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150 text-4xs font-bold text-slate-500 leading-relaxed">
                  <div>Output: <span className="text-slate-850 font-black">{productionOutput} Units</span></div>
                  <div>Achievement: <span className="text-slate-850 font-black">{targetAchievement}%</span></div>
                  <div>Completed: <span className="text-slate-850 font-black">{completedOrders} Orders</span></div>
                  <div>Issues: <span className="text-slate-850 font-black">{reportedIssuesCount} Active</span></div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Shift Notes & Remarks</label>
                <textarea
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  placeholder="Mention handover details, machinery issues, or highlights..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-xs sm:text-sm font-semibold text-slate-750 min-h-[80px]"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsShiftReportModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white text-xs font-extrabold rounded-xl"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Report Issue Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm sm:text-base">Report Production Issue</h3>
              <button 
                onClick={() => setIsIssueModalOpen(false)} 
                className="text-slate-450 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleReportIssue} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Issue Description</label>
                <input
                  type="text"
                  required
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="e.g., Raw Material delay on Packaging line"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/25 focus:border-red-500 text-xs sm:text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Severity Level</label>
                <select
                  value={issueSeverity}
                  onChange={(e) => setIssueSeverity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/25 focus:border-red-500 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  <option value="Critical">Critical (Halts Production)</option>
                  <option value="High">High (Impacting Output Rate)</option>
                  <option value="Medium">Medium (General Fault/Delay)</option>
                  <option value="Low">Low (Minor/Observation)</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Submit Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
