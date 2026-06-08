'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Shield,
  Clock,
  TrendingUp,
  MapPin,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle2,
  Circle,
  XCircle,
  Cpu,
  FileText,
  Bell,
  ChevronRight,
  X,
  Wrench,
  BarChart3,
  LogIn,
  LogOut,
  Eye,
  CheckSquare,
  Zap,
  CalendarClock,
  ClipboardList,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type AttendanceState = 'not-checked-in' | 'checked-in' | 'checked-out';
type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: number;
  name: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  description: string;
  assignedBy: string;
  assignedDate: string;
  machine: string;
  instructions: string;
}

interface Activity {
  id: number;
  label: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function IntegratedLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[60vh]">
      <style jsx>{`
        .loader {
          --c: no-repeat linear-gradient(#4f46e5 0 0);
          background:
            var(--c),var(--c),var(--c),
            var(--c),var(--c),var(--c),
            var(--c),var(--c),var(--c);
          background-size: 16px 16px;
          animation:
            l32-1 1s infinite,
            l32-2 1s infinite;
        }
        @keyframes l32-1 {
          0%,100% {width:45px;height: 45px}
          35%,65% {width:65px;height: 65px}
        }
        @keyframes l32-2 {
          0%,40%  {background-position: 0 0,0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,  50% 50% }
          60%,100%{background-position: 0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,0 0,  50% 50% }
        }
      `}</style>
      <div className="loader"></div>
    </div>
  );
}

// ─── Badge helpers ─────────────────────────────────────────────────────────────
const priorityBadge: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border border-red-200',
  Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Low: 'bg-green-100 text-green-700 border border-green-200',
};

const statusBadge: Record<TaskStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
  Completed: 'bg-green-100 text-green-700 border border-green-200',
  Overdue: 'bg-red-100 text-red-700 border border-red-200',
};

