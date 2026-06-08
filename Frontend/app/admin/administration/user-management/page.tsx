"use client";
import React, { useState, useEffect } from 'react';
import IntegratedLoader from '../../../../components/layout/IntegratedLoader';
import {
  Plus,
  Check,
  X,
  Edit2,
  UserPlus,
  Users,
  Clock,
  LayoutDashboard,
  ChevronRight,
  FileText,
  Trash2
} from 'lucide-react';
import StatCard from "@/components/ui/stat-card";

// small table helpers (kept from original)
import { ReactNode, HTMLAttributes } from 'react';
interface TableProps extends HTMLAttributes<HTMLTableElement> { children: ReactNode; }
const Table = ({ children, ...props }: TableProps) => <table {...props}>{children}</table>;
const TableHeader = ({ children, ...props }: { children: ReactNode } & HTMLAttributes<HTMLTableSectionElement>) => <thead {...props}>{children}</thead>;
const TableBody = ({ children, ...props }: { children: ReactNode } & HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props}>{children}</tbody>;
const TableRow = ({ children, ...props }: { children: ReactNode } & HTMLAttributes<HTMLTableRowElement>) => <tr {...props}>{children}</tr>;
const TableCell = ({ children, ...props }: { children: ReactNode } & HTMLAttributes<HTMLTableCellElement>) => <td {...props}>{children}</td>;
const TableHead = ({ children, ...props }: { children: ReactNode } & HTMLAttributes<HTMLTableCellElement>) => <th {...props}>{children}</th>;

