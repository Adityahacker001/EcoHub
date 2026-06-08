'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Eye,
  CheckSquare,
  Search,
  RefreshCw,
  AlertCircle,
  LogIn,
  Activity,
  Play,
  Send,
  RotateCcw,
  Upload,
  FileText,
  Bell,
  Hourglass,
  CircleAlert,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
type TaskStatus = 'Pending' | 'In Progress' | 'Waiting Review' | 'Completed' | 'Needs Rework';
type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: string;
  name: string;
  machine: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  description: string;
  assignedBy: string;
  assignedDate: string;
  department: string;
  instructions: string;
  supervisorRemarks?: string;
}

interface ActivityItem {
  id: number;
  label: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

// ─── Badge helpers ──────────────────────────────────────────────────────────────
const priorityBadge: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border border-red-200',
  Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Low: 'bg-green-100 text-green-700 border border-green-200',
};

const statusBadge: Record<TaskStatus, string> = {
  Pending: 'bg-slate-100 text-slate-700 border border-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Waiting Review': 'bg-purple-100 text-purple-700 border border-purple-200',
  Completed: 'bg-green-100 text-green-700 border border-green-200',
  'Needs Rework': 'bg-orange-100 text-orange-700 border border-orange-200',
};

// ─── Card wrapper ───────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">{children}</h2>
);

// ─── Sample data ────────────────────────────────────────────────────────────────
const initialTasks: Task[] = [
  {
    id: 'TSK-101', name: 'Machine Inspection', machine: 'MC-101', priority: 'High', deadline: 'Today 5:00 PM', status: 'Pending',
    description: 'Perform a complete inspection of CNC Machine MC-101 before production begins.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '07 Jun 2026', department: 'Assembly',
    instructions: 'Inspect machine components, check oil levels, calibration, and safety guards. Report any abnormalities immediately.',
  },
  {
    id: 'TSK-102', name: 'Material Loading', machine: 'MC-102', priority: 'Medium', deadline: 'Today 3:00 PM', status: 'In Progress',
    description: 'Load raw material onto the conveyor belt for the assembly line production batch.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '07 Jun 2026', department: 'Assembly',
    instructions: 'Ensure material weight does not exceed 200 kg per batch. Wear protective gloves.',
  },
  {
    id: 'TSK-103', name: 'Packaging Support', machine: 'MC-103', priority: 'Low', deadline: 'Today 4:00 PM', status: 'Waiting Review',
    description: 'Assist the packaging team with end-of-day product wrapping and labelling.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '06 Jun 2026', department: 'Packaging',
    instructions: 'Use approved packaging material only. Label each box before sealing.',
  },
  {
    id: 'TSK-104', name: 'Safety Inspection', machine: 'MC-101', priority: 'High', deadline: 'Today 4:00 PM', status: 'Needs Rework',
    description: 'Conduct a safety inspection of all workstations in the assembly department.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '07 Jun 2026', department: 'Assembly',
    instructions: 'Check fire extinguishers, emergency exits, and PPE compliance for all workers.',
    supervisorRemarks: 'Incomplete — fire extinguisher check on floor 2 is missing. Please re-inspect and re-submit.',
  },
  {
    id: 'TSK-105', name: 'Quality Verification', machine: 'MC-104', priority: 'Medium', deadline: 'Today 2:00 PM', status: 'Completed',
    description: 'Verify product quality parameters for the morning batch.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '07 Jun 2026', department: 'Quality Control',
    instructions: 'Use standard QC checklist. Document deviations for supervisor review.',
  },
  {
    id: 'TSK-106', name: 'Tool Calibration', machine: 'MC-102', priority: 'Low', deadline: 'Today 6:00 PM', status: 'In Progress',
    description: 'Calibrate CNC cutting tools to ensure precision during production.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '07 Jun 2026', department: 'Assembly',
    instructions: 'Calibrate all cutting tools as per the maintenance schedule.',
  },
  {
    id: 'TSK-107', name: 'Conveyor Check', machine: 'MC-105', priority: 'Medium', deadline: 'Today 5:30 PM', status: 'In Progress',
    description: 'Perform scheduled maintenance check on the main conveyor belt system.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '07 Jun 2026', department: 'Maintenance',
    instructions: 'Check belt tension, lubricate moving parts, and test emergency stop mechanism.',
  },
  {
    id: 'TSK-108', name: 'Shift Handover Report', machine: 'N/A', priority: 'High', deadline: 'Today 6:00 PM', status: 'Completed',
    description: 'Prepare and submit the shift handover report before end of shift.',
    assignedBy: 'Supervisor Rahul Singh', assignedDate: '07 Jun 2026', department: 'Assembly',
    instructions: 'Include task completion status, issues reported, and machine condition notes.',
  },
];

