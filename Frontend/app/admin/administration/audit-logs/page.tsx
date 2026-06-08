'use client';
import React, { useState, useEffect } from 'react';
import IntegratedLoader from '../../../../components/layout/IntegratedLoader';
import { Filter, Download, Eye, CheckCircle, XCircle, Shield, User, LayoutDashboard, ChevronRight, Cpu, Settings, Users, FileText, Activity } from 'lucide-react';
import StatCard from "@/components/ui/stat-card";

// --- Industrial Mock Data ---
const factoryAuditLogs = [
  {
    activityId: "ACT-8429",
    timestamp: "2026-06-07 13:45:12",
    actionType: "User Login",
    user: "Robert Miller",
    role: "Manager",
    department: "Production",
    module: "Users",
    description: "Successful login from IP 192.168.1.45",
    severity: "Low",
    status: "Success",
    ipAddress: "192.168.1.45",
    device: "Chrome on Windows 11",
  },
  {
    activityId: "ACT-8428",
    timestamp: "2026-06-07 13:20:44",
    actionType: "Machine Updated",
    user: "Carlos Santana",
    role: "Supervisor",
    department: "Assembly",
    module: "Machines",
    description: "Calibrated conveyor speed settings on Assembly Line 2",
    severity: "Medium",
    status: "Success",
    ipAddress: "192.168.1.89",
    device: "Safari on macOS",
  },
  {
    activityId: "ACT-8427",
    timestamp: "2026-06-07 12:15:30",
    actionType: "Machine Failure",
    user: "System Monitor",
    role: "N/A",
    department: "Maintenance",
    module: "Machines",
    description: "Overheating detected on CNC Machine M-12",
    severity: "High",
    status: "Failed",
    ipAddress: "10.0.4.12",
    device: "Embedded Sensor Core",
  },
  {
    activityId: "ACT-8426",
    timestamp: "2026-06-07 11:40:22",
    actionType: "Production Updated",
    user: "Sarah Jenkins",
    role: "Supervisor",
    department: "Packaging",
    module: "Production",
    description: "Modified batch production plan B-204 output target",
    severity: "Medium",
    status: "Success",
    ipAddress: "192.168.2.14",
    device: "Edge on Windows 11",
  },
  {
    activityId: "ACT-8425",
    timestamp: "2026-06-07 10:55:05",
    actionType: "User Deleted",
    user: "Admin Administrator",
    role: "Admin",
    department: "Quality Control",
    module: "Users",
    description: "Deleted QC assistant profile USR-904",
    severity: "High",
    status: "Success",
    ipAddress: "192.168.1.10",
    device: "Chrome on Windows 11",
  },
  {
    activityId: "ACT-8424",
    timestamp: "2026-06-07 09:30:00",
    actionType: "Worker Assigned",
    user: "Robert Miller",
    role: "Manager",
    department: "Production",
    module: "Employees",
    description: "Assigned worker David Lee to Machine A-101",
    severity: "Low",
    status: "Success",
    ipAddress: "192.168.1.45",
    device: "Chrome on Windows 11",
  },
  {
    activityId: "ACT-8423",
    timestamp: "2026-06-07 09:15:18",
    actionType: "Machine Maintenance Scheduled",
    user: "Elena Rostova",
    role: "Maintenance Engineer",
    department: "Maintenance",
    module: "Machines",
    description: "Scheduled preventive maintenance for Hydraulic Press H-302",
    severity: "Medium",
    status: "Pending",
    ipAddress: "192.168.3.55",
    device: "Firefox on Linux",
  },
  {
    activityId: "ACT-8422",
    timestamp: "2026-06-07 08:45:00",
    actionType: "Report Generated",
    user: "John Chen",
    role: "Inspector",
    department: "Quality Control",
    module: "Reports",
    description: "Generated Quality Compliance Report for May 2026",
    severity: "Low",
    status: "Success",
    ipAddress: "192.168.1.66",
    device: "Chrome on macOS",
  },
  {
    activityId: "ACT-8421",
    timestamp: "2026-06-06 17:30:10",
    actionType: "Production Approved",
    user: "Robert Miller",
    role: "Manager",
    department: "Production",
    module: "Production",
    description: "Approved daily batch report for eco-packaging lines",
    severity: "Medium",
    status: "Success",
    ipAddress: "192.168.1.45",
    device: "Chrome on Windows 11",
  },
  {
    activityId: "ACT-8420",
    timestamp: "2026-06-06 16:10:00",
    actionType: "Settings Updated",
    user: "Admin Administrator",
    role: "Admin",
    department: "Quality Control",
    module: "Settings",
    description: "Updated temperature threshold alerts from 80C to 85C",
    severity: "Medium",
    status: "Success",
    ipAddress: "192.168.1.10",
    device: "Chrome on Windows 11",
  },
  {
    activityId: "ACT-8419",
    timestamp: "2026-06-06 14:00:25",
    actionType: "User Created",
    user: "Admin Administrator",
    role: "Admin",
    department: "Assembly",
    module: "Users",
    description: "Created assembly lead profile USR-908 for Alex Mercer",
    severity: "Medium",
    status: "Success",
    ipAddress: "192.168.1.10",
    device: "Chrome on Windows 11",
  },
  {
    activityId: "ACT-8418",
    timestamp: "2026-06-06 11:22:15",
    actionType: "Machine Added",
    user: "Robert Miller",
    role: "Manager",
    department: "Warehouse",
    module: "Machines",
    description: "Added forklift loader FL-105 to warehouse inventory",
    severity: "Low",
    status: "Success",
    ipAddress: "192.168.1.45",
    device: "Chrome on Windows 11",
  },
  {
    activityId: "ACT-8417",
    timestamp: "2026-06-06 09:05:00",
    actionType: "User Logout",
    user: "David Lee",
    role: "Operator",
    department: "Production",
    module: "Users",
    description: "Session closed by user logout",
    severity: "Low",
    status: "Success",
    ipAddress: "192.168.1.72",
    device: "Tablet / Android 13",
  }
];

