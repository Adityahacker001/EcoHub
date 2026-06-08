'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  X,
  Eye,
  Upload,
  Cpu,
  Package,
  Shield,
  Star,
  Wrench,
  CircleAlert,
  Send,
  Bell,
  Activity,
  ClipboardList,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  MapPin,
  ArrowRight,
  CheckCheck,
  UserCheck,
  LocateFixed,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────
type IssueStatus = 'Open' | 'Under Review' | 'Assigned' | 'Resolved' | 'Rejected';
type Priority = 'High' | 'Medium' | 'Low';

interface TrackStage {
  label: string;
  done: boolean;
  time?: string;
  icon: React.ElementType;
}

interface Issue {
  id: string;
  title: string;
  type: string;
  machine: string;
  task?: string;
  priority: Priority;
  status: IssueStatus;
  reportedDate: string;
  description: string;
  supervisorRemarks?: string;
  resolvedBy?: string;
  resolvedDate?: string;
  resolutionNotes?: string;
  resolutionOutcome?: string;
  trackStages: TrackStage[];
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  color: string;
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

const statusBadge: Record<IssueStatus, string> = {
  Open: 'bg-orange-100 text-orange-700 border border-orange-200',
  'Under Review': 'bg-blue-100 text-blue-700 border border-blue-200',
  Assigned: 'bg-purple-100 text-purple-700 border border-purple-200',
  Resolved: 'bg-green-100 text-green-700 border border-green-200',
  Rejected: 'bg-red-100 text-red-700 border border-red-200',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">{children}</h2>
);

// ─── Static track stages builder ─────────────────────────────────────────────────
function buildStages(status: IssueStatus, reportedDate: string): TrackStage[] {
  const done4 = status === 'Resolved';
  const done3 = done4 || status === 'Assigned';
  const done2 = done3 || status === 'Under Review';
  return [
    { label: 'Issue Reported', done: true, time: `${reportedDate}, 09:00 AM`, icon: Send },
    { label: 'Supervisor Reviewed', done: done2, time: done2 ? `${reportedDate}, 10:30 AM` : undefined, icon: UserCheck },
    { label: 'Assigned For Resolution', done: done3, time: done3 ? `${reportedDate}, 11:00 AM` : undefined, icon: LocateFixed },
    { label: 'Issue Resolved', done: done4, time: done4 ? `${reportedDate}, 04:30 PM` : undefined, icon: CheckCheck },
  ];
}

// ─── Sample data ─────────────────────────────────────────────────────────────────
const issueTypeOptions = [
  'Machine Not Working', 'Machine Noise', 'Machine Vibration', 'Machine Overheating',
  'Material Shortage', 'Safety Concern', 'Quality Defect', 'Tool Damage',
  'Electrical Issue', 'Production Delay', 'Other',
];

const quickCategories = [
  { label: 'Machine Issue', icon: Cpu, color: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200/50 text-blue-900', iconColor: 'text-blue-600', type: 'Machine Not Working' },
  { label: 'Material Shortage', icon: Package, color: 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/50 text-amber-900', iconColor: 'text-amber-600', type: 'Material Shortage' },
  { label: 'Safety Concern', icon: Shield, color: 'bg-red-50/80 hover:bg-red-100/80 border-red-200/50 text-red-900', iconColor: 'text-red-600', type: 'Safety Concern' },
  { label: 'Quality Issue', icon: Star, color: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/50 text-purple-900', iconColor: 'text-purple-600', type: 'Quality Defect' },
  { label: 'Tool Damage', icon: Wrench, color: 'bg-orange-50/80 hover:bg-orange-100/80 border-orange-200/50 text-orange-900', iconColor: 'text-orange-600', type: 'Tool Damage' },
  { label: 'Other Issue', icon: CircleAlert, color: 'bg-gray-50/80 hover:bg-gray-100/80 border-gray-200/50 text-gray-900', iconColor: 'text-gray-600', type: 'Other' },
];

const initialIssues: Issue[] = [
  {
    id: 'ISS-2026-101', title: 'Machine Noise', type: 'Machine Noise', machine: 'MC-101', priority: 'High', status: 'Open',
    reportedDate: '12 Jun 2026', description: 'Machine MC-101 is producing abnormal noise during operation which may indicate a bearing issue.',
    supervisorRemarks: 'Maintenance team has been notified. Inspection scheduled for today.',
    trackStages: buildStages('Open', '12 Jun 2026'),
  },
  {
    id: 'ISS-2026-102', title: 'Material Shortage', type: 'Material Shortage', machine: 'Warehouse', priority: 'Medium', status: 'Under Review',
    reportedDate: '11 Jun 2026', description: 'Raw material stock is critically low, affecting production targets for this shift.',
    supervisorRemarks: 'Material request forwarded to the procurement team.',
    trackStages: buildStages('Under Review', '11 Jun 2026'),
  },
  {
    id: 'ISS-2026-103', title: 'Safety Concern', type: 'Safety Concern', machine: 'Assembly Area', priority: 'High', status: 'Resolved',
    reportedDate: '10 Jun 2026', description: 'Emergency exit near the assembly floor is blocked by equipment.',
    supervisorRemarks: 'Safety inspection completed. Exit has been cleared.',
    resolvedBy: 'Rahul Singh', resolvedDate: '10 Jun 2026',
    resolutionNotes: 'Equipment relocated. Exit pathway is now clear and compliant.',
    resolutionOutcome: 'Fully Resolved — Exit compliant with safety norms.',
    trackStages: buildStages('Resolved', '10 Jun 2026'),
  },
  {
    id: 'ISS-2026-104', title: 'Machine Overheating', type: 'Machine Overheating', machine: 'MC-103', priority: 'High', status: 'Assigned',
    reportedDate: '09 Jun 2026', description: 'MC-103 temperature rising beyond normal range during operation.',
    supervisorRemarks: 'Assigned to mechanical maintenance team.',
    trackStages: buildStages('Assigned', '09 Jun 2026'),
  },
  {
    id: 'ISS-2026-105', title: 'Quality Defect', type: 'Quality Defect', machine: 'MC-102', priority: 'Medium', status: 'Resolved',
    reportedDate: '08 Jun 2026', description: 'Output from MC-102 is showing surface defects not within tolerance.',
    resolvedBy: 'Rahul Singh', resolvedDate: '08 Jun 2026',
    resolutionNotes: 'Tool calibration corrected. QC check passed.',
    resolutionOutcome: 'Resolved — Production resumed at full quality.',
    trackStages: buildStages('Resolved', '08 Jun 2026'),
  },
  {
    id: 'ISS-2026-106', title: 'Tool Damage', type: 'Tool Damage', machine: 'MC-101', priority: 'Low', status: 'Rejected',
    reportedDate: '07 Jun 2026', description: 'Cutting tool appears worn. Requesting replacement.',
    supervisorRemarks: 'Tool is within acceptable wear limits. No replacement required at this time.',
    trackStages: buildStages('Open', '07 Jun 2026'),
  },
  {
    id: 'ISS-2026-107', title: 'Electrical Issue', type: 'Electrical Issue', machine: 'Panel B-2', priority: 'High', status: 'Resolved',
    reportedDate: '06 Jun 2026', description: 'Control panel B-2 is showing intermittent power fluctuations.',
    resolvedBy: 'Rahul Singh', resolvedDate: '06 Jun 2026',
    resolutionNotes: 'Faulty circuit breaker replaced by electrical team.',
    resolutionOutcome: 'Resolved — Panel operating normally.',
    trackStages: buildStages('Resolved', '06 Jun 2026'),
  },
  {
    id: 'ISS-2026-108', title: 'Production Delay', type: 'Production Delay', machine: 'Assembly Line 1', priority: 'Medium', status: 'Resolved',
    reportedDate: '05 Jun 2026', description: 'Assembly line 1 running at 60% capacity due to equipment slowdown.',
    resolvedBy: 'Rahul Singh', resolvedDate: '05 Jun 2026',
    resolutionNotes: 'Belt tension adjusted. Line restored to full capacity.',
    resolutionOutcome: 'Resolved — Assembly line at 100% capacity.',
    trackStages: buildStages('Resolved', '05 Jun 2026'),
  },
];

const initialActivities: ActivityItem[] = [
  { id: 1, label: 'ISS-2026-103 — Safety Concern resolved by Rahul Singh', time: '10 Jun, 04:30 PM', icon: CheckCircle2, color: 'text-green-500' },
  { id: 2, label: 'ISS-2026-104 — Machine Overheating assigned to maintenance', time: '09 Jun, 11:00 AM', icon: LocateFixed, color: 'text-purple-500' },
  { id: 3, label: 'ISS-2026-102 — Material Shortage acknowledged by Supervisor', time: '11 Jun, 10:30 AM', icon: Bell, color: 'text-indigo-500' },
  { id: 4, label: 'ISS-2026-101 — Machine Noise reported', time: '12 Jun, 09:00 AM', icon: AlertTriangle, color: 'text-orange-500' },
  { id: 5, label: 'ISS-2026-102 — Material Shortage reported', time: '11 Jun, 08:30 AM', icon: AlertTriangle, color: 'text-orange-500' },
];

const initialNotifications: Notification[] = [
  { id: 1, message: 'ISS-2026-103 — Your Safety Concern issue has been resolved.', time: '10 Jun, 04:30 PM', read: false, icon: CheckCircle2, color: 'text-green-500' },
  { id: 2, message: 'ISS-2026-104 — Your issue has been assigned to the maintenance team.', time: '09 Jun, 11:00 AM', read: false, icon: LocateFixed, color: 'text-purple-500' },
  { id: 3, message: 'ISS-2026-102 — Supervisor added remarks on your Material Shortage report.', time: '11 Jun, 10:30 AM', read: false, icon: MessageSquare, color: 'text-blue-500' },
  { id: 4, message: 'ISS-2026-105 — Quality Defect has been resolved.', time: '08 Jun, 05:00 PM', read: true, icon: CheckCircle2, color: 'text-green-500' },
];

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function IssueReportingPage() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Multi-step form state
  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({ title: '', type: '', task: '', machine: '', priority: 'Medium' as Priority, description: '' });
  const [newIssueId, setNewIssueId] = useState('');

  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const today = () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const openReportModal = (prefilledType = '') => {
    setStep(1);
    setSelectedCategory(prefilledType || '');
    setForm({ title: prefilledType || '', type: prefilledType, task: '', machine: '', priority: 'Medium', description: '' });
    setShowReportModal(true);
  };

  const handleCategorySelect = (type: string) => {
    setSelectedCategory(type);
    setForm(p => ({ ...p, type, title: type }));
    setStep(2);
  };

  const handleSubmit = () => {
    const id = `ISS-2026-${109 + issues.length - 7}`;
    const newIssue: Issue = {
      id,
      title: form.title,
      type: form.type,
      machine: form.machine || 'N/A',
      task: form.task,
      priority: form.priority,
      status: 'Open',
      reportedDate: today(),
      description: form.description,
      trackStages: buildStages('Open', today()),
    };
    setIssues(prev => [newIssue, ...prev]);
    setActivities(prev => [{ id: Date.now(), label: `${id} — ${form.title} reported`, time: `Today, ${now()}`, icon: AlertTriangle, color: 'text-orange-500' }, ...prev]);
    setNotifications(prev => [{ id: Date.now(), message: `${id} — Your issue has been submitted. Supervisor notified.`, time: `Today, ${now()}`, read: false, icon: Send, color: 'text-indigo-500' }, ...prev]);
    setNewIssueId(id);
    setStep('success');
  };

  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 900); };

  const filtered = issues.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.toLowerCase().includes(searchQuery.toLowerCase()) || i.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: issues.length,
    open: issues.filter(i => i.status === 'Open').length,
    underReview: issues.filter(i => i.status === 'Under Review').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
                Issue Reporting & Tracking
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-bold drop-shadow-lg mt-1">
                Report workplace issues and track their resolution status in real time.
              </p>
            </div>
            <button onClick={() => openReportModal()}
              className="flex-shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
              <AlertTriangle className="h-4 w-4" />
              Report New Issue
            </button>
          </div>
        </div>
      </header>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          { title: 'Total Issues Reported', value: counts.total, desc: 'Issues reported by you', icon: ClipboardList, color: 'from-blue-500 to-indigo-600' },
          { title: 'Open Issues', value: counts.open, desc: 'Awaiting review', icon: AlertTriangle, color: 'from-orange-500 to-amber-500' },
          { title: 'Under Review', value: counts.underReview, desc: 'Currently being investigated', icon: Activity, color: 'from-purple-500 to-violet-600' },
          { title: 'Resolved Issues', value: counts.resolved, desc: 'Successfully resolved', icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
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

      {/* ── Quick Categories ── */}
      <Card>
        <SectionTitle>Report Issue Quickly</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickCategories.map(cat => (
            <button key={cat.label} onClick={() => openReportModal(cat.type)}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl text-xs font-semibold text-center transition-all duration-200 hover:shadow-lg hover:scale-105 ${cat.color} border`}>
              <cat.icon className={`h-7 w-7 ${cat.iconColor}`} />
              {cat.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Issues Table ── */}
      <Card>
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search Issue..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 placeholder:text-gray-400" />
            </div>
            <button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'Open', 'Under Review', 'Assigned', 'Resolved', 'Rejected'] as const).map(f => (
              <button key={f} onClick={() => setStatusFilter(f as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                  ${statusFilter === f ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
                {f === 'all' ? 'All Issues' : f}
              </button>
            ))}
          </div>
        </div>

        <SectionTitle>My Reported Issues</SectionTitle>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50/80">
                {['Issue ID', 'Issue Title', 'Issue Type', 'Related Machine', 'Priority', 'Status', 'Reported Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400 italic">No issues found.</td></tr>
              )}
              {filtered.map(issue => (
                <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-bold text-gray-500">{issue.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{issue.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">{issue.type}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">{issue.machine}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge[issue.priority]}`}>{issue.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[issue.status]}`}>{issue.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">{issue.reportedDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setSelectedIssue(issue); setShowDetailsModal(true); }}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button onClick={() => { setSelectedIssue(issue); setShowTrackModal(true); }}
                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                        <MapPin className="h-3.5 w-3.5" /> Track
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Notifications + Activities ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Notifications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Issue Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">{unreadCount} new</span>
            )}
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 4).map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${n.read ? 'bg-gray-50/40 border-gray-100' : 'bg-indigo-50/50 border-indigo-100'}`}>
                <div className={`p-1.5 rounded-full bg-white shadow-sm ${n.color} flex-shrink-0`}>
                  <n.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 leading-tight">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5"></span>}
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <SectionTitle>Recent Issue Activities</SectionTitle>
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
      </div>

      {/* ── Quick Actions ── */}
      <Card>
        <SectionTitle>Quick Actions</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Report New Issue', icon: AlertTriangle, col: 'bg-orange-50/80 hover:bg-orange-100/80 border-orange-200/50 text-orange-900', ic: 'text-orange-600', onClick: () => openReportModal() },
            { label: 'View Open Issues', icon: ClipboardList, col: 'bg-red-50/80 hover:bg-red-100/80 border-red-200/50 text-red-900', ic: 'text-red-600', onClick: () => setStatusFilter('Open') },
            { label: 'Track Issue Status', icon: MapPin, col: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/50 text-purple-900', ic: 'text-purple-600', onClick: () => setStatusFilter('all') },
            { label: 'View Resolved', icon: CheckCircle2, col: 'bg-green-50/80 hover:bg-green-100/80 border-green-200/50 text-green-900', ic: 'text-green-600', onClick: () => setStatusFilter('Resolved') },
          ].map(action => (
            <button key={action.label} onClick={action.onClick}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl text-xs font-semibold text-center transition-all duration-200 hover:shadow-lg cursor-pointer ${action.col} border`}>
              <action.icon className={`h-6 w-6 ${action.ic}`} />
              {action.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ─────────────── MODALS ─────────────── */}

      {/* ── Multi-Step Report Modal ── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Report New Issue</h3>
                {step !== 'success' && (
                  <div className="flex items-center gap-2 mt-1.5">
                    {([1, 2, 3] as const).map(s => (
                      <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${step >= s ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">Step {step} of 3</span>
                  </div>
                )}
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* ── Step 1: Category ── */}
            {step === 1 && (
              <div className="p-5">
                <p className="text-sm text-gray-600 font-medium mb-4">Select the issue category to continue.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Machine Issue', icon: Cpu, type: 'Machine Not Working' },
                    { label: 'Material Shortage', icon: Package, type: 'Material Shortage' },
                    { label: 'Safety Concern', icon: Shield, type: 'Safety Concern' },
                    { label: 'Quality Issue', icon: Star, type: 'Quality Defect' },
                    { label: 'Tool Damage', icon: Wrench, type: 'Tool Damage' },
                    { label: 'Other Issue', icon: CircleAlert, type: 'Other' },
                  ].map(cat => (
                    <button key={cat.type}
                      onClick={() => handleCategorySelect(cat.type)}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl text-sm font-semibold text-left transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                        ${selectedCategory === cat.type ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-gray-200 hover:border-indigo-300 text-gray-700'}`}>
                      <cat.icon className={`h-5 w-5 flex-shrink-0 ${selectedCategory === cat.type ? 'text-indigo-600' : 'text-gray-500'}`} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Details Form ── */}
            {step === 2 && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-xs text-indigo-600 font-bold">Category:</span>
                  <span className="text-xs text-indigo-800 font-semibold">{form.type}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Issue Title <span className="text-red-500">*</span></label>
                  <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    placeholder="Brief title for the issue..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Issue Type <span className="text-red-500">*</span></label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
                    {issueTypeOptions.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Related Task <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input value={form.task} onChange={e => setForm(p => ({ ...p, task: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    placeholder="e.g. TSK-101" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Related Machine <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input value={form.machine} onChange={e => setForm(p => ({ ...p, machine: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    placeholder="e.g. MC-101, Warehouse, Assembly Area" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Priority <span className="text-red-500">*</span></label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
                    {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    placeholder="Describe what happened, when, and where..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Attach Evidence <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:border-indigo-400 transition-colors">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Upload image, PDF, document, or video</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    disabled={!form.title || !form.description}
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div className="p-5 space-y-4">
                <p className="text-sm text-gray-600 font-medium">Review your issue report before submitting.</p>
                <div className="p-4 bg-gray-50 rounded-xl space-y-2.5">
                  {[
                    { label: 'Issue Title', value: form.title },
                    { label: 'Issue Type', value: form.type },
                    { label: 'Related Machine', value: form.machine || '—' },
                    { label: 'Related Task', value: form.task || '—' },
                    { label: 'Priority', value: form.priority },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-start gap-4">
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{row.label}</span>
                      <span className="text-xs font-semibold text-gray-800 text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{form.description}</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="text-xs text-yellow-700 font-medium">Once submitted, this report cannot be edited. Your supervisor will be notified immediately.</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={handleSubmit}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105">
                    <Send className="h-4 w-4" /> Submit Issue
                  </button>
                </div>
              </div>
            )}

            {/* ── Success Screen ── */}
            {step === 'success' && (
              <div className="p-8 flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-14 w-14 text-green-500" />
                </div>
                <h3 className="text-xl font-black text-green-700">Issue Reported Successfully!</h3>
                <div className="p-4 bg-gray-50 rounded-xl w-full space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 font-medium">Issue ID</span>
                    <span className="text-xs font-bold text-gray-800 font-mono">{newIssueId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 font-medium">Status</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">Open</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 font-medium">Assigned To</span>
                    <span className="text-xs font-semibold text-gray-800">Department Supervisor</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Supervisor has been notified. You can track the status below.</p>
                <button onClick={() => { setShowReportModal(false); setStatusFilter('Open'); }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  Track Issue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Issue Details Modal ── */}
      {showDetailsModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Issue Details</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{selectedIssue.id}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-xl border ${statusBadge[selectedIssue.status]}`}>
                <span className="text-sm font-bold">Status: {selectedIssue.status}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge[selectedIssue.priority]}`}>{selectedIssue.priority} Priority</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-2.5">
                {[
                  { label: 'Issue ID', value: selectedIssue.id },
                  { label: 'Issue Title', value: selectedIssue.title },
                  { label: 'Issue Type', value: selectedIssue.type },
                  { label: 'Related Machine', value: selectedIssue.machine },
                  { label: 'Related Task', value: selectedIssue.task || '—' },
                  { label: 'Reported Date', value: selectedIssue.reportedDate },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-start gap-4">
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{row.label}</span>
                    <span className="text-xs font-semibold text-gray-800 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedIssue.description}</p>
              </div>
              {selectedIssue.supervisorRemarks && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-600 font-bold mb-1 flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Supervisor Remarks</p>
                  <p className="text-sm text-blue-700">{selectedIssue.supervisorRemarks}</p>
                </div>
              )}
              {selectedIssue.status === 'Resolved' && selectedIssue.resolvedBy && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl space-y-2">
                  <p className="text-xs text-green-700 font-bold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Resolution Details</p>
                  {[
                    { label: 'Resolved By', value: selectedIssue.resolvedBy },
                    { label: 'Resolution Date', value: selectedIssue.resolvedDate || '' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-xs text-gray-500 font-medium">{r.label}</span>
                      <span className="text-xs font-semibold text-gray-800">{r.value}</span>
                    </div>
                  ))}
                  {selectedIssue.resolutionNotes && <><p className="text-xs text-gray-500 font-medium">Resolution Notes</p><p className="text-sm text-gray-700">{selectedIssue.resolutionNotes}</p></>}
                  {selectedIssue.resolutionOutcome && <><p className="text-xs text-gray-500 font-medium">Outcome</p><p className="text-sm font-semibold text-green-700">{selectedIssue.resolutionOutcome}</p></>}
                </div>
              )}
              {selectedIssue.status === 'Rejected' && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs text-red-600 font-bold mb-1">Issue Rejected</p>
                  <p className="text-sm text-red-700">{selectedIssue.supervisorRemarks || 'Issue was reviewed and rejected by supervisor.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Track Status Modal ── */}
      {showTrackModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Track Issue Status</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{selectedIssue.id}</p>
              </div>
              <button onClick={() => setShowTrackModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-gray-800">{selectedIssue.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[selectedIssue.status]}`}>{selectedIssue.status}</span>
              </div>
              {/* Timeline */}
              <div className="space-y-0">
                {selectedIssue.trackStages.map((stage, i) => (
                  <div key={stage.label} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md flex-shrink-0
                        ${stage.done ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gray-200'}`}>
                        <stage.icon className={`h-4 w-4 ${stage.done ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      {i < selectedIssue.trackStages.length - 1 && (
                        <div className={`w-0.5 h-10 mt-1 ${stage.done ? 'bg-emerald-300' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className={`text-sm font-semibold ${stage.done ? 'text-gray-800' : 'text-gray-400'}`}>{stage.label}</p>
                      {stage.time && <p className="text-xs text-gray-400 mt-0.5">{stage.time}</p>}
                      {!stage.done && <p className="text-xs text-gray-300 mt-0.5 italic">Pending</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