const initialActivities: ActivityItem[] = [
  { id: 1, label: 'TSK-105 — Quality Verification approved by Supervisor', time: '10:30 AM', icon: CheckCircle2, color: 'text-green-500' },
  { id: 2, label: 'TSK-104 — Safety Inspection rejected — Needs Rework', time: '10:00 AM', icon: CircleAlert, color: 'text-orange-500' },
  { id: 3, label: 'TSK-103 — Packaging Support submitted for review', time: '09:45 AM', icon: Send, color: 'text-purple-500' },
  { id: 4, label: 'TSK-102 — Material Loading started', time: '09:15 AM', icon: Play, color: 'text-blue-500' },
  { id: 5, label: 'Tasks assigned for Morning Shift', time: '08:00 AM', icon: ClipboardList, color: 'text-indigo-500' },
];

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function MyTasksPage() {
  // In production this comes from shared attendance context
  const [isCheckedIn] = useState(true);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showResumeConfirm, setShowResumeConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [startSuccess, setStartSuccess] = useState(false);

  // Submit form
  const [submitForm, setSubmitForm] = useState({ workDone: '', notes: '', issues: '', completionTime: '' });

  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 900); };

  // Start task
  const handleStartTask = (taskId: string) => {
    if (!isCheckedIn) return;
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'In Progress' } : t));
    if (task) setActivities(prev => [{ id: Date.now(), label: `${task.id} — ${task.name} started`, time: now(), icon: Play, color: 'text-blue-500' }, ...prev]);
    setShowStartConfirm(false);
    setStartSuccess(true);
    setTimeout(() => setStartSuccess(false), 2500);
  };

  // Resume task (Needs Rework → In Progress)
  const handleResumeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'In Progress' } : t));
    if (task) setActivities(prev => [{ id: Date.now(), label: `${task.id} — ${task.name} resumed after rework`, time: now(), icon: RotateCcw, color: 'text-blue-500' }, ...prev]);
    setShowResumeConfirm(false);
  };

  // Submit completion
  const handleSubmitCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'Waiting Review' } : t));
    setActivities(prev => [{ id: Date.now(), label: `${selectedTask.id} — ${selectedTask.name} submitted for review`, time: now(), icon: Send, color: 'text-purple-500' }, ...prev]);
    setSubmitSuccess(true);
    setTimeout(() => { setShowSubmitModal(false); setSubmitSuccess(false); setSubmitForm({ workDone: '', notes: '', issues: '', completionTime: '' }); }, 2200);
  };

  // Derived counts
  const counts = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    waitingReview: tasks.filter(t => t.status === 'Waiting Review').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  const priorityTasks = tasks.filter(t => t.priority === 'High' && (t.status === 'Pending' || t.status === 'In Progress' || t.status === 'Needs Rework'));
  const reworkTasks = tasks.filter(t => t.status === 'Needs Rework');

  const filtered = tasks.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 min-h-screen">

      {/* ── Header ── */}
      <header className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-xl sm:rounded-2xl"></div>
        <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white drop-shadow-2xl leading-tight">
                My Tasks
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-bold drop-shadow-lg mt-1">
                View, track, update, and complete your assigned tasks.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex-shrink-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Tasks
            </button>
          </div>
        </div>
      </header>

      {/* ── Check-In Warning ── */}
      {!isCheckedIn && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-md">
          <LogIn className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700 font-semibold">Please check in before starting work. All task actions are disabled until you check in.</p>
        </div>
      )}

      {/* ── Start Success Toast ── */}
      {startSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl shadow-md">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-semibold">Task started successfully!</p>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          { title: 'Assigned Tasks', value: counts.total, desc: 'Total assigned tasks', icon: ClipboardList, color: 'from-blue-500 to-indigo-600' },
          { title: 'In Progress', value: counts.inProgress, desc: 'Tasks currently being worked on', icon: Activity, color: 'from-amber-500 to-orange-500' },
          { title: 'Waiting Review', value: counts.waitingReview, desc: 'Submitted to Supervisor', icon: Hourglass, color: 'from-purple-500 to-violet-600' },
          { title: 'Completed', value: counts.completed, desc: 'Approved by Supervisor', icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
        ].map(card => (
          <div key={card.title} className={`bg-gradient-to-br ${card.color} rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xl text-white`}>
            <div className="flex items-start justify-between mb-2">
              <card.icon className="h-5 w-5 opacity-80" />
              <span className="text-2xl sm:text-3xl font-black">{card.value}</span>
            </div>
            <p className="text-xs sm:text-sm font-bold opacity-95">{card.title}</p>
            <p className="text-xs opacity-75 mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Priority Tasks + Needs Rework ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Today's Priority Tasks */}
        <Card>
          <SectionTitle>Today's Priority Tasks</SectionTitle>
          {priorityTasks.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No high-priority tasks remaining.</p>
          ) : (
            <div className="space-y-3">
              {priorityTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50/60 border border-red-100 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{task.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Due: {task.deadline} · {task.machine}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge[task.priority]}`}>{task.priority}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[task.status]}`}>{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Needs Rework */}
        <Card>
          <SectionTitle>Tasks Requiring Rework</SectionTitle>
          {reworkTasks.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No tasks require rework at the moment.</p>
          ) : (
            <div className="space-y-3">
              {reworkTasks.map(task => (
                <div key={task.id} className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{task.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">Needs Rework</span>
                  </div>
                  {task.supervisorRemarks && (
                    <div className="text-xs text-orange-700 bg-orange-100/70 rounded-lg px-3 py-2 border border-orange-200/50">
                      <span className="font-bold">Supervisor Remarks:</span> {task.supervisorRemarks}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Deadline: {task.deadline}</p>
                  <button
                    disabled={!isCheckedIn}
                    onClick={() => { setSelectedTask(task); setShowResumeConfirm(true); }}
                    className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all
                      ${isCheckedIn ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Resume Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Tasks Table ── */}
      <Card>
        {/* Search & Filters */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Task..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'Pending', 'In Progress', 'Waiting Review', 'Completed', 'Needs Rework'] as const).map(f => (
              <button key={f} onClick={() => setStatusFilter(f as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                  ${statusFilter === f ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
                {f === 'all' ? 'All Tasks' : f}
              </button>
            ))}
            <span className="border-l border-gray-200 mx-1"></span>
            {(['all', 'High', 'Medium', 'Low'] as const).map(p => (
              <button key={p} onClick={() => setPriorityFilter(p as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                  ${priorityFilter === p ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                {p === 'all' ? 'All Priorities' : p}
              </button>
            ))}
          </div>
        </div>

        <SectionTitle>My Assigned Tasks</SectionTitle>

        {!isCheckedIn && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700 font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Please <strong className="ml-1">Check In</strong>&nbsp;to enable task actions.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Task ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Task Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Machine</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Deadline</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400 italic">No tasks match your search or filters.</td></tr>
              )}
              {filtered.map(task => (
                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-bold text-gray-500">{task.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{task.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">{task.machine}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge[task.priority]}`}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">{task.deadline}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[task.status]}`}>{task.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Pending → Start Task */}
                      {task.status === 'Pending' && (
                        <button
                          disabled={!isCheckedIn}
                          onClick={() => { setSelectedTask(task); setShowStartConfirm(true); }}
                          className={`flex items-center gap-1 text-xs font-bold py-1 px-2.5 rounded-lg transition-all
                            ${isCheckedIn ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          <Play className="h-3 w-3" /> Start
                        </button>
                      )}
                      {/* In Progress → View Details + Submit */}
                      {task.status === 'In Progress' && (
                        <>
                          <button
                            onClick={() => { setSelectedTask(task); setShowDetailsModal(true); }}
                            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                          <button
                            disabled={!isCheckedIn}
                            onClick={() => { setSelectedTask(task); setShowSubmitModal(true); }}
                            className={`flex items-center gap-1 text-xs font-bold py-1 px-2.5 rounded-lg transition-all
                              ${isCheckedIn ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm hover:shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                          >
                            <Send className="h-3 w-3" /> Submit
                          </button>
                        </>
                      )}
                      {/* Waiting Review → View Submission */}
                      {task.status === 'Waiting Review' && (
                        <button
                          onClick={() => { setSelectedTask(task); setShowDetailsModal(true); }}
                          className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Submission
                        </button>
                      )}
                      {/* Completed → View Details */}
                      {task.status === 'Completed' && (
                        <button
                          onClick={() => { setSelectedTask(task); setShowDetailsModal(true); }}
                          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-semibold transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      )}
                      {/* Needs Rework → Resume Task */}
                      {task.status === 'Needs Rework' && (
                        <button
                          disabled={!isCheckedIn}
                          onClick={() => { setSelectedTask(task); setShowResumeConfirm(true); }}
                          className={`flex items-center gap-1 text-xs font-bold py-1 px-2.5 rounded-lg transition-all
                            ${isCheckedIn ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          <RotateCcw className="h-3 w-3" /> Resume
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

      {/* ── Recent Activities ── */}
      <Card>
        <SectionTitle>Recent Task Activities</SectionTitle>
        <div className="space-y-3">
          {activities.map((act, i) => (
            <div key={act.id} className="flex items-start gap-3">
              <div className="relative flex flex-col items-center">
                <div className={`p-1.5 rounded-full bg-gray-100 ${act.color}`}>
                  <act.icon className="h-3.5 w-3.5" />
                </div>
                {i < activities.length - 1 && <div className="w-px h-4 bg-gray-200 mt-1"></div>}
              </div>
              <div className="flex-1 pb-1">
                <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{act.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Quick Actions ── */}
      <Card>
        <SectionTitle>Quick Actions</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'View All Tasks', icon: ClipboardList, col: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200/50 text-blue-900', ic: 'text-blue-600', onClick: () => { setStatusFilter('all'); setPriorityFilter('all'); setSearchQuery(''); }, disabled: false },
            { label: 'Start Task', icon: Play, col: 'bg-green-50/80 hover:bg-green-100/80 border-green-200/50 text-green-900', ic: 'text-green-600', onClick: () => setStatusFilter('Pending'), disabled: !isCheckedIn },
            { label: 'Submit Completion', icon: Send, col: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/50 text-purple-900', ic: 'text-purple-600', onClick: () => setStatusFilter('In Progress'), disabled: !isCheckedIn },
            { label: 'View Priority Tasks', icon: AlertTriangle, col: 'bg-red-50/80 hover:bg-red-100/80 border-red-200/50 text-red-900', ic: 'text-red-600', onClick: () => { setStatusFilter('all'); setPriorityFilter('High'); }, disabled: false },
          ].map(action => (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl text-xs font-semibold text-center transition-all duration-200 hover:shadow-lg
                ${action.disabled ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : `${action.col} border cursor-pointer`}`}
            >
              <action.icon className={`h-6 w-6 ${action.disabled ? 'text-gray-400' : action.ic}`} />
              {action.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ─────────────── MODALS ─────────────── */}

      {/* Task Details Modal */}
      {showDetailsModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Task Details</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{selectedTask.id}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                {[
                  { label: 'Task Name', value: selectedTask.name },
                  { label: 'Assigned By', value: selectedTask.assignedBy },
                  { label: 'Assigned Date', value: selectedTask.assignedDate },
                  { label: 'Deadline', value: selectedTask.deadline },
                  { label: 'Priority', value: selectedTask.priority },
                  { label: 'Status', value: selectedTask.status },
                  { label: 'Assigned Machine', value: selectedTask.machine },
                  { label: 'Department', value: selectedTask.department },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-start gap-4">
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{row.label}</span>
                    <span className="text-xs font-semibold text-gray-800 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedTask.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Instructions</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedTask.instructions}</p>
              </div>
              {selectedTask.supervisorRemarks && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-xs text-orange-600 font-bold mb-1">Supervisor Remarks</p>
                  <p className="text-sm text-orange-700">{selectedTask.supervisorRemarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Start Task Confirm Modal */}
      {showStartConfirm && selectedTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Play className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Start Task?</h3>
                <p className="text-sm text-gray-500 mt-1">You are about to start <strong>{selectedTask.name}</strong>. Status will change to <strong>In Progress</strong>.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowStartConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleStartTask(selectedTask.id)} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">Start Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Task Confirm Modal */}
      {showResumeConfirm && selectedTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <RotateCcw className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Resume Task?</h3>
                <p className="text-sm text-gray-500 mt-1">Resume <strong>{selectedTask.name}</strong> to address supervisor feedback and re-submit for review.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowResumeConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleResumeTask(selectedTask.id)} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">Resume Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Completion Modal */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Submit Completion</h3>
              <button onClick={() => setShowSubmitModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {submitSuccess ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <CheckCircle2 className="h-14 w-14 text-purple-500" />
                <p className="text-lg font-bold text-purple-700">Task Submitted for Review!</p>
                <p className="text-sm text-gray-500 text-center">Your supervisor has been automatically notified.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitCompletion} className="p-5 space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <p className="text-xs text-indigo-600 font-bold">Task</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{selectedTask.name} ({selectedTask.id})</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Work Done <span className="text-red-500">*</span></label>
                  <textarea required rows={3} value={submitForm.workDone} onChange={e => setSubmitForm(p => ({ ...p, workDone: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    placeholder="Describe the work you completed..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Completion Notes <span className="text-red-500">*</span></label>
                  <textarea required rows={2} value={submitForm.notes} onChange={e => setSubmitForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    placeholder="Any final notes about task completion..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Issues Faced <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea rows={2} value={submitForm.issues} onChange={e => setSubmitForm(p => ({ ...p, issues: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    placeholder="Any issues encountered during the task..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Completion Time</label>
                  <input type="time" value={submitForm.completionTime} onChange={e => setSubmitForm(p => ({ ...p, completionTime: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upload Evidence <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:border-indigo-400 transition-colors">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Click to upload photo / document</span>
                  </div>
                </div>
                <button type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  Submit For Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
