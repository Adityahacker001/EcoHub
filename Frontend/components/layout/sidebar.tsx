"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
// Type for NavLink props
interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: ReactNode;
  activeClass: string;
  inactiveClass: string;
  isDashboard?: boolean;
}
import { cn } from "@/lib/utils";
import {
  Users,
  FileText,
  BarChart3,
  Shield,            // Used for SP/CP and DGP icon
  Building,
  MapPin,
  Globe,
  UserPlus,
  Clock,
  AlertTriangle,
  GraduationCap,
  DollarSign,        // Used for NSKFDC icon & reports
  CheckSquare,
  Award,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,              // Added for mobile hamburger menu
  X,                 // Added for close button
  Smartphone,
  FilePenLine,        // Used for Direction Input / Investigation Progress
  MessageSquareWarning,// Used for Grievance Feedback / Grievance Report
  ClipboardList,       // Used for General Feedback / Policy Implementation
  Gavel,               // Used for Direction Input / Compliance
  FileWarning,         // Used for Incident Input / Grievance Report / Unresolved Grievance
  FolderKanban,
  FolderClock,
  Book,                // Used for Annual Report
  UserCircle,
  ClipboardPlus,       // Used for New Work Assignment / New Scheme Entry
  FileSignature,       // Used for Modify Existing Work
  MessageSquareHeart,  // Used for Feedback Input
  MonitorCheck,        // Used for Medical Examination Input
  Search,
  Sparkles,            // Used for Generative AI
  UserCog,
  Banknote,            // Used for Payment Status / Fund Allotment
  ClipboardCheck,      // Used for Directions Compliance Input/Report
  HeartPulse,
  FileDiff,
  MessagesSquare,      // For Grievance Feedback Input (Specific)
  Inbox,               // For General Feedback Input
  Library,             // For Scheme Master
  UserSquare,          // For Individual Beneficiary
  Group,               // For SHG Beneficiary / SHG Icon
  Receipt,             // For Fund Disbursement
  CheckCheck,          // For Direction Compliance Report
  TrendingDown,
  TrendingUp,        // For Low Utilization
  FileX,               // For Rejected Applications
  FileClock,           // For Delayed Compliance / Pending Disbursement
  Map as MapIcon,      // Renamed Map import
  HelpCircle,          // For Help & Support
  Settings,            // For Settings
  Contact,             // For Contact Us
  Target,              // Potentially for District SP/CP Onboarding Report
  ListOrdered,
  // Added/Verified icons for SHG
  Briefcase,           // For My Projects
  FilePlus,            // For New Application
  ListChecks,          // For Schemes & Applications (View Schemes)
  Wallet,              // For My Finances
  Gift,                // For Benefits
  Megaphone,           // For Raise a Voice
  History,             // For Track My Voice
  Upload,              // For Upload Docs (part of Profile/My SHG)
  ListTodo,            // For Monthly Utilization Reports
  AreaChart,           // For Financial Summary Reports
  Activity,            // For Production Management
} from "lucide-react";
import { useGlobalModal } from '@/context/GlobalModalContext';

interface SidebarProps {
  role: "workers" | "Supervisor" | "admin" | "manager";
}

// Update the type definition for roleConfig to include 'Exception reports'
interface RoleConfig {
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  dataEntry?: Array<{ name: string; icon: React.ElementType; href: string }>;
  manageApply?: Array<{ name: string; icon: React.ElementType; href: string }>;
  reports?: Array<{ name: string; icon: React.ElementType; href: string }>;
  admin?: Array<{ name: string; icon: React.ElementType; href: string }>;
  "Exception reports"?: Array<{ name: string; icon: React.ElementType; href: string }>;

  dashboard: string;
}

