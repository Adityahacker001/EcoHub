"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import IntegratedLoader from "@/components/layout/IntegratedLoader";

import {
  User,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  FileText,
  Upload,
  Settings,
  CheckCircle,
  AlertTriangle,
  FileUp,
  Save,
  XCircle,
  Activity,
  LifeBuoy,
  FileBadge,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Shield,
  Globe,
  Lock,
  BellRing,
  Key,
  ShieldAlert,
  Download,
  Pencil,
  ClipboardList,
  Briefcase,
  AlertCircle,
  Calendar,
  Eye,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface PersonalInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
}

interface ProfessionalInfo {
  employeeId: string;
  role: string;
  department: string;
  joiningDate: string;
  reportingTo: string;
  workLocation: string;
}

interface PerformanceMetric {
  title: string;
  value: string;
  subtitle: string;
  percentage: number;
  icon: any;
  color: string;
}

interface Directive {
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status: "In Progress" | "Pending" | "Completed";
}

interface ActivityLog {
  action: string;
  time: string;
  icon: any;
  color: string;
}

interface DocumentInfo {
  name: string;
  uploadDate: string;
  fileSize: string;
}

export default function ManagerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Profile fields state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "Rahul Singh",
    email: "rahul@ecohub.com",
    phoneNumber: "9876543210",
    gender: "Male",
    dateOfBirth: "12 Jan 1990",
    address: "Delhi, India",
    emergencyContact: "9876543212"
  });

  // Edit buffer to allow canceling changes
  const [editBuffer, setEditBuffer] = useState<PersonalInfo>({ ...personalInfo });

  // Read-only professional info
  const professionalInfo: ProfessionalInfo = {
    employeeId: "EMP-1001",
    role: "Manager",
    department: "Production",
    joiningDate: "01 Jan 2024",
    reportingTo: "Admin",
    workLocation: "Factory Unit A"
  };

  // Performance KPI Card data
  const performanceMetrics: PerformanceMetric[] = [
    {
      title: "Production Target Achievement",
      value: "92%",
      subtitle: "Avg. target hit rate",
      percentage: 92,
      icon: Target,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Directives Completed",
      value: "18",
      subtitle: "Out of 20 assigned",
      percentage: 90,
      icon: ClipboardList,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Team Attendance",
      value: "95%",
      subtitle: "Present today",
      percentage: 95,
      icon: Users,
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Department Efficiency",
      value: "89%",
      subtitle: "Target: 90%",
      percentage: 89,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600"
    }
  ];

  // Responsibilities
  const responsibilities = [
    "Production Monitoring",
    "Machine Performance Tracking",
    "Workforce Supervision",
    "Production Reporting",
    "Quality Compliance",
    "Operational Planning"
  ];

  // Active Directives
  const directives: Directive[] = [
    {
      title: "Increase Production Target by 10%",
      priority: "High",
      dueDate: "20 Jun 2026",
      status: "In Progress"
    },
    {
      title: "Machine Inspection Drive",
      priority: "Medium",
      dueDate: "18 Jun 2026",
      status: "Pending"
    }
  ];

  // Account security
  const [securityInfo, setSecurityInfo] = useState({
    username: "rahul.manager",
    lastLogin: "12 Jun 2026, 09:30 AM",
    passwordStatus: "Protected",
    twoFactorEnabled: false
  });

  // Recent activity logs
  const activityLogs: ActivityLog[] = [
    { action: "Logged into system", time: "10 mins ago", icon: ShieldCheck, color: "text-blue-500 bg-blue-50" },
    { action: "Generated Production Report", time: "2 hours ago", icon: FileText, color: "text-green-500 bg-green-50" },
    { action: "Reviewed Machine Analytics", time: "4 hours ago", icon: BarChart3, color: "text-indigo-500 bg-indigo-50" },
    { action: "Approved Production Update", time: "1 day ago", icon: CheckCircle, color: "text-emerald-500 bg-emerald-50" },
    { action: "Viewed Attendance Report", time: "1 day ago", icon: Users, color: "text-purple-500 bg-purple-50" },
    { action: "Updated Department Performance Review", time: "2 days ago", icon: Settings, color: "text-amber-500 bg-amber-50" }
  ];

  // Documents
  const documents: DocumentInfo[] = [
    { name: "Employment Letter", uploadDate: "01 Jan 2024", fileSize: "1.2 MB" },
    { name: "Manager ID Card", uploadDate: "02 Jan 2024", fileSize: "450 KB" },
    { name: "Performance Reports", uploadDate: "05 Jun 2026", fileSize: "3.4 MB" },
    { name: "Training Certificates", uploadDate: "15 Apr 2025", fileSize: "2.1 MB" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle toast timers
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Edit actions
  const startEditing = () => {
    setEditBuffer({ ...personalInfo });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveChanges = () => {
    setPersonalInfo({ ...editBuffer });
    setIsEditing(false);
    setToast("Profile updated successfully");
  };

  const triggerMockDownload = (docName: string) => {
    setToast(`Downloading ${docName}...`);
    // Create a mock text file download to trigger an actual browser save dialog
    const element = document.createElement("a");
    const file = new Blob([`Mock PDF content for ${docName}\nEmployee: Rahul Singh\nEmployee ID: EMP-1001\nPlatform: Eco-Innovator Hub`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${docName.replace(/\s+/g, '_')}_EMP1001.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePasswordChange = () => {
    setToast("Password reset request sent to Admin approval queue.");
  };

  const toggle2FA = () => {
    setSecurityInfo(prev => {
      const nextVal = !prev.twoFactorEnabled;
      setToast(nextVal ? "Two-Factor Authentication Enabled" : "Two-Factor Authentication Disabled");
      return { ...prev, twoFactorEnabled: nextVal };
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <IntegratedLoader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700/50 animate-slideInRight">
          <div className="bg-emerald-500 text-white rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="space-y-1 sm:space-y-2 relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg leading-tight">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl">
            Manage your personal information, department details, responsibilities, and account settings.
          </p>
        </div>
        
        {/* Actions Button */}
        <div className="relative z-10 w-full lg:w-auto flex justify-end gap-2.5">
          {!isEditing ? (
            <Button
              onClick={startEditing}
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={cancelEditing}
                className="flex-1 sm:flex-initial px-5 py-2.5 border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={saveChanges}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Overview Section */}
      <section>
        <Card className="overflow-hidden border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />
            
            {/* Avatar initials block with status badge */}
            <div className="relative flex-shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-650 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl border-4 border-white transform transition-transform duration-300 group-hover:scale-[1.02]">
                {personalInfo.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white px-2.5 py-0.5 rounded-full border-2 border-white shadow text-2xs sm:text-xs font-black tracking-wide animate-pulse">
                Active
              </div>
            </div>

            {/* Manager Details Grid */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 leading-tight">
                  {personalInfo.fullName}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-1">
                  <Badge className="bg-blue-500/10 hover:bg-blue-500/15 text-blue-700 font-bold border border-blue-200/50 text-xs py-0.5 px-2.5 rounded-full">
                    Factory Manager
                  </Badge>
                  <Badge className="bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-700 font-bold border border-indigo-200/50 text-xs py-0.5 px-2.5 rounded-full">
                    Production Department
                  </Badge>
                </div>
              </div>

              {/* Badges details grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 bg-slate-50/70 border border-slate-100 rounded-xl p-3 sm:p-4 text-left">
                <div className="space-y-0.5">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Employee ID</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">{professionalInfo.employeeId}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Work Location</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">{professionalInfo.workLocation}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Department</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">Production</p>
                </div>
                <div className="space-y-0.5 col-span-2 md:col-span-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Account Status</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <p className="text-xs sm:text-sm font-bold text-green-700">Active Profile</p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </Card>
      </section>

      {/* Personal & Professional Info Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Personal Information */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 sm:pt-6">
              {/* Full Name - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Full Name</p>
                <p className="text-sm sm:text-base font-bold text-slate-700">{personalInfo.fullName}</p>
              </div>

              {/* Email Address - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Email Address</p>
                <p className="text-sm sm:text-base font-bold text-slate-700">{personalInfo.email}</p>
              </div>

              {/* Phone Number - Editable */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Phone Number {isEditing && <span className="text-indigo-500 font-bold text-2xs">(Editable)</span>}
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editBuffer.phoneNumber}
                    onChange={(e) => setEditBuffer({ ...editBuffer, phoneNumber: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                ) : (
                  <p className="text-sm sm:text-base font-bold text-slate-700">{personalInfo.phoneNumber}</p>
                )}
              </div>

              {/* Gender - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Gender</p>
                <p className="text-sm sm:text-base font-bold text-slate-700">{personalInfo.gender}</p>
              </div>

              {/* Date of Birth - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Date of Birth</p>
                <p className="text-sm sm:text-base font-bold text-slate-700">{personalInfo.dateOfBirth}</p>
              </div>

              {/* Emergency Contact - Editable */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Emergency Contact {isEditing && <span className="text-indigo-500 font-bold text-2xs">(Editable)</span>}
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editBuffer.emergencyContact}
                    onChange={(e) => setEditBuffer({ ...editBuffer, emergencyContact: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                ) : (
                  <p className="text-sm sm:text-base font-bold text-slate-700">{personalInfo.emergencyContact}</p>
                )}
              </div>

              {/* Address - Editable (Full width grid col) */}
              <div className="space-y-1 sm:col-span-2">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Address {isEditing && <span className="text-indigo-500 font-bold text-2xs">(Editable)</span>}
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editBuffer.address}
                    onChange={(e) => setEditBuffer({ ...editBuffer, address: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                ) : (
                  <p className="text-sm sm:text-base font-bold text-slate-700">{personalInfo.address}</p>
                )}
              </div>
            </CardContent>
          </div>
          {isEditing && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 rounded-b-2xl">
              <Button size="sm" variant="outline" onClick={cancelEditing} className="text-xs font-bold">Cancel</Button>
              <Button size="sm" onClick={saveChanges} className="text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600">Save Personal Details</Button>
            </div>
          )}
        </Card>

        {/* Professional Information */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Building2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 sm:pt-6">
              {/* Employee ID - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Employee ID <span className="text-slate-300 font-bold text-2xs">(Read Only)</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-650 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{professionalInfo.employeeId}</p>
              </div>

              {/* Role - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Role <span className="text-slate-300 font-bold text-2xs">(Read Only)</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-650 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{professionalInfo.role}</p>
              </div>

              {/* Department - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Department <span className="text-slate-300 font-bold text-2xs">(Read Only)</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-650 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{professionalInfo.department}</p>
              </div>

              {/* Joining Date - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Joining Date <span className="text-slate-300 font-bold text-2xs">(Read Only)</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-650 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{professionalInfo.joiningDate}</p>
              </div>

              {/* Reporting To - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Reporting To <span className="text-slate-300 font-bold text-2xs">(Read Only)</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-650 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{professionalInfo.reportingTo}</p>
              </div>

              {/* Work Location - Read Only */}
              <div className="space-y-1">
                <p className="text-3xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  Work Location <span className="text-slate-300 font-bold text-2xs">(Read Only)</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-650 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{professionalInfo.workLocation}</p>
              </div>
            </CardContent>
          </div>
          {/* Helpful ERP Note */}
          <div className="px-6 py-3 bg-indigo-50/40 border-t border-slate-100 flex items-center gap-2 rounded-b-2xl">
            <AlertCircle className="h-4 w-4 text-indigo-600 flex-shrink-0" />
            <p className="text-2xs text-slate-500 font-medium">To modify professional details, please contact system administrator.</p>
          </div>
        </Card>
      </section>

      {/* Performance Summary Section */}
      <section className="space-y-4">
        <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-1 flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-500" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="border border-slate-100/50 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 line-clamp-1">{metric.title}</p>
                      <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{metric.value}</p>
                      <p className="text-3xs font-medium text-slate-500 mt-0.5">{metric.subtitle}</p>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-indigo-600 rounded-xl">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-3xs font-bold text-slate-500">
                      <span>Progress</span>
                      <span>{metric.percentage}%</span>
                    </div>
                    <Progress value={metric.percentage} className="h-2 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Responsibilities and Active Directives Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Assigned Responsibilities */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Assigned Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/70 border border-slate-100 rounded-xl hover:bg-indigo-50/20 hover:border-indigo-100/50 transition-all duration-300">
                  <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-3xs font-black">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700">{resp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Directives */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Assigned Directives
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {directives.map((dir, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-3.5">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-850 text-xs sm:text-sm">{dir.title}</h4>
                  <p className="text-3xs text-slate-400 font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Due Date: {dir.dueDate}
                  </p>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  <Badge className={cn(
                    "text-3xs font-black px-2 py-0.5 rounded-full border",
                    dir.priority === "High" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"
                  )}>
                    {dir.priority} Priority
                  </Badge>
                  <Badge className={cn(
                    "text-3xs font-black px-2 py-0.5 rounded-full border",
                    dir.status === "In Progress" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"
                  )}>
                    {dir.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Account Security and Recent Activity Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Account Security */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-800">
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Username</p>
                  <p className="text-sm sm:text-base font-bold text-slate-700">{securityInfo.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Last Login</p>
                  <p className="text-sm sm:text-base font-bold text-slate-700">{securityInfo.lastLogin}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-3xs uppercase tracking-wider font-bold text-slate-400">Password Status</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm sm:text-base font-bold text-slate-700">{securityInfo.passwordStatus}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-700 text-3xs font-black border border-emerald-200">Strong</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
          {/* Action Security Buttons */}
          <div className="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 flex flex-wrap gap-2.5 rounded-b-2xl">
            <Button
              onClick={handlePasswordChange}
              variant="outline"
              size="sm"
              className="text-xs font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm"
            >
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button
              onClick={toggle2FA}
              variant="outline"
              size="sm"
              className={cn(
                "text-xs font-bold border shadow-sm",
                securityInfo.twoFactorEnabled 
                  ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" 
                  : "border-slate-200 text-slate-750 hover:bg-slate-50"
              )}
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              {securityInfo.twoFactorEnabled ? "Disable 2FA" : "Enable Two-Factor Authentication"}
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-slate-100/50 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100/60 pb-3 flex flex-row items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Activity className="h-5 w-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-black text-slate-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="relative pl-6 space-y-4 border-l border-slate-100/80 py-1">
              {activityLogs.map((log, i) => {
                const Icon = log.icon;
                return (
                  <div key={i} className="relative">
                    <span className="absolute -left-[31px] top-1 bg-white border-4 border-indigo-500 h-4 w-4 rounded-full shadow-sm"></span>
                    <div className="flex justify-between items-start gap-4 hover:bg-slate-50/50 rounded-lg p-1 -m-1 transition-all duration-300">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-700 text-xs sm:text-sm">{log.action}</h4>
                        <p className="text-3xs text-slate-450 font-medium">EcoHub Manager Portal</p>
                      </div>
                      <span className="text-3xs text-slate-400 font-bold whitespace-nowrap">{log.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Documents Section */}
      <section className="space-y-4">
        <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-1 flex items-center gap-2">
          <FileBadge className="h-5 w-5 text-indigo-500" />
          Documents
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {documents.map((doc, idx) => (
            <Card key={idx} className="border border-slate-100/50 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{doc.name}</h4>
                    <p className="text-3xs text-slate-400 mt-1 font-semibold">Uploaded: {doc.uploadDate}</p>
                    <p className="text-3xs text-indigo-500 font-bold mt-0.5">{doc.fileSize} • PDF Format</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => triggerMockDownload(doc.name)}
                  className="w-full text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl py-2.5 flex items-center justify-center gap-2 border border-indigo-150/40"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
