'use client';
import React, { useState, useEffect } from 'react';
import IntegratedLoader from '@/components/layout/IntegratedLoader';
import { 
    Plus, 
    Search, 
    Filter, 
    Trash2, 
    FileText, 
    ChevronRight, 
    LayoutDashboard, 
    Shield, 
    Activity, 
    X, 
    Edit2, 
    Download,
    Cpu,
    Clock
} from 'lucide-react';
import StatCard from "@/components/ui/stat-card";

// --- Machine Entry Mock Data ---
const initialMachines = [
    {
        machineId: "MC-101",
        name: "CNC Machine M-12",
        type: "CNC Machine",
        department: "Production",
        operator: "Amit Kumar",
        status: "Running",
        manufacturer: "Siemens",
        modelNumber: "S-2000",
        installationDate: "2024-03-12"
    },
    {
        machineId: "MC-102",
        name: "Conveyor Belt System",
        type: "Conveyor Belt",
        department: "Packaging",
        operator: "Rahul Singh",
        status: "Idle",
        manufacturer: "Bosch Rexroth",
        modelNumber: "BC-400",
        installationDate: "2023-11-05"
    },
    {
        machineId: "MC-103",
        name: "Welding Robot Arm",
        type: "Welding Robot",
        department: "Assembly",
        operator: "Harsh Gupta",
        status: "Maintenance",
        manufacturer: "KUKA",
        modelNumber: "KR-60",
        installationDate: "2025-01-20"
    },
    {
        machineId: "MC-104",
        name: "Packaging Unit P-2",
        type: "Packaging Unit",
        department: "Packaging",
        operator: "Sanjay Dutt",
        status: "Running",
        manufacturer: "Multivac",
        modelNumber: "C-500",
        installationDate: "2024-05-18"
    },
    {
        machineId: "MC-105",
        name: "Laser Cutter L-40",
        type: "Cutting Machine",
        department: "Production",
        operator: "Vikram Malhotra",
        status: "Running",
        manufacturer: "Trumpf",
        modelNumber: "TruLaser 3030",
        installationDate: "2024-08-22"
    }
];