// --- Main AuditLogs Component ---
export default function AuditLogs() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    // Filter states
    const [selectedAction, setSelectedAction] = useState('All');
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedDateRange, setSelectedDateRange] = useState('7days');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Menu and Modal States
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<typeof factoryAuditLogs[0] | null>(null);

    const handleExport = (format: string) => {
        console.log(`Exporting factory audit logs as ${format}...`);
        alert(`Exporting audit logs as ${format} has been initiated.`);
    };

    // Filter implementation
    const filteredLogs = factoryAuditLogs.filter(log => {
        if (selectedAction !== 'All' && log.actionType !== selectedAction) return false;
        if (selectedRole !== 'All' && log.role !== selectedRole) return false;
        if (selectedStatus !== 'All' && log.status !== selectedStatus) return false;
        if (selectedDepartment !== 'All' && log.department !== selectedDepartment) return false;

        if (selectedDateRange !== 'All') {
            const logDate = new Date(log.timestamp);
            const now = new Date('2026-06-07T13:50:54+05:30'); // system date
            const diffTime = Math.abs(now.getTime() - logDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (selectedDateRange === 'Today') {
                const isToday = logDate.getDate() === now.getDate() &&
                                logDate.getMonth() === now.getMonth() &&
                                logDate.getFullYear() === now.getFullYear();
                if (!isToday) return false;
            } else if (selectedDateRange === '7days') {
                if (diffDays > 7) return false;
            } else if (selectedDateRange === '30days') {
                if (diffDays > 30) return false;
            } else if (selectedDateRange === 'custom') {
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    if (logDate < start) return false;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    if (logDate > end) return false;
                }
            }
        }
        return true;
    });

    // KPI Cards
    const kpiCards = [
        { title: "Total Activities", value: 542, description: "All recorded system activities", icon: Eye, color: "blue" as const },
        { title: "Successful Actions", value: 498, description: "Completed actions", icon: CheckCircle, color: "green" as const },
        { title: "Failed Actions", value: 12, description: "Failed system actions", icon: XCircle, color: "red" as const },
        { title: "Login Activities", value: 184, description: "User authentication events", icon: User, color: "purple" as const },
        { title: "Production Updates", value: 245, description: "Production records modified", icon: LayoutDashboard, color: "orange" as const },
        { title: "Machine Events", value: 89, description: "Machine status updates", icon: Cpu, color: "indigo" as const },
        { title: "User Management Actions", value: 37, description: "User creation and modifications", icon: Users, color: "pink" as const },
        { title: "Reports Generated", value: 126, description: "Reports exported and downloaded", icon: FileText, color: "sky" as const },
    ];

    type StatusType = 'Success' | 'Failed' | 'Pending';
    const StatusPill = ({ status }: { status: StatusType }) => {
        const styles: Record<StatusType, string> = {
            Success: 'from-green-400 to-teal-500',
            Failed: 'from-red-500 to-rose-600',
            Pending: 'from-yellow-400 to-amber-500',
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm bg-gradient-to-r ${styles[status] || 'from-slate-400 to-slate-500'}`}>{status}</span>;
    };

    type RoleType = 'Manager' | 'Supervisor' | 'Operator' | 'Admin' | 'Maintenance Engineer' | 'Inspector' | 'N/A';
    const RolePill = ({ role }: { role: RoleType }) => {
        const styles: Record<RoleType, string> = {
            'Admin': 'text-red-700',
            'Manager': 'text-indigo-700',
            'Supervisor': 'text-blue-700',
            'Inspector': 'text-emerald-700',
            'Maintenance Engineer': 'text-amber-700',
            'Operator': 'text-sky-700',
            'N/A': 'text-slate-500',
        };
        return <span className={`font-medium ${styles[role] || 'text-slate-500'}`}>{role}</span>;
    };

    type SeverityType = 'Low' | 'Medium' | 'High';
    const SeverityBadge = ({ severity }: { severity: SeverityType }) => {
        const styles: Record<SeverityType, string> = {
            Low: 'bg-blue-100 text-blue-800 border border-blue-200',
            Medium: 'bg-amber-100 text-amber-800 border border-amber-200',
            High: 'bg-red-100 text-red-800 border border-red-200',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[severity]}`}>
                {severity}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 min-h-screen flex items-center justify-center">
                <IntegratedLoader />
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 min-h-screen relative">
            <nav className="flex items-center text-sm font-medium text-slate-500 mb-3" aria-label="Breadcrumb">
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-semibold text-indigo-600">Administration</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-semibold text-indigo-600">Audit Logs</span>
            </nav>

            {/* Enhanced Header */}
            <header className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-xl sm:rounded-2xl"></div>
                <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 flex items-center gap-4">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-2xl" />
                            <div>
                                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white drop-shadow-2xl leading-tight">
                                    Factory Audit Logs
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-bold drop-shadow-lg">
                                    Monitor user actions, machine updates, production changes, and system activities across the platform.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <select
                                value={selectedDateRange}
                                onChange={(e) => setSelectedDateRange(e.target.value)}
                                className="px-4 py-2 sm:py-3 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg sm:rounded-xl backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All Dates</option>
                                <option className="text-slate-800" value="Today">Today</option>
                                <option className="text-slate-800" value="7days">Last 7 Days</option>
                                <option className="text-slate-800" value="30days">Last 30 Days</option>
                                <option className="text-slate-800" value="custom">Custom Range</option>
                            </select>
                            <div className="relative">
                                <button
                                    onClick={() => setIsExportOpen(!isExportOpen)}
                                    className="px-4 sm:px-5 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all font-bold rounded-xl flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                                >
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="text-sm sm:text-base">Export</span>
                                </button>
                                {isExportOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20">
                                        <button 
                                            onClick={() => { handleExport('PDF'); setIsExportOpen(false); }}
                                            className="w-full px-4 py-3 text-left hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium text-sm flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4 text-indigo-500" />
                                            Export PDF
                                        </button>
                                        <button 
                                            onClick={() => { handleExport('Excel'); setIsExportOpen(false); }}
                                            className="w-full px-4 py-3 text-left hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium text-sm flex items-center gap-2"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                                            Export Excel
                                        </button>
                                        <button 
                                            onClick={() => { handleExport('CSV'); setIsExportOpen(false); }}
                                            className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium text-sm flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4 text-blue-500" />
                                            Export CSV
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Activity Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {kpiCards.map((card, idx) => (
                    <StatCard
                        key={idx}
                        title={card.title}
                        value={card.value}
                        subtitle={card.description}
                        icon={card.icon}
                        color={card.color}
                    />
                ))}
            </div>

            {/* Main Content Area with Table */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden">
                {/* Filters */}
                <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
                        <h3 className="text-lg sm:text-xl font-bold">Filter Options</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Action Type Filter */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Action Type</label>
                            <select 
                                value={selectedAction}
                                onChange={(e) => setSelectedAction(e.target.value)}
                                className="px-4 py-2 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All Actions</option>
                                <option className="text-slate-800" value="User Login">User Login</option>
                                <option className="text-slate-800" value="User Logout">User Logout</option>
                                <option className="text-slate-800" value="Machine Added">Machine Added</option>
                                <option className="text-slate-800" value="Machine Updated">Machine Updated</option>
                                <option className="text-slate-800" value="Machine Maintenance Scheduled">Machine Maintenance Scheduled</option>
                                <option className="text-slate-800" value="Production Updated">Production Updated</option>
                                <option className="text-slate-800" value="Production Approved">Production Approved</option>
                                <option className="text-slate-800" value="Worker Assigned">Worker Assigned</option>
                                <option className="text-slate-800" value="Report Generated">Report Generated</option>
                                <option className="text-slate-800" value="User Created">User Created</option>
                                <option className="text-slate-800" value="User Updated">User Updated</option>
                                <option className="text-slate-800" value="User Deleted">User Deleted</option>
                                <option className="text-slate-800" value="Settings Updated">Settings Updated</option>
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Role</label>
                            <select 
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="px-4 py-2 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All Roles</option>
                                <option className="text-slate-800" value="Admin">Admin</option>
                                <option className="text-slate-800" value="Manager">Manager</option>
                                <option className="text-slate-800" value="Supervisor">Supervisor</option>
                                <option className="text-slate-800" value="Inspector">Inspector</option>
                                <option className="text-slate-800" value="Maintenance Engineer">Maintenance Engineer</option>
                                <option className="text-slate-800" value="Operator">Operator</option>
                                <option className="text-slate-800" value="N/A">N/A</option>
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Department</label>
                            <select 
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-4 py-2 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All Departments</option>
                                <option className="text-slate-800" value="Production">Production</option>
                                <option className="text-slate-800" value="Assembly">Assembly</option>
                                <option className="text-slate-800" value="Packaging">Packaging</option>
                                <option className="text-slate-800" value="Quality Control">Quality Control</option>
                                <option className="text-slate-800" value="Maintenance">Maintenance</option>
                                <option className="text-slate-800" value="Warehouse">Warehouse</option>
                                <option className="text-slate-800" value="Dispatch">Dispatch</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Status</label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All Statuses</option>
                                <option className="text-slate-800" value="Success">Success</option>
                                <option className="text-slate-800" value="Failed">Failed</option>
                                <option className="text-slate-800" value="Pending">Pending</option>
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Date Range</label>
                            <select 
                                value={selectedDateRange}
                                onChange={(e) => setSelectedDateRange(e.target.value)}
                                className="px-4 py-2 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All Dates</option>
                                <option className="text-slate-800" value="Today">Today</option>
                                <option className="text-slate-800" value="7days">Last 7 Days</option>
                                <option className="text-slate-800" value="30days">Last 30 Days</option>
                                <option className="text-slate-800" value="custom">Custom Range</option>
                            </select>
                        </div>
                    </div>

                    {/* Custom Date Inputs */}
                    {selectedDateRange === 'custom' && (
                        <div className="flex flex-wrap gap-4 items-center mt-4 bg-white/10 p-3 rounded-lg border border-white/20 text-sm">
                            <span className="font-semibold text-emerald-100">Custom Date Range:</span>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-emerald-200">Start:</label>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    className="px-2 py-1 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-white/50 text-slate-800" 
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-emerald-200">End:</label>
                                <input 
                                    type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)} 
                                    className="px-2 py-1 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-white/50 text-slate-800" 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Audit Logs Table */}
                <div className="p-0 overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Timestamp</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Action Type</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">User</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Department</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Module</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Description</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Severity</th>
                                <th className="text-center py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Status</th>
                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-8 text-slate-500 font-medium">
                                        No matching factory activities found for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700 whitespace-nowrap">{row.timestamp}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base font-medium text-slate-800">{row.actionType}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.user}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.department}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.module}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-600 max-w-xs truncate" title={row.description}>{row.description}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6"><SeverityBadge severity={row.severity as 'Low' | 'Medium' | 'High'} /></td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center"><StatusPill status={row.status as 'Success' | 'Failed' | 'Pending'} /></td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                                            <button 
                                                onClick={() => setSelectedLog(row)}
                                                className="p-1 sm:p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-all"
                                            >
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Factory Activities Timeline */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Recent Factory Activities</h2>
                </div>
                
                <div className="relative pl-6 border-l border-slate-200 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-[14px] h-[14px] rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                            <div>
                                <p className="font-semibold text-slate-800 text-sm sm:text-base">Machine M-12 added by Manager</p>
                                <p className="text-xs sm:text-sm text-slate-500">Warehouse Department • Equipment Asset ID: M-12</p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">10 mins ago</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-[14px] h-[14px] rounded-full bg-blue-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                            <div>
                                <p className="font-semibold text-slate-800 text-sm sm:text-base">Production updated by Supervisor</p>
                                <p className="text-xs sm:text-sm text-slate-500">Production Department • Batch output calibration</p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">45 mins ago</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-[14px] h-[14px] rounded-full bg-purple-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                            <div>
                                <p className="font-semibold text-slate-800 text-sm sm:text-base">Worker assigned to Machine A-101</p>
                                <p className="text-xs sm:text-sm text-slate-500">Assembly Department • Operator assignment</p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">2 hours ago</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-[14px] h-[14px] rounded-full bg-amber-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                            <div>
                                <p className="font-semibold text-slate-800 text-sm sm:text-base">Maintenance completed for Machine B-204</p>
                                <p className="text-xs sm:text-sm text-slate-500">Maintenance Department • Scheduled service calibration</p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">4 hours ago</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-[14px] h-[14px] rounded-full bg-indigo-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                            <div>
                                <p className="font-semibold text-slate-800 text-sm sm:text-base">Monthly report generated</p>
                                <p className="text-xs sm:text-sm text-slate-500">Quality Control Department • Compliance report download</p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">1 day ago</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Activity Details</h3>
                                <p className="text-sm text-blue-100 mt-1">ID: {selectedLog.activityId}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedLog(null)} 
                                className="text-white/85 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-slate-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</span>
                                    <p className="text-sm font-medium text-slate-800 mt-1">{selectedLog.timestamp}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Action Type</span>
                                    <p className="text-sm font-medium text-slate-800 mt-1">{selectedLog.actionType}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User Name</span>
                                    <p className="text-sm font-medium text-slate-800 mt-1">{selectedLog.user}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</span>
                                    <div className="mt-1">
                                        <RolePill role={selectedLog.role as RoleType} />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</span>
                                    <p className="text-sm font-medium text-slate-800 mt-1">{selectedLog.department}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</span>
                                    <p className="text-sm font-medium text-slate-800 mt-1">{selectedLog.module}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</span>
                                    <div className="mt-1">
                                        <SeverityBadge severity={selectedLog.severity as SeverityType} />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                                    <div className="mt-1">
                                        <StatusPill status={selectedLog.status as StatusType} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-100 pt-4">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</span>
                                <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedLog.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</span>
                                    <p className="text-sm font-medium text-slate-800 mt-1">{selectedLog.ipAddress}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Device Information</span>
                                    <p className="text-sm font-medium text-slate-800 mt-1">{selectedLog.device}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