const roleConfig: Record<string, RoleConfig> = {
  workers: {
    title: "Workers Dashboard",
    icon: Users,
    color: "text-sky-400",
    bgColor: "from-sky-900/30 to-slate-900",
    // dataEntry: [ { name: "Attendance & PPE Log", icon: Clock, href: "/workers/data-entry/attendance-ppe" }, { name: "Grievance Resolution", icon: AlertTriangle, href: "/workers/data-entry/grievance-resolution" }, { name: "Training Assignment", icon: GraduationCap, href: "/workers/data-entry/training-assignment" }, ],
    // reports: [ { name: "Worker Management", icon: Users, href: "/workers/reports/worker-management" }, { name: "Attendance Reports", icon: Clock, href: "/workers/reports/attendance" }, { name: "Grievance Tracking", icon: AlertTriangle, href: "/workers/reports/grievance-tracking" }, { name: "Training Coverage", icon: GraduationCap, href: "/workers/reports/training-coverage" }, { name: "Safety Compliance", icon: Shield, href: "/workers/reports/safety-compliance" }, ],
    // admin: [ { name: "User Management", icon: UserCog, href: "/workers/administration/user-management" }, { name: "Audit Logs", icon: FileClock, href: "/workers/administration/audit-logs" }, ],
    dashboard: "/workers/workers-dashboard",
  },
  Supervisor: {
    title: "Supervisor Interface",
    icon: Shield,
    color: "text-emerald-400",
    bgColor: "from-emerald-900/30 to-slate-900",
    // dataEntry: [ { name: "Compliance Checklist", icon: CheckSquare, href: "/Supervisor/data-entry/compliance-checklist" }, { name: "Grievance Management", icon: MessageSquareWarning, href: "/Supervisor/data-entry/Grievance" }, { name: "Recognition Nomination", icon: Award, href: "/Supervisor/data-entry/recognition-nomination" }, { name: "Work Certification", icon: CheckSquare, href: "/Supervisor/data-entry/Work-Certification" }, ],
    // reports: [ { name: "incident management", icon: AlertTriangle, href: "/Supervisor/reports/incident-management" }, { name: "Financial Tracker", icon: DollarSign, href: "/Supervisor/reports/financial-tracker" }, { name: "Contractor Performance", icon: BarChart3, href: "/Supervisor/reports/contractor-performance" }, { name: "Performance Reports", icon: FileText, href: "/Supervisor/reports/All-reports" }, { name: "Compliance Overview", icon: CheckSquare, href: "/Supervisor/reports/compliance-overview" }, { name: "Recognition", icon: Award, href: "/Supervisor/reports/recognition" }, { name: "Reports & Analytics", icon: BarChart3, href: "/Supervisor/reports/reports-and-analytics" }, ],
    // admin: [ { name: "User Management", icon: UserCog, href: "/Supervisor/administration/user-management" }, { name: "Audit Logs", icon: FileClock, href: "/Supervisor/administration/audit-logs" }, ],
    dashboard: "/Supervisor/Supervisor-dashboard",
  },
  admin: {
    title: "Admin Dashboard",
    icon: Globe,
    color: "text-indigo-400",
    bgColor: "from-indigo-900/30 to-slate-900",
    dataEntry: [ { name: "Machine Entry", icon: Settings, href: "/admin/data-entry/directive-issuance" }],
    reports: [ { name: "Machine Analytics", icon: TrendingUp, href: "/admin/reports/national-overview" }, { name: "Reports Center", icon: ClipboardList, href: "/admin/reports/reports-center" }],
    admin: [ { name: "User Management", icon: UserCog, href: "/admin/administration/user-management" }, { name: "Audit Logs", icon: FileClock, href: "/admin/administration/audit-logs" }, ],
    dashboard: "/admin/admin-dashboard",
  },
  "manager": {
    title: "Manager Dashboard",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "from-blue-900/40 to-slate-900",
    dashboard: "/manager/manager-dashboard",
  },
};

