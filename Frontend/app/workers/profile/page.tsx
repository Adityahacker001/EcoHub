'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Bell,
  LogIn,
  LogOut,
  Play,
  Send,
  Eye,
  EyeOff,
  Edit3,
  X,
  Lock,
  Key,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Building,
  Briefcase,
  HeartPulse,
  ChevronRight,
  Star,
} from 'lucide-react';

// ─── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-base sm:text-lg font-semibold text-gray-800 mb-4 ${className}`}>{children}</h2>
);

// ─── Initials Avatar ────────────────────────────────────────────────────────────
function InitialsAvatar({ name, size = 'lg' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-4xl',
  };
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-xl ring-4 ring-white/50 flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────────
function InfoRow({ label, value, editable = false }: { label: string; value: string; editable?: boolean }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`text-xs sm:text-sm font-semibold text-right ${editable ? 'text-gray-800' : 'text-gray-500'}`}>{value}</span>
        {!editable && <Lock className="h-3 w-3 text-gray-300 flex-shrink-0" />}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function WorkerProfilePage() {
  // Editable profile fields
  const [profile, setProfile] = useState({
    phone: '+91 98765 43210',
    address: '12, MG Road, Sector 5, Noida, UP - 201301',
    emergencyName: 'Sunita Kumar',
    emergencyPhone: '+91 99887 76543',
  });
  const [editDraft, setEditDraft] = useState({ ...profile });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPw: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...editDraft });
    setEditSuccess(true);
    setTimeout(() => { setShowEditModal(false); setEditSuccess(false); }, 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPw !== passwordForm.confirm) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordForm.newPw.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    setPasswordError('');
    setPasswordSuccess(true);
    setTimeout(() => { setShowPasswordModal(false); setPasswordSuccess(false); setPasswordForm({ current: '', newPw: '', confirm: '' }); }, 2200);
  };

  const activities = [
    { id: 1, label: 'TSK-105 — Quality Verification approved by Supervisor', time: '10:30 AM', icon: CheckCircle2, color: 'text-green-500' },
    { id: 2, label: 'Issue reported — Machine Noise on MC-101', time: '10:00 AM', icon: AlertTriangle, color: 'text-orange-500' },
    { id: 3, label: 'TSK-103 — Packaging Support submitted for review', time: '09:45 AM', icon: Send, color: 'text-purple-500' },
    { id: 4, label: 'TSK-102 — Material Loading started', time: '09:15 AM', icon: Play, color: 'text-blue-500' },
    { id: 5, label: 'Directive Viewed — Mandatory Safety Check', time: '08:50 AM', icon: Bell, color: 'text-violet-500' },
    { id: 6, label: 'Checked In — Morning Shift', time: '08:05 AM', icon: LogIn, color: 'text-green-500' },
  ];

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
                My Profile
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-bold drop-shadow-lg mt-1">
                View and manage your personal information, work details, attendance, and task performance.
              </p>
            </div>
            <button
              onClick={() => { setEditDraft({ ...profile }); setShowEditModal(true); }}
              className="flex-shrink-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </header>

      {/* ── Profile Overview ── */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <InitialsAvatar name="Amit Kumar" size="xl" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-black text-gray-800">Amit Kumar</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">EMP-201 · Assembly Department</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold">Worker</span>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold">Morning Shift</span>
            </div>
          </div>
          {/* Quick stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-3 text-center sm:text-right">
            <div>
              <p className="text-2xl font-black text-indigo-600">96%</p>
              <p className="text-xs text-gray-500 font-medium">Attendance</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">94%</p>
              <p className="text-xs text-gray-500 font-medium">Task Rate</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Personal Info + Work Info ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Personal Info */}
        <Card>
          <SectionTitle>Personal Information</SectionTitle>
          <div className="space-y-1">
            <InfoRow label="Full Name" value="Amit Kumar" editable={false} />
            <InfoRow label="Email Address" value="amit.kumar@ecohub.in" editable={false} />
            <InfoRow label="Phone Number" value={profile.phone} editable />
            <InfoRow label="Gender" value="Male" editable={false} />
            <InfoRow label="Date of Birth" value="15 March 1995" editable={false} />
            <InfoRow label="Address" value={profile.address} editable />
            <InfoRow label="Emergency Contact" value={profile.emergencyName} editable />
            <InfoRow label="Emergency Phone" value={profile.emergencyPhone} editable />
          </div>
          <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
            <Lock className="h-3 w-3" /> Locked fields are managed by Admin.
          </p>
        </Card>

        {/* Work Info */}
        <Card>
          <SectionTitle>Work Information</SectionTitle>
          <div className="space-y-1">
            <InfoRow label="Employee ID" value="EMP-201" editable={false} />
            <InfoRow label="Role" value="Worker" editable={false} />
            <InfoRow label="Department" value="Assembly" editable={false} />
            <InfoRow label="Assigned Supervisor" value="Rahul Singh" editable={false} />
            <InfoRow label="Assigned Machine" value="MC-101 — CNC Machine" editable={false} />
            <InfoRow label="Current Shift" value="Morning Shift (08:00 AM – 04:00 PM)" editable={false} />
            <InfoRow label="Joining Date" value="01 April 2022" editable={false} />
            <InfoRow label="Employment Status" value="Active" editable={false} />
          </div>
          <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
            <Lock className="h-3 w-3" /> All work fields are managed by Admin / Supervisor.
          </p>
        </Card>
      </div>

      {/* ── Attendance Summary + Task Performance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Attendance Summary */}
        <Card>
          <SectionTitle>Attendance Summary</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Present Days', value: '24', icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
              { label: 'Absent Days', value: '1', icon: X, color: 'from-red-500 to-rose-600' },
              { label: 'Leave Days', value: '0', icon: Calendar, color: 'from-amber-500 to-orange-500' },
              { label: 'Attendance Rate', value: '96%', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
            ].map(card => (
              <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-white shadow-lg`}>
                <div className="flex items-start justify-between mb-1">
                  <card.icon className="h-4 w-4 opacity-80" />
                  <span className="text-2xl font-black">{card.value}</span>
                </div>
                <p className="text-xs font-semibold opacity-90">{card.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Task Performance */}
        <Card>
          <SectionTitle>Task Performance</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Assigned', value: '25', icon: ClipboardList, color: 'from-blue-500 to-indigo-600' },
              { label: 'Completed', value: '22', icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
              { label: 'Pending', value: '3', icon: Clock, color: 'from-amber-500 to-orange-500' },
              { label: 'Completion Rate', value: '94%', icon: TrendingUp, color: 'from-purple-500 to-violet-600' },
            ].map(card => (
              <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-white shadow-lg`}>
                <div className="flex items-start justify-between mb-1">
                  <card.icon className="h-4 w-4 opacity-80" />
                  <span className="text-2xl font-black">{card.value}</span>
                </div>
                <p className="text-xs font-semibold opacity-90">{card.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Assigned Machine + Active Directives ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Assigned Machine */}
        <Card>
          <SectionTitle>Assigned Machine</SectionTitle>
          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
              <Cpu className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 space-y-2.5">
              {[
                { label: 'Machine ID', value: 'MC-101' },
                { label: 'Machine Name', value: 'CNC Machine' },
                { label: 'Machine Type', value: 'Cutting Machine' },
                { label: 'Department', value: 'Assembly' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-xs text-gray-500 font-medium">{r.label}</span>
                  <span className="text-xs font-semibold text-gray-800">{r.value}</span>
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
          <p className="mt-3 text-xs text-gray-400 italic flex items-center gap-1">
            <Lock className="h-3 w-3" /> View only — contact supervisor for changes.
          </p>
        </Card>

        {/* Active Directives */}
        <Card>
          <SectionTitle>Active Directives</SectionTitle>
          <div className="space-y-3">
            {[
              { title: 'Mandatory Safety Check', priority: 'High', due: 'Due Today', pColor: 'bg-red-100 text-red-700 border-red-200', barColor: 'border-l-red-400' },
              { title: 'Machine Inspection Drive', priority: 'Medium', due: 'Due Tomorrow', pColor: 'bg-yellow-100 text-yellow-700 border-yellow-200', barColor: 'border-l-yellow-400' },
              { title: 'PPE Compliance Verification', priority: 'Low', due: 'Due This Week', pColor: 'bg-green-100 text-green-700 border-green-200', barColor: 'border-l-green-400' },
            ].map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-3 bg-gray-50/60 rounded-xl border-l-4 ${d.barColor} border border-gray-100`}>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{d.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.due}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${d.pColor}`}>{d.priority}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Recent Activities + Account Security ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <Card>
          <SectionTitle>Recent Activities</SectionTitle>
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

        {/* Account Security */}
        <Card>
          <SectionTitle>Account Security</SectionTitle>
          <div className="space-y-1 mb-5">
            <InfoRow label="Username" value="amit.kumar" editable={false} />
            <InfoRow label="Last Login" value="07 Jun 2026, 08:05 AM" editable={false} />
            <InfoRow label="Password Status" value="Strong ✅" editable={false} />
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Key className="h-4 w-4" />
              Change Password
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              Your account is secured. Use a strong password and never share your credentials.
            </p>
          </div>
        </Card>
      </div>

      {/* ─────────────── MODALS ─────────────── */}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Edit Profile</h3>
                <p className="text-xs text-gray-400 mt-0.5">Only personal contact details can be updated.</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {editSuccess ? (
              <div className="p-12 flex flex-col items-center gap-3">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <p className="text-lg font-bold text-green-700">Profile Updated Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
                {/* Read-only preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <InitialsAvatar name="Amit Kumar" size="md" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Amit Kumar</p>
                    <p className="text-xs text-gray-500">EMP-201 · Assembly · Worker</p>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="text-xs text-yellow-700 font-medium flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Employee ID, Role, Department, Machine, and Shift cannot be edited here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input value={editDraft.phone} onChange={e => setEditDraft(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address</label>
                  <textarea rows={2} value={editDraft.address} onChange={e => setEditDraft(p => ({ ...p, address: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    placeholder="Your current address..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Emergency Contact Name</label>
                  <input value={editDraft.emergencyName} onChange={e => setEditDraft(p => ({ ...p, emergencyName: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    placeholder="Full name of emergency contact" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Emergency Contact Number</label>
                  <input value={editDraft.emergencyPhone} onChange={e => setEditDraft(p => ({ ...p, emergencyPhone: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    placeholder="+91 XXXXX XXXXX" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {passwordSuccess ? (
              <div className="p-12 flex flex-col items-center gap-3">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <p className="text-lg font-bold text-green-700">Password Changed Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="p-5 space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">{passwordError}</div>
                )}
                {[
                  { label: 'Current Password', key: 'current', show: showCurrentPw, toggle: () => setShowCurrentPw(p => !p) },
                  { label: 'New Password', key: 'newPw', show: showNewPw, toggle: () => setShowNewPw(p => !p) },
                  { label: 'Confirm New Password', key: 'confirm', show: showConfirmPw, toggle: () => setShowConfirmPw(p => !p) },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        required
                        value={(passwordForm as any)[field.key]}
                        onChange={e => setPasswordForm(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-400">Password must be at least 8 characters.</p>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