// ─── Card wrapper ─────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">{children}</h2>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WorkersDashboard() {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceState>('not-checked-in');
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');
  const [workingHours, setWorkingHours] = useState<string>('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [issueForm, setIssueForm] = useState({ type: '', machine: 'MC-101', priority: 'Medium', description: '' });
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1, name: 'Machine Inspection', priority: 'High', deadline: 'Today', status: 'In Progress',
      description: 'Perform a full inspection of CNC Machine MC-101 before production begins.',
      assignedBy: 'Rahul Singh', assignedDate: '07 Jun 2026', machine: 'MC-101', instructions: 'Check oil levels, calibration, and safety guards.',
    },
    {
      id: 2, name: 'Material Loading', priority: 'Medium', deadline: 'Today', status: 'Pending',
      description: 'Load raw material onto the conveyor belt for assembly line production.',
      assignedBy: 'Rahul Singh', assignedDate: '07 Jun 2026', machine: 'MC-101', instructions: 'Ensure material weight does not exceed 200 kg per batch.',
    },
    {
      id: 3, name: 'Packaging Support', priority: 'Low', deadline: 'Completed', status: 'Completed',
      description: 'Assist packaging team with end-of-day product wrapping.',
      assignedBy: 'Rahul Singh', assignedDate: '06 Jun 2026', machine: 'MC-101', instructions: 'Use approved packaging material only.',
    },
  ]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, label: 'Task Assigned — Machine Inspection', time: '08:30 AM', icon: ClipboardList, color: 'text-blue-500' },
    { id: 2, label: 'Directive Viewed — Mandatory Safety Check', time: '08:45 AM', icon: Bell, color: 'text-purple-500' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const calcHours = (start: string, end: string) => {
    const parse = (t: string) => {
      const [time, ampm] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    const diff = parse(end) - parse(start);
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const handleCheckIn = () => {
    const now = formatTime(new Date());
    setCheckInTime(now);
    setAttendance('checked-in');
    setActivities(prev => [{ id: Date.now(), label: 'Checked In', time: now, icon: LogIn, color: 'text-green-500' }, ...prev]);
  };

  const handleCheckOut = () => {
    const now = formatTime(new Date());
    setCheckOutTime(now);
    setWorkingHours(calcHours(checkInTime, now));
    setAttendance('checked-out');
    setActivities(prev => [{ id: Date.now(), label: 'Checked Out', time: now, icon: LogOut, color: 'text-red-500' }, ...prev]);
  };

  const handleMarkComplete = (taskId: number) => {
    if (attendance !== 'checked-in') return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    const now = formatTime(new Date());
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActivities(prev => [{ id: Date.now(), label: `Task Completed — ${task.name}`, time: now, icon: CheckCircle2, color: 'text-green-500' }, ...prev]);
    }
    setShowTaskModal(false);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = formatTime(new Date());
    setActivities(prev => [{ id: Date.now(), label: `Issue Reported — ${issueForm.type}`, time: now, icon: AlertTriangle, color: 'text-orange-500' }, ...prev]);
    setIssueSubmitted(true);
    setTimeout(() => { setShowIssueModal(false); setIssueSubmitted(false); setIssueForm({ type: '', machine: 'MC-101', priority: 'Medium', description: '' }); }, 2000);
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;

  if (loading) return <IntegratedLoader />;

  const isCheckedIn = attendance === 'checked-in';
  const isCheckedOut = attendance === 'checked-out';

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 min-h-screen">

      {/* ── Header ── */}
      <header className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-xl sm:rounded-2xl"></div>
        <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white drop-shadow-2xl leading-tight">
                Worker Dashboard
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-bold drop-shadow-lg mt-1">
                Track your attendance, assigned tasks, machine assignment, and daily work progress.
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium">Welcome back, <span className="font-bold text-white">Amit Kumar</span></p>
            </div>
            <button
              onClick={() => attendance !== 'checked-in' ? null : setShowIssueModal(true)}
              disabled={!isCheckedIn}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200
                ${isCheckedIn
                  ? 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'}`}
            >
              <AlertTriangle className="h-4 w-4" />
              Report Issue
            </button>
          </div>
        </div>
      </header>

      {/* ── Attendance Section ── */}
      <Card>
        <SectionTitle>Today's Attendance</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
            {attendance === 'not-checked-in' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-sm font-semibold">
                <XCircle className="h-3.5 w-3.5" /> Not Checked In
              </span>
            )}
            {attendance === 'checked-in' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-sm font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Present ✅
              </span>
            )}
            {attendance === 'checked-out' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-sm font-semibold">
                <Circle className="h-3.5 w-3.5" /> Completed
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Shift</p>
            <p className="text-sm font-semibold text-gray-800">Morning Shift</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Department</p>
            <p className="text-sm font-semibold text-gray-800">Assembly</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Assigned Machine</p>
            <p className="text-sm font-semibold text-gray-800">MC-101</p>
          </div>
        </div>

        {/* Time info after check-in */}
        {(isCheckedIn || isCheckedOut) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 p-4 bg-green-50/60 rounded-xl border border-green-200/50">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Check-In Time</p>
              <p className="text-sm font-bold text-gray-800">{checkInTime}</p>
            </div>
            {isCheckedOut && (
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Check-Out Time</p>
                <p className="text-sm font-bold text-gray-800">{checkOutTime}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">{isCheckedOut ? 'Total Working Hours' : 'Working Hours'}</p>
              <p className="text-sm font-bold text-gray-800">{isCheckedOut ? workingHours : '—'}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {attendance === 'not-checked-in' && (
            <button
              onClick={handleCheckIn}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm"
            >
              <LogIn className="h-4 w-4" /> Check In
            </button>
          )}
          {attendance === 'checked-in' && (
            <button
              onClick={handleCheckOut}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm"
            >
              <LogOut className="h-4 w-4" /> Check Out
            </button>
          )}
          {attendance === 'checked-out' && (
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Shift Completed
            </span>
          )}
        </div>
      </Card>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          { title: 'Assigned Tasks', value: String(tasks.length), icon: ClipboardList, color: 'from-blue-500 to-indigo-600' },
          { title: 'Completed Tasks', value: String(completedCount), icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
          { title: 'Pending Tasks', value: String(pendingCount), icon: Clock, color: 'from-amber-500 to-orange-500' },
          {
            title: 'Attendance Status',
            value: attendance === 'not-checked-in' ? 'Absent' : attendance === 'checked-in' ? 'Present' : 'Completed',
            icon: UserCheck,
            color: attendance === 'checked-in' ? 'from-green-500 to-emerald-600' : attendance === 'checked-out' ? 'from-gray-400 to-gray-500' : 'from-red-500 to-rose-600',
          },
        ].map((card) => (
          <div key={card.title} className={`bg-gradient-to-br ${card.color} rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xl text-white`}>
            <div className="flex items-start justify-between mb-2">
              <card.icon className="h-5 w-5 opacity-80" />
              <span className="text-2xl sm:text-3xl font-black">{card.value}</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold opacity-90">{card.title}</p>
          </div>
        ))}
      </div>

      {/* ── Today's Work Summary + Assigned Machine (side by side on lg) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Work Summary */}
        <Card>
          <SectionTitle>Today's Work Summary</SectionTitle>
          <div className="space-y-3">
            {[
              { label: 'Employee ID', value: 'EMP-201' },
              { label: 'Department', value: 'Assembly' },
              { label: 'Shift', value: 'Morning Shift' },
              { label: 'Supervisor', value: 'Rahul Singh' },
              { label: 'Assigned Machine', value: 'MC-101 CNC Machine' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">{row.label}</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Assigned Machine */}
        <Card>
          <SectionTitle>Assigned Machine</SectionTitle>
          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
              <Cpu className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Machine ID', value: 'MC-101' },
                { label: 'Machine Name', value: 'CNC Machine' },
                { label: 'Machine Type', value: 'Cutting Machine' },
                { label: 'Department', value: 'Assembly' },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-xs text-gray-500 font-medium">{row.label}</span>
                  <span className="text-xs font-semibold text-gray-800">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs text-gray-500 font-medium">Machine Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Running
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400 italic">View only — contact supervisor for changes.</p>
        </Card>
      </div>

      {/* ── My Tasks Section ── */}
      <Card>
        <SectionTitle>Assigned Tasks</SectionTitle>
        {!isCheckedIn && !isCheckedOut && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700 font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            Please <strong>Check In</strong> first to update tasks and mark completions.
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50/80 rounded-lg">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Task Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Deadline</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{task.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge[task.priority]}`}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">{task.deadline}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[task.status]}`}>{task.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      {task.status !== 'Completed' && (
                        <button
                          disabled={!isCheckedIn}
                          onClick={() => handleMarkComplete(task.id)}
                          className={`flex items-center gap-1 text-xs font-semibold transition-colors
                            ${isCheckedIn
                              ? 'text-green-600 hover:text-green-800 cursor-pointer'
                              : 'text-gray-300 cursor-not-allowed'}`}
                        >
                          <CheckSquare className="h-3.5 w-3.5" /> Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Active Directives + My Performance (side by side on lg) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Active Directives */}
        <Card>
          <SectionTitle>Active Directives</SectionTitle>
          <div className="space-y-3">
            {[
              { title: 'Mandatory Safety Check', priority: 'High' as Priority, due: 'Due Today', color: 'border-l-red-400' },
              { title: 'Machine Inspection Drive', priority: 'Medium' as Priority, due: 'Due Tomorrow', color: 'border-l-yellow-400' },
              { title: 'PPE Compliance Verification', priority: 'Low' as Priority, due: 'Due This Week', color: 'border-l-green-400' },
            ].map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-3 bg-gray-50/60 rounded-xl border-l-4 ${d.color} border border-gray-100`}>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{d.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.due}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge[d.priority]}`}>{d.priority}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* My Performance */}
        <Card>
          <SectionTitle>My Performance</SectionTitle>
          <div className="space-y-4">
            {[
              { label: 'Tasks Completed This Week', value: '18', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Task Completion Rate', value: '94%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Attendance Rate', value: '96%', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bg}`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-black text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Recent Activities + Shift Summary (side by side on lg) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <Card>
          <SectionTitle>Recent Activities</SectionTitle>
          <div className="space-y-3">
            {activities.length === 0 && (
              <p className="text-xs text-gray-400 italic">No activities yet. Check in to start your shift.</p>
            )}
            {activities.map((act, i) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="relative flex flex-col items-center">
                  <div className={`p-1.5 rounded-full bg-gray-100 ${act.color}`}>
                    <act.icon className="h-3.5 w-3.5" />
                  </div>
                  {i < activities.length - 1 && <div className="w-px h-4 bg-gray-200 mt-1"></div>}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{act.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Shift Summary */}
        <Card>
          <SectionTitle>Today's Shift Summary</SectionTitle>
          <div className="space-y-3">
            {[
              {
                label: 'Attendance Status',
                value: attendance === 'not-checked-in' ? 'Not Checked In' : attendance === 'checked-in' ? 'Present' : 'Completed',
              },
              { label: 'Assigned Machine', value: 'MC-101 CNC Machine' },
              { label: 'Tasks Assigned', value: String(tasks.length) },
              { label: 'Tasks Completed', value: String(completedCount) },
              { label: 'Tasks Pending', value: String(pendingCount) },
              { label: 'Current Shift', value: 'Morning Shift (08:00 AM – 04:00 PM)' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">{row.label}</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <Card>
        <SectionTitle>Quick Actions</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              label: 'Check In', icon: LogIn, color: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200/50 text-blue-900',
              iconColor: 'text-blue-600',
              onClick: () => attendance === 'not-checked-in' && handleCheckIn(),
              disabled: attendance !== 'not-checked-in',
            },
            {
              label: 'Check Out', icon: LogOut, color: 'bg-red-50/80 hover:bg-red-100/80 border-red-200/50 text-red-900',
              iconColor: 'text-red-600',
              onClick: () => isCheckedIn && handleCheckOut(),
              disabled: !isCheckedIn,
            },
            {
              label: 'View Tasks', icon: ClipboardList, color: 'bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-200/50 text-indigo-900',
              iconColor: 'text-indigo-600',
              onClick: () => {},
              disabled: false,
            },
            {
              label: 'Report Issue', icon: AlertTriangle, color: 'bg-orange-50/80 hover:bg-orange-100/80 border-orange-200/50 text-orange-900',
              iconColor: 'text-orange-600',
              onClick: () => isCheckedIn && setShowIssueModal(true),
              disabled: !isCheckedIn,
            },
            {
              label: 'View Directives', icon: Bell, color: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/50 text-purple-900',
              iconColor: 'text-purple-600',
              onClick: () => {},
              disabled: false,
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl text-xs font-semibold text-center transition-all duration-200 hover:shadow-lg
                ${action.disabled ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : `${action.color} border cursor-pointer`}`}
            >
              <action.icon className={`h-6 w-6 ${action.disabled ? 'text-gray-400' : action.iconColor}`} />
              {action.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ─────────────────────── MODALS ─────────────────────── */}

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Task Details</h3>
              <button onClick={() => setShowTaskModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                {[
                  { label: 'Task Name', value: selectedTask.name },
                  { label: 'Assigned By', value: selectedTask.assignedBy },
                  { label: 'Assigned Date', value: selectedTask.assignedDate },
                  { label: 'Priority', value: selectedTask.priority },
                  { label: 'Deadline', value: selectedTask.deadline },
                  { label: 'Current Status', value: selectedTask.status },
                  { label: 'Assigned Machine', value: selectedTask.machine },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-gray-500 font-medium">{row.label}</span>
                    <span className="text-xs font-semibold text-gray-800">{row.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedTask.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Instructions</p>
                <p className="text-sm text-gray-700">{selectedTask.instructions}</p>
              </div>
              {selectedTask.status !== 'Completed' && (
                <button
                  disabled={!isCheckedIn}
                  onClick={() => handleMarkComplete(selectedTask.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200
                    ${isCheckedIn
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {isCheckedIn ? 'Mark Task Complete' : 'Check In to Mark Complete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Report Issue</h3>
              <button onClick={() => setShowIssueModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {issueSubmitted ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <p className="text-lg font-bold text-green-700">Issue Reported Successfully!</p>
                <p className="text-sm text-gray-500 text-center">Your supervisor has been automatically notified.</p>
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Issue Type</label>
                  <select
                    required
                    value={issueForm.type}
                    onChange={e => setIssueForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                  >
                    <option value="">Select issue type</option>
                    {['Machine Not Working', 'Machine Noise', 'Machine Vibration', 'Material Shortage', 'Safety Issue', 'Quality Issue', 'Other'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Machine</label>
                  <input
                    value={issueForm.machine}
                    onChange={e => setIssueForm(p => ({ ...p, machine: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    placeholder="Machine ID (e.g. MC-101)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Priority</label>
                  <select
                    value={issueForm.priority}
                    onChange={e => setIssueForm(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                  >
                    {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={issueForm.description}
                    onChange={e => setIssueForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    placeholder="Describe the issue in detail..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Submit Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}