export default function Sidebar({ role = "admin" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (isMobileMenuOpen && sidebar && menuButton) {
        if (!sidebar.contains(event.target as Node) && !menuButton.contains(event.target as Node)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // --- Sidebar scroll position persistence ---
  // Use a ref for the scrollable container
  const scrollableRef = React.useRef<HTMLDivElement>(null);



  // Restore scroll position after navigation
  useEffect(() => {
    const saved = sessionStorage.getItem('sidebarScroll');
    if (scrollableRef.current && saved) {
      scrollableRef.current.scrollTop = Number(saved);
    }
  }, [pathname]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const config = roleConfig[role] || roleConfig.admin;
  const RoleIcon = config.icon;
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(true);
  const [isManageApplyOpen, setIsManageApplyOpen] = useState(true);
  const [isReportsOpen, setIsReportsOpen] = useState(true);
  const [isExceptionReportsOpen, setIsExceptionReportsOpen] = useState(true); // State for Exception Reports
  const [isAdminOpen, setIsAdminOpen] = useState(true);

  const searchParams = useSearchParams();
  const spcpQuery = searchParams ? searchParams.get("role") : null;

  const headerTextColor = role === "admin" ? "text-white" : config.color;

  const displayTitle = config.title;

  // Try to access global modal API if provider is present
  let globalOpenModal: ((t: 'contact' | 'help' | 'settings') => void) | null = null;
  let globalCloseModal: (() => void) | null = null;
  try {
    const gm = useGlobalModal();
    globalOpenModal = gm.openModal;
    globalCloseModal = gm.closeModal;
  } catch (e) {
    // provider not present - footer will be inert
  }

  const NavLink = ({
    href,
    icon: Icon,
    children,
    activeClass,
    inactiveClass,
    isDashboard = false,
  }: NavLinkProps) => {
    // Adjusted isActive logic: exact match for dashboard, startsWith for others
    const isActive = isDashboard
      ? pathname === href || pathname === `/${role}/dashboard`
      : pathname === href || (pathname.startsWith(href) && href !== `/${role}/profile`);
    const baseClass =
      "flex items-center space-x-3 rounded-lg text-sm font-medium relative group transition-all duration-300";
    const padding = isDashboard ? "px-4 py-3" : "px-4 py-2";

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      // Store scroll position before navigation
      if (scrollableRef.current) {
        sessionStorage.setItem('sidebarScroll', String(scrollableRef.current.scrollTop));
      }
      // Close mobile menu before navigation
      setIsMobileMenuOpen(false);
      // Navigate using router
      router.push(href);
    };

    return (
      <button
        onClick={handleClick}
        className={cn(
          baseClass,
          padding,
          isActive ? activeClass : inactiveClass,
          "w-full text-left"
        )}
      >
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-sm transition-all duration-500" />
        <Icon className="h-4 w-4 relative z-10" />
        <span className="relative z-10">{children}</span>
      </button>
    );
  };

  // No legacy role-specific route overrides needed

  // Define which roles should have the Profile link
  const showProfileLink = ["manager"].includes(role);

  // Determine if role has Data Entry items
  const hasDataEntry = config.dataEntry && config.dataEntry.length > 0;
  // Determine if role has Manage & Apply items (SHG)
  const hasManageApply = (config as any).manageApply && (config as any).manageApply.length > 0;
  // Determine if role has Report items
  const hasReports = config.reports && config.reports.length > 0;


  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile and tablet */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-[60] p-2 bg-blue-900/90 backdrop-blur-md rounded-lg border border-blue-700 lg:hidden shadow-lg hover:bg-blue-800/90 transition-colors duration-200"
        aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile Overlay - Only visible when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        id="mobile-sidebar"
        className={cn(
          "fixed top-0 left-0 flex flex-col w-64 h-screen bg-gradient-to-b from-blue-900 to-indigo-950 text-white shadow-2xl border-r border-blue-800 z-50 transition-transform duration-300 ease-in-out overflow-hidden",
          // Mobile and tablet: slide in/out from left
          "lg:translate-x-0", // Always visible on desktop
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" // Slide behavior for mobile/tablet
        )}
      >
        <div className="absolute inset-0 backdrop-blur-xl bg-white/5" />

      <div
        className={cn(
          "relative p-4 flex items-center space-x-3 bg-gradient-to-r shadow-lg border-b border-white/10 z-10",
          config.bgColor
        )}
      >
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md shadow-md">
          <RoleIcon className={cn("h-6 w-6", config.color)} />
        </div>
        <h3 className={cn("text-md font-bold drop-shadow-lg", headerTextColor)}>
          {displayTitle}
        </h3>
      </div>

          <NavLink
            href={config.dashboard}
            icon={BarChart3}
            isDashboard={true}
            activeClass="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl scale-[1.03] border border-indigo-400/50"
            inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
          >
            Dashboard
          </NavLink>



                  {/* Workers: My Tasks */}
                  {role === "workers" && (
                    <NavLink
                      href="/workers/my-tasks"
                      icon={CheckSquare}
                      activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
                      inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
                    >
                      My Tasks
                    </NavLink>
                  )}

                  {/* Workers: My Profile */}
                  {role === "workers" && (
                    <NavLink
                      href="/workers/profile"
                      icon={UserCircle}
                      activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
                      inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
                    >
                      My Profile
                    </NavLink>
                  )}

                  {/* Workers: Issue Reporting */}
                  {role === "workers" && (
                    <NavLink
                      href="/workers/issue-reporting"
                      icon={AlertTriangle}
                      activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
                      inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
                    >
                      Issue Reporting
                    </NavLink>
                  )}

          <div className="flex-1 overflow-y-auto relative z-10" ref={scrollableRef}>
        <nav className="p-4 space-y-4">
          {/* Conditionally render Profile Link */}
          {showProfileLink && (
            <NavLink
              href={`/${role}/profile`}
              icon={UserCircle}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Profile
            </NavLink>
          )}

          {role === "manager" && (
            <NavLink
              href="/manager/production-management"
              icon={Activity}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Production Management
            </NavLink>
          )}

          {role === "manager" && (
            <NavLink
              href="/manager/machine-operations"
              icon={Settings}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Machine Operations
            </NavLink>
          )}

          {role === "manager" && (
            <NavLink
              href="/manager/employee-management"
              icon={Users}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Employee Management
            </NavLink>
          )}

          {role === "manager" && (
            <NavLink
              href="/manager/operations-analytics"
              icon={BarChart3}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Operations Analytics
            </NavLink>
          )}

          {role === "manager" && (
            <NavLink
              href="/manager/reports"
              icon={ClipboardList}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Reports Center
            </NavLink>
          )}

          {role === "Supervisor" && (
            <NavLink
              href="/Supervisor/production-management"
              icon={Activity}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Production Management
            </NavLink>
          )}

          {role === "Supervisor" && (
            <NavLink
              href="/Supervisor/workers-management"
              icon={Users}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Workers Management
            </NavLink>
          )}

          {role === "Supervisor" && (
            <NavLink
              href="/Supervisor/incident-management"
              icon={AlertTriangle}
              activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
              inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
            >
              Incident Management
            </NavLink>
          )}


          {hasDataEntry && (
            <div className="space-y-2">
              <button
                onClick={() => setIsDataEntryOpen(!isDataEntryOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-white/90 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                {/* Adjust title for SHG */}
                <span>Data Entry</span>
                {isDataEntryOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isDataEntryOpen && (
                <div className="space-y-1 pt-1 pl-4">
                  {config.dataEntry?.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
                      inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manage & Apply Section (SHG specific content will use config.manageApply) */}
          {hasManageApply && (
            <div className="space-y-2">
              <button
                onClick={() => setIsManageApplyOpen(!isManageApplyOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-white/90 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <span>Manage & Apply</span>
                {isManageApplyOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isManageApplyOpen && (
                <div className="space-y-1 pt-1 pl-4">
                  {(config as any).manageApply?.map((item: any) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
                      inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}



          {/* Reports Section (Only show if items exist) */}
          {hasReports && (
            <div className="space-y-2">
              <button
                onClick={() => setIsReportsOpen(!isReportsOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-white/90 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <span>Reports & Analytics</span>
                {isReportsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isReportsOpen && (
                <div className="space-y-1 pt-1 pl-4">
                  {config.reports?.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      activeClass="bg-gradient-to-r from-pink-500 to-red-600 text-white shadow-lg scale-[1.03] border border-pink-400/50"
                      inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Administration Section (moved out from Reports & Analytics) */}
          {config.admin && config.admin.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-white/90 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <span>Administration</span>
                {isAdminOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isAdminOpen && (
                <div className="space-y-1 pt-1 pl-4">
                  {config.admin.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      activeClass="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-[1.03] border border-cyan-400/50"
                      inactiveClass="text-white/80 hover:text-white hover:scale-[1.02]"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}


        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5 relative z-10 space-y-1">
        {/* Use global modal openers instead of route navigation */}
        <button onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); globalOpenModal?.('contact'); }} className="w-full text-left flex items-center space-x-3 px-2 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white">
          <Contact className="h-4 w-4" />
          <span className="text-xs">Contact Us</span>
        </button>
        <button onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); globalOpenModal?.('help'); }} className="w-full text-left flex items-center space-x-3 px-2 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white">
          <HelpCircle className="h-4 w-4" />
          <span className="text-xs">Help & Support</span>
        </button>
        <button onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); globalOpenModal?.('settings'); }} className="w-full text-left flex items-center space-x-3 px-2 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white">
          <Settings className="h-4 w-4" />
          <span className="text-xs">Settings</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            router.push("/");
          }}
          className="w-full text-left flex items-center space-x-3 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-200 hover:bg-red-500/10 transition-all relative group mt-2"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 rounded-xl blur-md transition-all duration-500" />
          <LogOut className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Log Out</span>
        </button>
      </div>
      </div>
    </>
  );
}