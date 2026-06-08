"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/ui/stat-card';
import {
  Building2,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Shield,
  AlertCircle,
  BarChart3,
  FileCheck,
  TrendingUp,
  Settings,
  ClipboardList,
  Calendar,
  ArrowUpRight,
  Activity,
  Award,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Bar, Line } from 'react-chartjs-2';
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
} from 'chart.js';
import IntegratedLoader from '@/components/layout/IntegratedLoader';

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

export default function ManagerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 flex items-center justify-center">
        <IntegratedLoader />
      </div>
    );
  }

  // Production Trend Line Chart (Weekly Output)
  const productionTrendData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Actual Production (Units)',
        data: [14200, 15100, 14800, 16200, 15400, 13900, 11500],
        borderColor: 'rgba(59, 130, 246, 1)', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverRadius: 6,
      },
      {
        label: 'Daily Target (18,000 Units)',
        data: [18000, 18000, 18000, 18000, 18000, 18000, 18000],
        borderColor: 'rgba(239, 68, 68, 0.8)', // Red-500
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  const productionTrendOptions = {
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
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  // Production Target vs Actual Grouped Bar Chart
  const targetVsActualData = {
    labels: ['Assembly', 'Packaging', 'Quality Control', 'Warehouse', 'Dispatch'],
    datasets: [
      {
        label: 'Target Production',
        data: [18000, 15000, 12000, 20000, 16000],
        backgroundColor: 'rgba(99, 102, 241, 0.85)', // Indigo-500
        borderRadius: 6,
      },
      {
        label: 'Actual Production',
        data: [17100, 13200, 10920, 16800, 14240], // Corresponds to 95%, 88%, 91%, 84%, 89% performance
        backgroundColor: 'rgba(16, 185, 129, 0.85)', // Emerald-500
        borderRadius: 6,
      },
    ],
  };

  const targetVsActualOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: { enabled: true },
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 lg:gap-6 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="space-y-1 sm:space-y-2 relative z-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg leading-tight">
              Manager Dashboard
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
              Monitor factory operations, workforce productivity, machine performance, and production targets in real time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto relative z-10">
            <button 
              onClick={() => router.push('/admin/reports/reports-center')}
              className="px-4 sm:px-6 py-2.5 lg:py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Production Report
            </button>
            <button 
              onClick={() => router.push('/admin/reports/national-overview')}
              className="px-4 sm:px-6 py-2.5 lg:py-3 border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              View Machine Analytics
            </button>
          </div>
        </header>

        {/* Top KPI Cards */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
            title="Running Machines" 
            value="35 / 45" 
            subtitle="Operational machines" 
            icon={Settings} 
            color="indigo" 
          />
          <StatCard 
            title="Worker Attendance" 
            value="89 / 100" 
            subtitle="Present workforce" 
            icon={Users} 
            color="purple" 
          />
          <StatCard 
            title="Open Issues" 
            value="7" 
            subtitle="Pending operational issues" 
            icon={AlertTriangle} 
            color="red" 
          />
          <StatCard 
            title="Active Directives" 
            value="5" 
            subtitle="Instructions from management" 
            icon={FileCheck} 
            color="amber" 
          />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Production Trend Line Chart */}
          <div className="bg-gradient-to-br from-white/95 via-blue-50/50 to-indigo-50/30 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Production Trend
            </h3>
            <div className="h-64 sm:h-72 lg:h-80 relative">
              <Line data={productionTrendData} options={productionTrendOptions} />
            </div>
          </div>

          {/* Target vs Actual Bar Chart */}
          <div className="bg-gradient-to-br from-white/95 via-purple-50/50 to-violet-50/30 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Production Target vs Actual
            </h3>
            <div className="h-64 sm:h-72 lg:h-80 relative">
              <Bar data={targetVsActualData} options={targetVsActualOptions} />
            </div>
          </div>
        </section>

        {/* Department Performance, Machine & Workforce Overviews */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Department Performance */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-500" />
                Department Performance
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Assembly', score: 95, color: 'bg-green-500' },
                  { name: 'Packaging', score: 88, color: 'bg-blue-500' },
                  { name: 'Quality Control', score: 91, color: 'bg-emerald-500' },
                  { name: 'Warehouse', score: 84, color: 'bg-amber-500' },
                  { name: 'Dispatch', score: 89, color: 'bg-indigo-500' }
                ].map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700">
                      <span>{dept.name}</span>
                      <span>{dept.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-500", dept.color)} style={{ width: `${dept.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Machine Overview */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-500" />
                Machine Overview
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-xl sm:text-2xl font-black text-green-700">35</p>
                  <p className="text-xs text-green-600/80 font-bold mt-0.5">Running</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xl sm:text-2xl font-black text-amber-600">7</p>
                  <p className="text-xs text-amber-600/80 font-bold mt-0.5">Idle</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-xl sm:text-2xl font-black text-red-600">3</p>
                  <p className="text-xs text-red-600/80 font-bold mt-0.5">Maintenance</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button 
                onClick={() => router.push('/admin/reports/national-overview')}
                className="w-full py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-indigo-100"
              >
                View Machine Analytics
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Workforce Overview */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                Workforce Overview
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Present Workers', value: 89, total: 105, color: 'text-green-600', bg: 'bg-green-500' },
                  { label: 'Absent Workers', value: 11, total: 105, color: 'text-red-600', bg: 'bg-red-500' },
                  { label: 'On Leave', value: 5, total: 105, color: 'text-amber-500', bg: 'bg-amber-500' }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-700">{stat.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Shift Duty A/B</p>
                    </div>
                    <span className={cn("text-lg sm:text-xl font-black", stat.color)}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Directives & Alerts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Active Directives */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-500" />
              Management Directives
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Increase Production Target by 10%', priority: 'High', date: '20 Jun 2026', color: 'border-red-200 bg-red-50/40 text-red-700' },
                { title: 'Mandatory Machine Inspection', priority: 'Medium', date: '18 Jun 2026', color: 'border-amber-200 bg-amber-50/40 text-amber-700' },
                { title: 'Safety Compliance Audit', priority: 'High', date: '25 Jun 2026', color: 'border-red-200 bg-red-50/40 text-red-700' }
              ].map((dir, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{dir.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Due Date: {dir.date}
                    </p>
                  </div>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold self-start sm:self-auto border", dir.color)}>
                    {dir.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Alerts */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Operational Alerts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { text: 'Machine MC-103 requires maintenance', desc: 'Hydraulic leak detected' },
                { text: 'Production target below expected level', desc: 'Assembly Line 2 lagging' },
                { text: 'Attendance below threshold', desc: 'Shift B attendance under 85%' },
                { text: 'Quality control issue detected', desc: 'Tolerance error on batch Q-401' }
              ].map((alert, i) => (
                <div key={i} className="p-4 rounded-xl border border-red-100 bg-red-50/40 hover:bg-red-50 transition-all duration-300 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{alert.text}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline & Performers Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Factory Activities */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              Recent Factory Activities
            </h3>
            <div className="relative pl-6 space-y-5 border-l border-slate-100 py-2">
              {[
                { title: 'Production updated by Supervisor', time: '10 mins ago', desc: 'Batch A-309 output submitted.' },
                { title: 'Maintenance completed for MC-101', time: '45 mins ago', desc: 'Hydraulic press calibrated.' },
                { title: 'Worker assigned to Machine A-101', time: '1 hr ago', desc: 'Sarah Jenkins assigned to CNC mill.' },
                { title: 'Production report generated', time: '2 hrs ago', desc: 'Daily log exported in PDF.' },
                { title: 'Machine status updated', time: '3 hrs ago', desc: 'MAC-004 marked as under Maintenance.' }
              ].map((act, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[30px] top-1 bg-indigo-500 border-4 border-white h-4 w-4 rounded-full shadow-md"></span>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{act.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Top Performing Employees
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                { name: 'Amit Kumar', score: 98, role: 'CNC Operator', color: 'from-amber-400 to-orange-500' },
                { name: 'Rahul Singh', score: 95, role: 'Assembly Tech', color: 'from-slate-300 to-slate-400' },
                { name: 'Harsh Gupta', score: 93, role: 'Warehouse Lead', color: 'from-yellow-700 to-amber-800' }
              ].map((perf, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between items-center text-center gap-3 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className={cn("absolute top-0 inset-x-0 h-1 bg-gradient-to-r", perf.color)}></div>
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {perf.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{perf.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{perf.role}</p>
                  </div>
                  <div className="py-1 px-3 bg-indigo-50 rounded-full border border-indigo-100">
                    <p className="text-xs font-black text-indigo-700">{perf.score}% Prod</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-gradient-to-br from-white/95 via-slate-50/90 to-gray-50/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/40 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">Quick Actions</h3>
            <span className="text-xs sm:text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/50">4 available operations</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button 
              onClick={() => router.push('/admin/reports/reports-center')}
              className="bg-gradient-to-br from-white/95 to-blue-50/90 backdrop-blur-sm border border-white/60 p-4 text-left w-full rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-200/60 group"
            >
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-blue-900 text-xs sm:text-sm truncate">Generate Production Report</p>
                  <p className="text-xs text-blue-700/70 truncate">Export PDF log metrics</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/reports/national-overview')}
              className="bg-gradient-to-br from-white/95 to-green-50/90 backdrop-blur-sm border border-white/60 p-4 text-left w-full rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-200/60 group"
            >
              <div className="flex items-start gap-3">
                <BarChart3 className="h-6 w-6 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-green-900 text-xs sm:text-sm truncate">View Machine Analytics</p>
                  <p className="text-xs text-green-700/70 truncate">Check status & downtime</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => alert('Reviewing active management directives...')}
              className="bg-gradient-to-br from-white/95 to-purple-50/90 backdrop-blur-sm border border-white/60 p-4 text-left w-full rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-purple-200/60 group"
            >
              <div className="flex items-start gap-3">
                <ClipboardList className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-purple-900 text-xs sm:text-sm truncate">Review Directives</p>
                  <p className="text-xs text-purple-700/70 truncate">Check compliance targets</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/reports/reports-center')}
              className="bg-gradient-to-br from-white/95 to-red-50/90 backdrop-blur-sm border border-white/60 p-4 text-left w-full rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-red-200/60 group"
            >
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-red-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-red-900 text-xs sm:text-sm truncate">View Attendance Report</p>
                  <p className="text-xs text-red-700/70 truncate">Check present count</p>
                </div>
              </div>
            </button>
          </div>
        </section>

    </div>
  );
}