export default function UserManagement() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [addUserSuccess, setAddUserSuccess] = useState(false);
    const [formError, setFormError] = useState("");

    // Details / edit / delete states
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // new employee data (sample rows from your request)
    const [employeeData, setEmployeeData] = useState([
        { employeeId: 'EMP-1001', name: 'Aditya Singh', email: 'aditya@ecohub.com', phone: '9810012345', role: 'Manager', department: 'Production', shift: 'Morning Shift', status: 'Active', lastLogin: '2026-06-07 09:10', joiningDate: '2024-02-01' },
        { employeeId: 'EMP-1002', name: 'Harsh Gupta', email: 'harsh@ecohub.com', phone: '9810023456', role: 'Supervisor', department: 'Packaging', shift: 'Evening Shift', status: 'Active', lastLogin: '2026-06-06 18:25', joiningDate: '2023-11-15' },
        { employeeId: 'EMP-1003', name: 'Amit Kumar', email: 'amit@ecohub.com', phone: '9810034567', role: 'Worker', department: 'Assembly', shift: 'Night Shift', status: 'Active', lastLogin: '2026-06-07 00:05', joiningDate: '2022-09-03', assignedMachine: 'Machine A-101' },
    ]);

    // Top statistic cards values (as requested)
    const topStats = [
        { title: "Total Users", value: "125", icon: Users, color: "blue", description: "Registered system users" },
        { title: "Managers", value: "12", icon: LayoutDashboard, color: "purple", description: "Factory managers" },
        { title: "Supervisors", value: "18", icon: UserPlus, color: "amber", description: "Department supervisors" },
        { title: "Workers", value: "95", icon: Users, color: "green", description: "Active workforce members" },
    ];

    // New-user form state (industrial fields)
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        department: '',
        shift: '',
        employeeId: '',
        joiningDate: '',
        status: 'Active',
        assignedMachine: '',
    });

    const departmentOptions = ['Production', 'Assembly', 'Packaging', 'Quality Control', 'Maintenance', 'Warehouse', 'Dispatch'];
    const roleOptions = ['Manager', 'Supervisor', 'Worker'];
    const shiftOptions = ['Morning Shift', 'Evening Shift', 'Night Shift'];
    const machineOptions = ['Machine A-101', 'Machine A-102', 'Machine B-201', 'Machine C-301'];

    // Recent user activity entries (new section)
    const [recentActivities, setRecentActivities] = useState([
        "Manager Rahul logged in",
        "Worker Amit completed assigned task",
        "Supervisor Harsh updated production data",
        "New employee account created",
    ]);

    // Create new employee (unchanged)
    const validateAndCreate = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setFormError("");

        // Required fields for creation
        const required = ['name','email','phone','password','confirmPassword','role','department','shift','employeeId'];
        for (const f of required) {
            if (!(newUser as any)[f] || (typeof (newUser as any)[f] === 'string' && (newUser as any)[f].trim() === "")) {
                setFormError("Please fill all required fields.");
                return;
            }
        }
        if (newUser.password !== newUser.confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        // Prepare new entry
        const today = new Date().toISOString().split('T')[0];
        const entry: any = {
            employeeId: newUser.employeeId,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            department: newUser.department,
            shift: newUser.shift,
            status: newUser.status || 'Active',
            lastLogin: 'Never',
            joiningDate: newUser.joiningDate || today,
        };
        if (newUser.role === 'Worker' && newUser.assignedMachine) {
            entry.assignedMachine = newUser.assignedMachine;
        }

        setEmployeeData(prev => [entry, ...prev]);
        setAddUserSuccess(true);
        setTimeout(() => setAddUserSuccess(false), 2000);
        setShowCreateModal(false);
        setNewUser({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: '', department: '', shift: '', employeeId: '', joiningDate: '', status: 'Active', assignedMachine: '' });

        setRecentActivities(prev => [`New employee ${entry.employeeId} created`, ...prev].slice(0, 10));
        showToast('success', 'Employee account created!');
    };

    // --- Details / Edit flow ---
    const openDetails = (row: any) => {
        setSelectedEmployee(row);
        setEditingEmployee({ ...row, password: '', confirmPassword: '' }); // include password fields for edit
        setIsEditMode(false);
        setShowDetailsModal(true);
    };

    const enterEditMode = () => {
        if (!selectedEmployee) return;
        setEditingEmployee({ ...selectedEmployee, password: '', confirmPassword: '' });
        setIsEditMode(true);
    };

    const cancelEdit = () => {
        setIsEditMode(false);
        setEditingEmployee(selectedEmployee ? { ...selectedEmployee, password: '', confirmPassword: '' } : null);
    };

    const saveChanges = () => {
        // Validate editable fields per requirements
        if (!editingEmployee) return;
        const required = ['name', 'email', 'phone', 'role', 'department', 'shift'];
        for (const f of required) {
            if (!editingEmployee[f] || (typeof editingEmployee[f] === 'string' && editingEmployee[f].trim() === "")) {
                showToast('error', 'Please fill all required fields.');
                return;
            }
        }

        // If password provided, validate it
        const newPwd = editingEmployee.password || '';
        const confirmPwd = editingEmployee.confirmPassword || '';
        if (newPwd.trim() !== '') {
            if (newPwd !== confirmPwd) {
                showToast('error', 'Passwords do not match.');
                return;
            }
            if (newPwd.length < 6) {
                showToast('error', 'Password must be at least 6 characters.');
                return;
            }
        }

        // Update employee in list (include password only if provided)
        setEmployeeData(prev => prev.map((e: any) => {
            if (e.employeeId === editingEmployee.employeeId) {
                const updated = { ...e, ...editingEmployee };
                // don't store confirmPassword
                if (!newPwd.trim()) {
                    delete updated.password;
                } else {
                    updated.password = newPwd; // demo only; handle securely in real app
                }
                delete updated.confirmPassword;
                return updated;
            }
            return e;
        }));

        setShowDetailsModal(false);
        setIsEditMode(false);
        setSelectedEmployee(null);
        setEditingEmployee(null);
        showToast('success', 'User updated successfully');
        setRecentActivities(prev => [`User ${editingEmployee.employeeId} updated`, ...prev].slice(0, 10));
    };

    // --- Delete flow ---
    const promptDelete = (row: any) => {
        setDeleteTarget(row);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setEmployeeData(prev => prev.filter((e: any) => e.employeeId !== deleteTarget.employeeId));
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        showToast('success', 'User deleted successfully');
        setRecentActivities(prev => [`User ${deleteTarget.employeeId} deleted`, ...prev].slice(0, 10));
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
        setShowDeleteConfirm(false);
    };

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        window.setTimeout(() => setToast(null), 3500);
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
                <span className="font-semibold text-indigo-600">User Management</span>
            </nav>

            {/* Updated Header */}
            <header className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-xl sm:rounded-2xl"></div>
                <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 flex items-center gap-4">
                            <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-2xl" />
                            <div>
                                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white drop-shadow-2xl leading-tight">
                                    User Management
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-bold drop-shadow-lg">
                                    Manage factory personnel, supervisors, managers, and workforce accounts.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowCreateModal(v => !v)}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-200 text-sm sm:text-base backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Add Employee</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Top Stats (4 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {topStats.map((s) => (
                    <StatCard
                        key={s.title}
                        title={s.title}
                        value={s.value}
                        icon={s.icon}
                        color={s.color as any}
                    />
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white p-4 sm:p-6 md:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                        Employees
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base mt-1">Manage factory personnel and workforce accounts</p>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-white/95">
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Employee ID</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Name</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Email</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Role</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Department</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Shift</th>
                                <th className="text-center py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Status</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Last Login</th>
                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.map((row: any) => (
                                <tr key={row.employeeId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700 whitespace-nowrap">{row.employeeId}</td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.name}</td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-500">{row.email}</td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6"><span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{row.role}</span></td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.department}</td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.shift}</td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{row.status}</span>
                                    </td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.lastLogin}</td>
                                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openDetails(row)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-700 transition"
                                                title="View Details"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span className="hidden sm:inline">Details</span>
                                            </button>

                                            <button
                                                onClick={() => promptDelete(row)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent User Activity */}
            <div className="backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">Recent User Activity</h3>
                <ul className="space-y-3">
                    {recentActivities.map((a, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-1 text-slate-500"><Clock className="h-5 w-5" /></span>
                            <div>
                                <p className="font-semibold text-gray-900">{a}</p>
                                <p className="text-sm text-gray-600">— {new Date().toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add Employee Modal (unchanged) */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn p-3 sm:p-4">
                    <div className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-blue-100 via-cyan-100 to-purple-100 p-1 relative max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-t-xl sm:rounded-t-2xl p-4 sm:p-6 shadow-md flex items-center justify-between">
                            <div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl text-white font-extrabold drop-shadow">Add Employee Account</h3>
                                <p className="text-white/90 font-medium text-sm sm:text-base">Fill required fields to create a new employee account.</p>
                            </div>
                            <button type="button" className="text-white/80 hover:text-white ml-2 sm:ml-4 flex-shrink-0" onClick={() => { setShowCreateModal(false); setFormError(""); }}><X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" /></button>
                        </div>

                        <form className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6" onSubmit={validateAndCreate}>
                            {/* form fields (unchanged) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Full Name *</label>
                                    <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Email Address *</label>
                                    <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Phone Number *</label>
                                    <input type="tel" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Employee ID *</label>
                                    <input type="text" value={newUser.employeeId} onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Password *</label>
                                    <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Confirm Password *</label>
                                    <input type="password" value={newUser.confirmPassword} onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Role *</label>
                                    <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value, assignedMachine: '' })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required>
                                        <option value="">Select Role</option>
                                        {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Department *</label>
                                    <select value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required>
                                        <option value="">Select Department</option>
                                        {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Shift *</label>
                                    <select value={newUser.shift} onChange={(e) => setNewUser({ ...newUser, shift: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required>
                                        <option value="">Select Shift</option>
                                        {shiftOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Joining Date *</label>
                                    <input type="date" value={newUser.joiningDate} onChange={(e) => setNewUser({ ...newUser, joiningDate: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Status *</label>
                                    <select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Assigned Machine only when role == Worker */}
                            {newUser.role === 'Worker' && (
                                <div>
                                    <label className="block text-sm sm:text-base font-semibold mb-1.5">Assigned Machine (optional)</label>
                                    <select value={newUser.assignedMachine} onChange={(e) => setNewUser({ ...newUser, assignedMachine: e.target.value })} className="w-full px-3 py-2 bg-white/80 border-blue-200 rounded-lg text-sm">
                                        <option value="">Select Machine</option>
                                        {machineOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            )}

                            {formError && <div className="text-red-600 font-semibold">{formError}</div>}
                            {addUserSuccess && <div className="text-green-600 font-semibold text-center">Employee account created!</div>}

                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
                                <button type="button" className="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg border border-blue-300 bg-white/80 text-blue-700 font-semibold hover:bg-blue-50 transition-colors" onClick={() => { setShowCreateModal(false); setFormError(""); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />Create Employee Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Employee Details Modal */}
            {showDetailsModal && selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn p-3 sm:p-4">
                    <div className="w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-blue-100 via-cyan-100 to-purple-100 p-1 relative max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-t-xl sm:rounded-t-2xl p-4 sm:p-6 shadow-md flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg sm:text-xl lg:text-2xl text-white font-extrabold drop-shadow">Employee Details</h3>
                                <span className="text-white/90"> </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Edit icon in header */}
                                {!isEditMode ? (
                                    <button onClick={enterEditMode} className="text-white/90 hover:text-white flex items-center gap-2">
                                        <Edit2 className="w-5 h-5" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </button>
                                ) : (
                                    <button onClick={cancelEdit} className="text-white/90 hover:text-white flex items-center gap-2">
                                        <X className="w-5 h-5" />
                                        <span className="hidden sm:inline">Cancel</span>
                                    </button>
                                )}

                                <button type="button" className="text-white/80 hover:text-white ml-2 sm:ml-4 flex-shrink-0" onClick={() => { setShowDetailsModal(false); setIsEditMode(false); setSelectedEmployee(null); }}>
                                    <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/80 p-6 sm:p-8 rounded-b-xl sm:rounded-b-2xl">
                            {/* Read-only view */}
                            {!isEditMode && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Employee ID</p>
                                        <p className="font-semibold text-lg">{selectedEmployee.employeeId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Full Name</p>
                                        <p className="font-semibold text-lg">{selectedEmployee.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Email Address</p>
                                        <p className="font-semibold">{selectedEmployee.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                                        <p className="font-semibold">{selectedEmployee.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Role</p>
                                        <p className="font-semibold">{selectedEmployee.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Department</p>
                                        <p className="font-semibold">{selectedEmployee.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Shift</p>
                                        <p className="font-semibold">{selectedEmployee.shift}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Status</p>
                                        <p className="font-semibold">{selectedEmployee.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Joining Date</p>
                                        <p className="font-semibold">{selectedEmployee.joiningDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Assigned Machine</p>
                                        <p className="font-semibold">{selectedEmployee.assignedMachine || '-'}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-slate-500 mb-1">Last Login</p>
                                        <p className="font-semibold">{selectedEmployee.lastLogin}</p>
                                    </div>
                                </div>
                            )}

                            {/* Edit mode */}
                            {isEditMode && editingEmployee && (
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveChanges(); }}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Full Name</label>
                                            <input value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Email Address</label>
                                            <input value={editingEmployee.email} onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md" />
                                        </div>
                                    </div>

                                    {/* Password fields for edit */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">New Password</label>
                                            <input type="password" value={editingEmployee.password || ''} onChange={(e) => setEditingEmployee({ ...editingEmployee, password: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md" placeholder="Leave blank to keep current password" />
                                            <p className="text-xs text-slate-400 mt-1">Leave blank to keep existing password.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Confirm Password</label>
                                            <input type="password" value={editingEmployee.confirmPassword || ''} onChange={(e) => setEditingEmployee({ ...editingEmployee, confirmPassword: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md" placeholder="Confirm new password" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Phone Number</label>
                                            <input value={editingEmployee.phone} onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Role</label>
                                            <select value={editingEmployee.role} onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value, assignedMachine: e.target.value === 'Worker' ? editingEmployee.assignedMachine : '' })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md">
                                                <option value="">Select Role</option>
                                                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Department</label>
                                            <select value={editingEmployee.department} onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md">
                                                <option value="">Select Department</option>
                                                {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Shift</label>
                                            <select value={editingEmployee.shift} onChange={(e) => setEditingEmployee({ ...editingEmployee, shift: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md">
                                                <option value="">Select Shift</option>
                                                {shiftOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-600 mb-1">Status</label>
                                            <select value={editingEmployee.status} onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md">
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                        {editingEmployee.role === 'Worker' && (
                                            <div>
                                                <label className="block text-xs text-slate-600 mb-1">Assigned Machine</label>
                                                <select value={editingEmployee.assignedMachine || ''} onChange={(e) => setEditingEmployee({ ...editingEmployee, assignedMachine: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md">
                                                    <option value="">Select Machine</option>
                                                    {machineOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-semibold">Cancel</button>
                                        <button type="button" onClick={saveChanges} className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold">Save Changes</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && deleteTarget && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
                        <h3 className="text-lg font-bold mb-2">Delete User</h3>
                        <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete this user account? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-2 rounded-md border border-gray-200" onClick={cancelDelete}>Cancel</button>
                            <button className="px-4 py-2 rounded-md bg-red-600 text-white" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed right-4 top-4 z-70 p-3 rounded-md shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
