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
import StatCard from "@/components/ui/stat-card";
import IntegratedLoader from "@/components/layout/IntegratedLoader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  FileText,
  Activity,
  Download,
  Clock,
  Settings,
  Users,
  CheckCircle,
  Calendar,
  ChevronRight,
  Eye,
  Check,
  FileSpreadsheet,
  File,
  AlertTriangle,
  X,
  ShieldAlert,
  CalendarDays,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type ReportItem = {
  id: string;
  name: string;
  category: string;
  generatedDate: string;
  format: "PDF" | "Excel" | "CSV";
  status: "Completed" | "Pending" | "Failed";
};

type ScheduledItem = {
  id: string;
  name: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  format: "PDF" | "Excel" | "CSV";
  nextRun: string;
  status: "Active" | "Paused";
};

export default function ManagerReportsCenter() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [reportType, setReportType] = useState("Production Report");
  const [department, setDepartment] = useState("All Departments");
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-07");
  const [exportFormat, setExportFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");

  // Dynamic Lists States
  const [recentReports, setRecentReports] = useState<ReportItem[]>([
    { id: "REP-401", name: "Today's Production Report", category: "Production", generatedDate: "07 Jun 2026", format: "PDF", status: "Completed" },
    { id: "REP-402", name: "Machine Utilization Report", category: "Machine", generatedDate: "06 Jun 2026", format: "Excel", status: "Completed" },
    { id: "REP-403", name: "Employee Attendance Report", category: "Employee", generatedDate: "05 Jun 2026", format: "CSV", status: "Completed" },
    { id: "REP-404", name: "Weekly Machine Maintenance", category: "Machine", generatedDate: "04 Jun 2026", format: "PDF", status: "Completed" },
    { id: "REP-405", name: "Monthly Performance Summary", category: "Performance", generatedDate: "01 Jun 2026", format: "PDF", status: "Completed" },
    { id: "REP-406", name: "Target vs Actual Report", category: "Production", generatedDate: "28 May 2026", format: "Excel", status: "Completed" },
  ]);

  const [scheduledReports, setScheduledReports] = useState<ScheduledItem[]>([
    { id: "SCH-101", name: "Monthly Production Report", frequency: "Monthly", format: "PDF", nextRun: "01 Jul 2026", status: "Active" },
    { id: "SCH-102", name: "Weekly Machine Report", frequency: "Weekly", format: "Excel", nextRun: "14 Jun 2026", status: "Active" },
    { id: "SCH-103", name: "Attendance Summary Report", frequency: "Daily", format: "CSV", nextRun: "08 Jun 2026", status: "Active" }
  ]);

  // Preview Modal state
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

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

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      showToast("error", "Please select a valid date range.");
      return;
    }

    const newReport: ReportItem = {
      id: `REP-${Math.floor(400 + Math.random() * 600)}`,
      name: `${reportType} (${department})`,
      category: reportType.replace(" Report", ""),
      generatedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      format: exportFormat,
      status: "Completed"
    };

    setRecentReports([newReport, ...recentReports]);
    showToast("success", `Generated ${newReport.name} successfully!`);
  };

  const handleDownload = (reportName: string, format: string) => {
    showToast("success", `Downloaded ${reportName}.${format.toLowerCase()} successfully!`);
  };

  const handleExportAll = () => {
    showToast("success", "Exported all reports archive successfully!");
  };

  const scrollToForm = () => {
    const element = document.getElementById("generation-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700/50 animate-slideInRight">
          <div className={cn(
            "rounded-full p-1 animate-pulse",
            toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          )}>
            {toast.type === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="space-y-1 sm:space-y-2 relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg leading-tight">
            Reports Center
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Generate, manage, export, and download operational reports.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto relative z-10">
          <Button
            onClick={scrollToForm}
            className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
          <Button
            onClick={handleExportAll}
            className="px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export All Reports
          </Button>
        </div>
      </header>

      {/* Top KPI Cards Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Reports"
          value="126"
          subtitle="All-time generated"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Generated This Month"
          value="34"
          subtitle="Current billing cycle"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Downloaded Reports"
          value="89"
          subtitle="Saved locally"
          icon={Download}
          color="green"
        />
        <StatCard
          title="Scheduled Reports"
          value="12"
          subtitle="Automated distributions"
          icon={Clock}
          color="purple"
        />
      </section>

      {/* Report Categories */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Card 1: Production Reports */}
        <Card className="bg-white/90 border border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">Production Reports</CardTitle>
                <CardDescription className="text-xs">Manufacturing & output summaries</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <ul className="space-y-2.5">
              {["Daily Production Report", "Weekly Production Report", "Monthly Production Report", "Target vs Actual Report"].map((report) => (
                <li key={report} className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 group cursor-pointer" onClick={() => { setReportType(report); scrollToForm(); }}>
                  <span className="truncate">{report}</span>
                  <ChevronRight className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card 2: Machine Reports */}
        <Card className="bg-white/90 border border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">Machine Reports</CardTitle>
                <CardDescription className="text-xs">Health, maintenance & downtime</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <ul className="space-y-2.5">
              {["Machine Utilization Report", "Maintenance Report", "Downtime Report", "Machine Health Report"].map((report) => (
                <li key={report} className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 group cursor-pointer" onClick={() => { setReportType(report); scrollToForm(); }}>
                  <span className="truncate">{report}</span>
                  <ChevronRight className="h-4.5 w-4.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card 3: Employee Reports */}
        <Card className="bg-white/90 border border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">Employee Reports</CardTitle>
                <CardDescription className="text-xs">Productivity & attendance sheets</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <ul className="space-y-2.5">
              {["Attendance Report", "Productivity Report", "Task Completion Report", "Shift Performance Report"].map((report) => (
                <li key={report} className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 group cursor-pointer" onClick={() => { setReportType(report); scrollToForm(); }}>
                  <span className="truncate">{report}</span>
                  <ChevronRight className="h-4.5 w-4.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Generate Report Section & Quick Downloads */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Form Container */}
        <Card id="generation-form" className="lg:col-span-2 bg-white/95 border border-slate-200/80 shadow-xl rounded-2xl p-5 sm:p-6">
          <div className="pb-4 border-b border-slate-150 mb-5">
            <h3 className="text-lg font-bold text-slate-800">Generate New Report</h3>
            <p className="text-xs text-slate-500">Configure inputs below to compile a custom analytical document.</p>
          </div>
          <form onSubmit={handleGenerateReport} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Report Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  <optgroup label="Production">
                    <option value="Production Report">Production Report</option>
                    <option value="Daily Production Report">Daily Production Report</option>
                    <option value="Weekly Production Report">Weekly Production Report</option>
                    <option value="Monthly Production Report">Monthly Production Report</option>
                    <option value="Target vs Actual Report">Target vs Actual Report</option>
                  </optgroup>
                  <optgroup label="Machine">
                    <option value="Machine Report">Machine Report</option>
                    <option value="Machine Utilization Report">Machine Utilization Report</option>
                    <option value="Maintenance Report">Maintenance Report</option>
                    <option value="Downtime Report">Downtime Report</option>
                    <option value="Machine Health Report">Machine Health Report</option>
                  </optgroup>
                  <optgroup label="Employee">
                    <option value="Employee Report">Employee Report</option>
                    <option value="Attendance Report">Attendance Report</option>
                    <option value="Productivity Report">Productivity Report</option>
                    <option value="Task Completion Report">Task Completion Report</option>
                    <option value="Shift Performance Report">Shift Performance Report</option>
                  </optgroup>
                  <optgroup label="Performance">
                    <option value="Performance Report">Performance Report</option>
                    <option value="Performance Summary Report">Performance Summary Report</option>
                  </optgroup>
                </select>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Department Scope</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Assembly Line A">Assembly Line A</option>
                  <option value="Packaging & Dispatch">Packaging & Dispatch</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Warehouse & Inventory">Warehouse & Inventory</option>
                  <option value="Maintenance Division">Maintenance Division</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Date Period</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-sm font-semibold text-slate-700 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Export Format</label>
              <div className="grid grid-cols-3 gap-3">
                {(["PDF", "Excel", "CSV"] as const).map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setExportFormat(format)}
                    className={cn(
                      "py-3 border rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                      exportFormat === format
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10 scale-105"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                    )}
                  >
                    {format === "PDF" && <FileText className="h-4.5 w-4.5" />}
                    {format === "Excel" && <FileSpreadsheet className="h-4.5 w-4.5" />}
                    {format === "CSV" && <File className="h-4.5 w-4.5" />}
                    <span>{format}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-650 text-white hover:from-blue-700 hover:to-indigo-750 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01]"
            >
              <Activity className="h-4.5 w-4.5 mr-2 animate-pulse" />
              Generate Report Now
            </Button>
          </form>
        </Card>

        {/* Quick Downloads */}
        <Card className="bg-white/95 border border-slate-200/80 shadow-xl rounded-2xl p-5 sm:p-6 flex flex-col h-full justify-between">
          <div>
            <div className="pb-3 border-b border-slate-150 mb-4">
              <h3 className="text-md font-bold text-slate-800">Quick Downloads</h3>
              <p className="text-xs text-slate-500">Instantly grab pre-generated active reports.</p>
            </div>
            <div className="space-y-3">
              {[
                { name: "Today's Production Report", icon: Activity, format: "PDF", color: "indigo" },
                { name: "Machine Maintenance Report", icon: Settings, format: "Excel", color: "blue" },
                { name: "Employee Attendance Report", icon: Users, format: "CSV", color: "emerald" },
                { name: "Performance Summary Report", icon: FileText, format: "PDF", color: "indigo" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-150 rounded-xl transition-all group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn(
                        "p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-600 group-hover:scale-105 transition-transform",
                        item.color === "indigo" && "text-indigo-500",
                        item.color === "blue" && "text-blue-500",
                        item.color === "emerald" && "text-emerald-500"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-750 truncate">{item.name}</p>
                        <p className="text-4xs text-slate-400 font-semibold uppercase">{item.format} Format</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(item.name, item.format)}
                      className="h-7 w-7 p-0 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 text-slate-500 rounded-lg shadow-sm hover:border-indigo-600 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-150 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <p className="text-4xs text-slate-400 font-semibold leading-normal">
              Reports compile data from authenticated local sensors & logs. Download logs for certified validation.
            </p>
          </div>
        </Card>
      </section>

      {/* Recent Reports Table */}
      <section className="bg-white/95 border border-slate-200/80 shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-md sm:text-lg font-bold text-slate-800">Recent Reports History</h3>
            <p className="text-xs text-slate-500">Track and review generated report activity.</p>
          </div>
          <Badge className="bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 px-3 py-1 font-bold text-2xs uppercase">
            6 Reports Stored
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3.5 pl-6">Report Name</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3.5">Category</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3.5">Generated Date</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3.5">Format</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3.5">Status</TableHead>
                <TableHead className="font-bold text-slate-600 text-2xs uppercase tracking-wider py-3.5 pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0">
                  <TableCell className="font-semibold text-slate-800 text-xs py-3.5 pl-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>{report.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs font-semibold py-3.5">{report.category}</TableCell>
                  <TableCell className="text-slate-500 text-xs font-medium py-3.5">{report.generatedDate}</TableCell>
                  <TableCell className="py-3.5">
                    <Badge className={cn(
                      "font-extrabold text-3xs px-2.5 py-0.5 border rounded-full",
                      report.format === "PDF" && "bg-red-50 text-red-700 border-red-100",
                      report.format === "Excel" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                      report.format === "CSV" && "bg-slate-50 text-slate-700 border-slate-200"
                    )}>
                      {report.format}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <CheckCircle className="h-3.5 w-3.5 fill-emerald-100" />
                      <span>{report.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPreviewReport(report)}
                        className="h-8 px-2.5 text-indigo-650 hover:bg-indigo-50 font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(report.name, report.format)}
                        className="h-8 px-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Scheduled Reports */}
      <section className="bg-white/95 border border-slate-200/80 shadow-xl rounded-2xl p-5 sm:p-6">
        <div className="pb-3 border-b border-slate-150 mb-5">
          <h3 className="text-md sm:text-lg font-bold text-slate-800">Scheduled Report Subscriptions</h3>
          <p className="text-xs text-slate-500">Automated reports compiled and sent to your email periodically.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {scheduledReports.map((sch) => (
            <div key={sch.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-2xl transition-all relative flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-indigo-50 border-indigo-150 text-indigo-700 px-2 py-0.5 text-3xs font-extrabold uppercase">
                    {sch.frequency}
                  </Badge>
                  <Badge className="bg-white text-slate-600 border-slate-200 font-bold text-3xs">
                    {sch.format}
                  </Badge>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-850 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">
                  {sch.name}
                </h4>
                <div className="flex items-center gap-1 text-4xs text-slate-400 font-bold uppercase tracking-wider mb-3">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Next Run: {sch.nextRun}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                    {sch.status}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => showToast("success", `Subscription to ${sch.name} has been paused.`)}
                  className="h-6 px-2 text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold text-3xs rounded-md"
                >
                  Pause
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Document Preview Dialog (Modal) */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-150 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-650" />
                <h3 className="font-black text-slate-850 text-sm sm:text-base">{previewReport.name}</h3>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="h-8 w-8 text-slate-400 hover:text-slate-650 hover:bg-slate-150 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-150 rounded-xl text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-3xs">Report Identifier</p>
                  <p className="text-slate-700 font-semibold mt-0.5">{previewReport.id}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-3xs">Report Category</p>
                  <p className="text-slate-700 font-semibold mt-0.5">{previewReport.category}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-3xs">Compilation Date</p>
                  <p className="text-slate-700 font-semibold mt-0.5">{previewReport.generatedDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-3xs">Document Format</p>
                  <p className="text-slate-700 font-semibold mt-0.5">{previewReport.format}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">Compiled Meta-Data Preview</h4>
                <div className="space-y-1.5 text-2xs leading-relaxed text-slate-600 font-medium bg-slate-50/50 p-3.5 border border-slate-150 rounded-xl">
                  <p>• Department: Quality Assurance / Production Line</p>
                  <p>• Total Data Records Scanned: 4,120 rows</p>
                  <p>• Integrity Score: 100% (Block-chain verified signatures)</p>
                  <p>• Generated By: Rahul Singh (Factory Manager ID: EMP-1001)</p>
                  <p>• Status: OK (No critical thresholds exceeded)</p>
                </div>
              </div>

              <div className="border border-amber-200/80 bg-amber-50/40 p-4 rounded-xl flex gap-3 text-2xs text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong>Notice:</strong> This is a compiled meta-data verification view. Click download below to save the full document containing granular data spreadsheets, audit logs, and signatures.
                </p>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-150 px-5 py-3.5 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setPreviewReport(null)}
                className="h-10 px-4 font-bold text-slate-600 hover:bg-slate-150 text-xs rounded-xl"
              >
                Close View
              </Button>
              <Button
                onClick={() => {
                  handleDownload(previewReport.name, previewReport.format);
                  setPreviewReport(null);
                }}
                className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download Full {previewReport.format}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
