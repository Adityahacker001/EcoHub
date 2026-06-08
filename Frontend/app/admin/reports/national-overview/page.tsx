'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Cpu, 
    Activity, 
    Heart, 
    Settings, 
    TrendingUp, 
    Clock, 
    Download, 
    FileText, 
    LayoutDashboard, 
    AlertTriangle, 
    ShieldAlert, 
    Award,
    Hourglass
} from "lucide-react";
import { contractorTheme } from "@/lib/theme";
import IntegratedLoader from "@/components/layout/IntegratedLoader";
import StatCard from "@/components/ui/stat-card";

// Recharts components for data visualization
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function MachineAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [isExportOpen, setIsExportOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    const handleExport = (format: string) => {
        console.log(`Exporting machine analytics as ${format}...`);
        alert(`Exporting machine analytics as ${format} has been initiated.`);
    };

    if (loading) {
        return <IntegratedLoader />;
    }

    // Pie Chart Data: Machine Status Distribution
    const statusData = [
        { name: 'Running', value: 35, color: '#10B981' }, // emerald-500
        { name: 'Idle', value: 7, color: '#F59E0B' },    // amber-500
        { name: 'Maintenance', value: 3, color: '#EF4444' } // red-500
    ];

    // Bar Chart Data: Machine Health Overview
    const healthData = [
        { name: 'MC-101', health: 95 },
        { name: 'MC-102', health: 88 },
        { name: 'MC-103', health: 72 },
        { name: 'MC-104', health: 45 },
        { name: 'MC-105', health: 91 }
    ];

    // Bar Chart Data: Machine Utilization
    const utilizationData = [
        { name: 'Production', rate: 92 },
        { name: 'Packaging', rate: 85 },
        { name: 'Assembly', rate: 78 },
        { name: 'Quality Control', rate: 81 }
    ];

    // Line Chart Data: Downtime Analysis
    const downtimeData = [
        { day: 'Mon', hours: 2 },
        { day: 'Tue', hours: 1 },
        { day: 'Wed', hours: 4 },
        { day: 'Thu', hours: 2 },
        { day: 'Fri', hours: 3 },
        { day: 'Sat', hours: 1 }
    ];

    // Maintenance Overview Table Data
    const maintenanceSchedule = [
        { machineId: 'MC-101', name: 'CNC Machine', lastService: '01 Jun 2026', nextService: '01 Jul 2026', daysRemaining: '18 Days', status: 'Scheduled' },
        { machineId: 'MC-102', name: 'Conveyor Belt', lastService: '15 May 2026', nextService: '15 Jun 2026', daysRemaining: '3 Days', status: 'Urgent' },
        { machineId: 'MC-103', name: 'Welding Robot', lastService: '20 May 2026', nextService: '20 Jun 2026', daysRemaining: '13 Days', status: 'Scheduled' },
        { machineId: 'MC-104', name: 'Packaging Unit', lastService: '05 Jun 2026', nextService: '05 Jul 2026', daysRemaining: '28 Days', status: 'Scheduled' },
        { machineId: 'MC-105', name: 'Laser Cutter', lastService: '10 May 2026', nextService: '10 Jun 2026', daysRemaining: '3 Days', status: 'Urgent' }
    ];

    // Machine Alerts Data
    const machineAlerts = [
        { machineId: 'MC-103', message: 'health score below 50%' },
        { machineId: 'MC-201', message: 'service due in 3 days' },
        { machineId: 'MC-110', message: 'downtime exceeded threshold' },
        { machineId: 'MC-302', message: 'requires immediate inspection' }
    ];

    // Recent Machine Activities
    const recentActivities = [
        "Maintenance completed for MC-101",
        "Machine MC-102 entered maintenance mode",
        "Health score updated",
        "Operator reassigned",
        "Inspection completed"
    ];

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
            
            {/* Header */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white drop-shadow-2xl leading-tight">
                            Machine Analytics
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-lg text-white/90 font-bold drop-shadow-lg mt-2">
                            Monitor machine health, performance, maintenance schedules, and operational efficiency in real time.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative">
                        <Button 
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all font-bold rounded-xl flex items-center gap-2 shadow-xl hover:shadow-2xl"
                        >
                            <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            Export Analytics
                        </Button>
                        {isExportOpen && (
                            <div className="absolute right-0 top-12 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20">
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
            </header>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <StatCard
                    title="Total Machines"
                    value={45}
                    subtitle="Registered factory machines"
                    icon={Cpu}
                    color="blue"
                />
                <StatCard
                    title="Running Machines"
                    value={35}
                    subtitle="Currently operational"
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Average Health Score"
                    value="87%"
                    subtitle="Overall machine health"
                    icon={Heart}
                    color="emerald"
                />
                <StatCard
                    title="Machines Under Maintenance"
                    value={3}
                    subtitle="Currently under maintenance"
                    icon={Settings}
                    color="red"
                />
                <StatCard
                    title="Machine Utilization"
                    value="89%"
                    subtitle="Average utilization rate"
                    icon={TrendingUp}
                    color="indigo"
                />
                <StatCard
                    title="Downtime Hours"
                    value="12 Hours"
                    subtitle="Recorded downtime this month"
                    icon={Hourglass}
                    color="orange"
                />
            </div>

            {/* First Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Left Chart: Machine Status Distribution (Pie Chart) */}
                <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Machine Status Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} Machines`, 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Chart: Machine Health Overview (Bar Chart) */}
                <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Machine Health Overview</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={healthData} margin={{ bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(value) => [`${value}%`, 'Health Score']} />
                                <Bar dataKey="health" fill="#3B82F6" name="Health Score" radius={[4, 4, 0, 0]}>
                                    {healthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.health < 50 ? '#EF4444' : entry.health < 80 ? '#F59E0B' : '#10B981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Second Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Left Chart: Machine Utilization (Bar Chart) */}
                <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Machine Utilization by Department</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={utilizationData} margin={{ bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(value) => [`${value}%`, 'Utilization Rate']} />
                                <Bar dataKey="rate" fill="#8B5CF6" name="Utilization Rate" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Chart: Downtime Analysis (Line Chart) */}
                <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Downtime Analysis (Weekly Hours)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={downtimeData} margin={{ bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value} Hours`, 'Downtime']} />
                                <Line 
                                    type="monotone" 
                                    dataKey="hours" 
                                    stroke="#F59E0B" 
                                    strokeWidth={3} 
                                    activeDot={{ r: 8 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Machine Alerts Section */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                    Machine Alerts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {machineAlerts.map((alert, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 flex items-start gap-3 shadow-sm">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm text-amber-950">{alert.machineId} Warning</h4>
                                <p className="text-xs text-amber-800 mt-1 font-semibold">{alert.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Maintenance Schedule Table */}
            <Card className="backdrop-blur-xl bg-white/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-white/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-800">
                        <Settings className="h-6 w-6 text-indigo-600" />
                        Maintenance Schedule
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-slate-500 font-semibold mt-1">
                        Track past and upcoming scheduled preventive maintenance operations.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Machine ID</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Machine Name</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Last Service Date</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Next Service Date</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6 text-center">Days Remaining</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6 text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {maintenanceSchedule.map((row, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-800 font-semibold">{row.machineId}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700 font-medium">{row.name}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-600">{row.lastService}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-600">{row.nextService}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center text-sm sm:text-base text-slate-700 font-medium">{row.daysRemaining}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                                                    row.status === 'Urgent' ? 'from-red-500 to-rose-600 shadow-red-200' : 'from-blue-500 to-indigo-600 shadow-blue-200'
                                                } shadow-md`}>
                                                    {row.status}
                                                </span>
                                            </div>
                                        </td>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Performance, Attention and Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Top Performing Machines */}
                <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Award className="w-5 h-5 text-emerald-600" />
                        Top Performing Machines
                    </h3>
                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 flex justify-between items-center shadow-sm">
                            <span className="font-bold text-slate-800">MC-101</span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-full">Efficiency: 96%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 flex justify-between items-center shadow-sm">
                            <span className="font-bold text-slate-800">MC-205</span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-full">Efficiency: 94%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 flex justify-between items-center shadow-sm">
                            <span className="font-bold text-slate-800">MC-301</span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-full">Efficiency: 91%</span>
                        </div>
                    </div>
                </div>

                {/* Machines Requiring Attention */}
                <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        Machines Requiring Attention
                    </h3>
                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 flex justify-between items-center shadow-sm">
                            <span className="font-bold text-slate-800">MC-103</span>
                            <span className="text-xs font-bold text-red-700 bg-red-100/50 px-2.5 py-1 rounded-full">Health Score: 42%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 flex justify-between items-center shadow-sm">
                            <span className="font-bold text-slate-800">MC-111</span>
                            <span className="text-xs font-bold text-red-700 bg-red-100/50 px-2.5 py-1 rounded-full">Health Score: 38%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 flex justify-between items-center shadow-sm">
                            <span className="font-bold text-slate-800">MC-220</span>
                            <span className="text-xs font-bold text-red-700 bg-red-100/50 px-2.5 py-1 rounded-full">Health Score: 45%</span>
                        </div>
                    </div>
                </div>

                {/* Recent Machine Activity */}
                <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Recent Machine Activity
                    </h3>
                    <div className="space-y-3.5 flex-1 flex flex-col justify-center overflow-y-auto max-h-[200px] pr-1">
                        {recentActivities.map((act, index) => (
                            <div key={index} className="flex gap-2 text-sm text-slate-700 border-b border-slate-100 pb-2.5 last:border-b-0 last:pb-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></span>
                                <p className="font-medium">{act}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