export default function MachineEntryPage() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    // Core Data States
    const [machines, setMachines] = useState(initialMachines);
    const [activities, setActivities] = useState([
        "MC-101 added by Admin",
        "MC-102 assigned to Production",
        "MC-103 updated",
        "MC-104 deleted"
    ]);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedType, setSelectedType] = useState('All');

    // Modals States
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<typeof initialMachines[0] | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingMachine, setEditingMachine] = useState<typeof initialMachines[0] | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<typeof initialMachines[0] | null>(null);
    
    // Toast State
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Form inputs for Add Machine
    const [newMachine, setNewMachine] = useState({
        machineId: '',
        name: '',
        type: '',
        department: '',
        operator: '',
        installationDate: '',
        manufacturer: '',
        modelNumber: '',
        status: 'Running'
    });

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        window.setTimeout(() => setToast(null), 3000);
    };

    // Filters Implementation
    const filteredMachines = machines.filter(m => {
        const matchesSearch = m.machineId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              m.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || m.status === selectedStatus;
        const matchesDept = selectedDepartment === 'All' || m.department === selectedDepartment;
        const matchesType = selectedType === 'All' || m.type === selectedType;
        return matchesSearch && matchesStatus && matchesDept && matchesType;
    });

    // KPI Card Totals (offsets to match prompt totals when starting with mock data)
    const kpiTotals = {
        total: machines.length + 40, // target 45
        running: machines.filter(m => m.status === 'Running').length + 32, // target 35
        idle: machines.filter(m => m.status === 'Idle').length + 6, // target 7
        maintenance: machines.filter(m => m.status === 'Maintenance').length + 2 // target 3
    };

    // Add Machine Functionality
    const handleAddMachine = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMachine.machineId.trim() || !newMachine.name.trim() || !newMachine.type || !newMachine.department || !newMachine.installationDate || !newMachine.status) {
            showToast('error', 'Please fill in all required fields.');
            return;
        }
        if (machines.some(m => m.machineId.toLowerCase() === newMachine.machineId.toLowerCase().trim())) {
            showToast('error', 'Machine with this ID already exists.');
            return;
        }

        const added = {
            ...newMachine,
            machineId: newMachine.machineId.trim(),
            name: newMachine.name.trim()
        };

        setMachines([added, ...machines]);
        setShowAddModal(false);
        setNewMachine({
            machineId: '',
            name: '',
            type: '',
            department: '',
            operator: '',
            installationDate: '',
            manufacturer: '',
            modelNumber: '',
            status: 'Running'
        });
        showToast('success', 'Machine added successfully');
        setActivities(prev => [`${added.machineId} added by Admin`, ...prev].slice(0, 10));
    };

    // Edit Machine Functionality
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMachine) return;
        if (!editingMachine.name.trim() || !editingMachine.type || !editingMachine.department || !editingMachine.status) {
            showToast('error', 'Please fill in all required fields.');
            return;
        }

        setMachines(prev => prev.map(m => m.machineId === editingMachine.machineId ? editingMachine : m));
        setSelectedMachine(editingMachine);
        setIsEditMode(false);
        showToast('success', 'Machine updated successfully');
        setActivities(prev => [`${editingMachine.machineId} updated`, ...prev].slice(0, 10));
    };

    // Delete Machine Functionality
    const handleDeleteMachine = () => {
        if (!deleteTarget) return;
        setMachines(prev => prev.filter(m => m.machineId !== deleteTarget.machineId));
        setActivities(prev => [`${deleteTarget.machineId} deleted`, ...prev].slice(0, 10));
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        showToast('success', 'Machine deleted successfully');
    };

    type StatusType = 'Running' | 'Idle' | 'Maintenance';
    const StatusBadge = ({ status }: { status: StatusType }) => {
        const styles: Record<StatusType, string> = {
            Running: 'bg-green-100 text-green-800 border border-green-200',
            Idle: 'bg-amber-100 text-amber-800 border border-amber-200',
            Maintenance: 'bg-red-100 text-red-800 border border-red-200',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 min-h-screen relative">
            <nav className="flex items-center text-sm font-medium text-slate-500 mb-3" aria-label="Breadcrumb">
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-semibold text-indigo-600">Administration</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-semibold text-indigo-600">Machine Entry</span>
            </nav>

            {/* Header */}
            <header className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-xl sm:rounded-2xl"></div>
                <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 flex items-center gap-4">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-2xl" />
                            <div>
                                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white drop-shadow-2xl leading-tight">
                                    Machine Entry
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-bold drop-shadow-lg">
                                    Register and manage factory machines and equipment.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 sm:px-5 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all font-bold rounded-xl flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base">Add Machine</span>
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Exporting machines list...");
                                    alert("Exporting machines database has been initiated.");
                                }}
                                className="px-4 sm:px-5 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all font-bold rounded-xl flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                            >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base">Export Machines</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Machines"
                    value={kpiTotals.total}
                    subtitle="Registered machines"
                    icon={Cpu}
                    color="blue"
                />
                <StatCard
                    title="Running Machines"
                    value={kpiTotals.running}
                    subtitle="Currently operational"
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Idle Machines"
                    value={kpiTotals.idle}
                    subtitle="Not currently in use"
                    icon={Clock}
                    color="orange"
                />
                <StatCard
                    title="Maintenance Machines"
                    value={kpiTotals.maintenance}
                    subtitle="Under maintenance"
                    icon={X}
                    color="red"
                />
            </div>

            {/* Main Content Area */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden">
                {/* Search & Filters */}
                <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
                        <h3 className="text-lg sm:text-xl font-bold">Filter Options</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Search Machine */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Search Machine</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
                                <input 
                                    type="text" 
                                    placeholder="Search by ID or Name..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 w-full bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm placeholder-white/60 text-sm focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Status</label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All</option>
                                <option className="text-slate-800" value="Running">Running</option>
                                <option className="text-slate-800" value="Idle">Idle</option>
                                <option className="text-slate-800" value="Maintenance">Maintenance</option>
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
                                <option className="text-slate-800" value="Warehouse">Warehouse</option>
                                <option className="text-slate-800" value="Maintenance">Maintenance</option>
                            </select>
                        </div>

                        {/* Machine Type Filter */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-emerald-100">Machine Type</label>
                            <select 
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="px-4 py-2 bg-white/20 text-white border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-sm text-slate-800"
                            >
                                <option className="text-slate-800" value="All">All Types</option>
                                <option className="text-slate-800" value="CNC Machine">CNC Machine</option>
                                <option className="text-slate-800" value="Conveyor Belt">Conveyor Belt</option>
                                <option className="text-slate-800" value="Packaging Unit">Packaging Unit</option>
                                <option className="text-slate-800" value="Welding Robot">Welding Robot</option>
                                <option className="text-slate-800" value="Cutting Machine">Cutting Machine</option>
                                <option className="text-slate-800" value="Assembly Machine">Assembly Machine</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Machine Table */}
                <div className="p-0 overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Machine ID</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Machine Name</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Machine Type</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Department</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Assigned Operator</th>
                                <th className="text-center py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Status</th>
                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-slate-600 font-bold text-sm sm:text-base">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMachines.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                                        No registered machines found for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredMachines.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700 font-semibold whitespace-nowrap">{row.machineId}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-800 font-medium">{row.name}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.type}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.department}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700">{row.operator || '-'}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                            <StatusBadge status={row.status as StatusType} />
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMachine(row);
                                                        setEditingMachine({ ...row });
                                                        setIsEditMode(false);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition font-semibold text-sm"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span>Details</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteTarget(row);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition font-semibold text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Activities Section */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Recent Machine Entries</h2>
                </div>
                
                <div className="relative pl-6 border-l border-slate-200 space-y-6">
                    {activities.map((act, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-[31px] top-1.5 w-[14px] h-[14px] rounded-full bg-indigo-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm sm:text-base">{act}</p>
                                    <p className="text-xs text-slate-500">Machine Registry Update</p>
                                </div>
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">Activity Log</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Machine Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Add Machine</h3>
                                <p className="text-sm text-blue-100 mt-1">Register a new factory asset</p>
                            </div>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="text-white/85 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddMachine}>
                            {/* Modal Body */}
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-slate-700 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Machine ID *</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. MC-104"
                                            value={newMachine.machineId}
                                            onChange={(e) => setNewMachine({...newMachine, machineId: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Machine Name *</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. Laser Cutter"
                                            value={newMachine.name}
                                            onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Machine Type *</label>
                                        <select 
                                            value={newMachine.type}
                                            onChange={(e) => setNewMachine({...newMachine, type: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="CNC Machine">CNC Machine</option>
                                            <option value="Conveyor Belt">Conveyor Belt</option>
                                            <option value="Packaging Unit">Packaging Unit</option>
                                            <option value="Welding Robot">Welding Robot</option>
                                            <option value="Cutting Machine">Cutting Machine</option>
                                            <option value="Assembly Machine">Assembly Machine</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Department *</label>
                                        <select 
                                            value={newMachine.department}
                                            onChange={(e) => setNewMachine({...newMachine, department: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            required
                                        >
                                            <option value="">Select Dept</option>
                                            <option value="Production">Production</option>
                                            <option value="Assembly">Assembly</option>
                                            <option value="Packaging">Packaging</option>
                                            <option value="Quality Control">Quality Control</option>
                                            <option value="Warehouse">Warehouse</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Assigned Operator</label>
                                        <input 
                                            type="text"
                                            placeholder="Operator Name"
                                            value={newMachine.operator}
                                            onChange={(e) => setNewMachine({...newMachine, operator: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Installation Date *</label>
                                        <input 
                                            type="date"
                                            value={newMachine.installationDate}
                                            onChange={(e) => setNewMachine({...newMachine, installationDate: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Manufacturer</label>
                                        <input 
                                            type="text"
                                            placeholder="Manufacturer Name"
                                            value={newMachine.manufacturer}
                                            onChange={(e) => setNewMachine({...newMachine, manufacturer: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Model Number</label>
                                        <input 
                                            type="text"
                                            placeholder="Model Identifier"
                                            value={newMachine.modelNumber}
                                            onChange={(e) => setNewMachine({...newMachine, modelNumber: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Status *</label>
                                        <select 
                                            value={newMachine.status}
                                            onChange={(e) => setNewMachine({...newMachine, status: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            required
                                        >
                                            <option value="Running">Running</option>
                                            <option value="Idle">Idle</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-sm"
                                >
                                    Add Machine
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Machine Details / Edit Modal */}
            {selectedMachine && editingMachine && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Machine Details</h3>
                                <p className="text-sm text-blue-100 mt-1">ID: {selectedMachine.machineId}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {!isEditMode ? (
                                    <button 
                                        onClick={() => setIsEditMode(true)}
                                        className="text-white/85 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 transition-colors text-sm font-semibold"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setIsEditMode(false);
                                            setEditingMachine({ ...selectedMachine });
                                        }}
                                        className="text-white/85 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 transition-colors text-sm font-semibold"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                )}
                                <button 
                                    onClick={() => {
                                        setSelectedMachine(null);
                                        setEditingMachine(null);
                                        setIsEditMode(false);
                                    }} 
                                    className="text-white/85 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSaveChanges}>
                            {/* Modal Body */}
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-slate-700 text-sm">
                                {!isEditMode ? (
                                    // Read-Only Display Mode
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Machine ID</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.machineId}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Machine Name</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Machine Type</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.type}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.department}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Operator</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.operator || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Manufacturer</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.manufacturer || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Number</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.modelNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Installation Date</span>
                                            <p className="text-sm font-medium text-slate-800 mt-1">{selectedMachine.installationDate}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                                            <div className="mt-1">
                                                <StatusBadge status={selectedMachine.status as StatusType} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Editable Inputs Mode
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Machine ID (Read-only)</label>
                                            <p className="text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">{editingMachine.machineId}</p>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-600 mb-1">Machine Name *</label>
                                            <input 
                                                type="text"
                                                value={editingMachine.name}
                                                onChange={(e) => setEditingMachine({...editingMachine, name: e.target.value})}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-600 mb-1">Machine Type *</label>
                                            <select 
                                                value={editingMachine.type}
                                                onChange={(e) => setEditingMachine({...editingMachine, type: e.target.value})}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                required
                                            >
                                                <option value="CNC Machine">CNC Machine</option>
                                                <option value="Conveyor Belt">Conveyor Belt</option>
                                                <option value="Packaging Unit">Packaging Unit</option>
                                                <option value="Welding Robot">Welding Robot</option>
                                                <option value="Cutting Machine">Cutting Machine</option>
                                                <option value="Assembly Machine">Assembly Machine</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-600 mb-1">Department *</label>
                                            <select 
                                                value={editingMachine.department}
                                                onChange={(e) => setEditingMachine({...editingMachine, department: e.target.value})}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                required
                                            >
                                                <option value="Production">Production</option>
                                                <option value="Assembly">Assembly</option>
                                                <option value="Packaging">Packaging</option>
                                                <option value="Quality Control">Quality Control</option>
                                                <option value="Warehouse">Warehouse</option>
                                                <option value="Maintenance">Maintenance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-600 mb-1">Assigned Operator</label>
                                            <input 
                                                type="text"
                                                value={editingMachine.operator || ''}
                                                onChange={(e) => setEditingMachine({...editingMachine, operator: e.target.value})}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Installation Date (Read-only)</label>
                                            <p className="text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">{editingMachine.installationDate}</p>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-600 mb-1">Manufacturer</label>
                                            <input 
                                                type="text"
                                                value={editingMachine.manufacturer || ''}
                                                onChange={(e) => setEditingMachine({...editingMachine, manufacturer: e.target.value})}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-slate-600 mb-1">Model Number</label>
                                            <input 
                                                type="text"
                                                value={editingMachine.modelNumber || ''}
                                                onChange={(e) => setEditingMachine({...editingMachine, modelNumber: e.target.value})}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block font-semibold text-slate-600 mb-1">Status *</label>
                                            <select 
                                                value={editingMachine.status}
                                                onChange={(e) => setEditingMachine({...editingMachine, status: e.target.value})}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                required
                                            >
                                                <option value="Running">Running</option>
                                                <option value="Idle">Idle</option>
                                                <option value="Maintenance">Maintenance</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                                {!isEditMode ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMachine(null);
                                            setEditingMachine(null);
                                        }}
                                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-sm"
                                    >
                                        Close
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditMode(false);
                                                setEditingMachine({ ...selectedMachine });
                                            }}
                                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-sm"
                                        >
                                            Save Changes
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden transform transition-all duration-300 p-6 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <Trash2 className="w-6 h-6" />
                            <h3 className="text-lg font-bold">Delete Machine</h3>
                        </div>
                        <p className="text-slate-600 text-sm">
                            Are you sure you want to delete this machine? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteTarget(null);
                                }}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteMachine}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-5 right-5 z-[100] animate-bounce">
                    <div className={`px-4 py-3 rounded-xl shadow-2xl text-white font-bold flex items-center gap-2 ${
                        toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-teal-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
                    }`}>
                        {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline badge support for Toast Notification
function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={{ width: '1.25rem', height: '1.25rem' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    );
}

function XCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={{ width: '1.25rem', height: '1.25rem' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    );
}