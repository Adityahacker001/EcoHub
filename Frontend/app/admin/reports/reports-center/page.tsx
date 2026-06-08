'use client';
import React, { useState, useEffect } from 'react';
import IntegratedLoader from "@/components/layout/IntegratedLoader";
import StatCard from "@/components/ui/stat-card";
import { 
    Download, 
    Eye, 
    Trash2, 
    Calendar, 
    ChevronRight, 
    LayoutDashboard, 
    FileText, 
    ClipboardList, 
    CheckCircle, 
    Clock, 
    AlertTriangle, 
    X, 
    Play, 
    Printer,
    Check,
    FileSpreadsheet,
    File,
    Settings,
    ShieldAlert
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export default function ReportsCenterPage() {
    const [loading, setLoading] = useState(true);
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Dynamic Lists States
    const [recentReports, setRecentReports] = useState([
        { id: "REP-901", name: "Monthly Production Report", category: "Production", generatedBy: "Admin", date: "12 Jun 2026", format: "PDF", status: "Completed" },
        { id: "REP-902", name: "Machine Health Report", category: "Machine", generatedBy: "Admin", date: "11 Jun 2026", format: "Excel", status: "Completed" },
        { id: "REP-903", name: "Employee Attendance Report", category: "Employee", generatedBy: "Admin", date: "10 Jun 2026", format: "CSV", status: "Completed" }
    ]);

    const [scheduledReports, setScheduledReports] = useState([
        { id: "SCH-001", name: "Monthly Production Report", frequency: "Monthly", format: "PDF", nextRun: "01 Jul 2026", status: "Active" },
        { id: "SCH-002", name: "Machine Maintenance Report", frequency: "Weekly", format: "Excel", nextRun: "18 Jun 2026", status: "Active" }
    ]);

    // Form Inputs State
    const [reportType, setReportType] = useState('Production Report');
    const [department, setDepartment] = useState('All Departments');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [exportFormat, setExportFormat] = useState('PDF');

    // Modals States
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        window.setTimeout(() => setToast(null), 3000);
    };

    // Scroll to form smoothly
    const scrollToForm = () => {
        const element = document.getElementById("generation-form");
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Report Generation Function
    const handleGenerateReport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            showToast('error', 'Please select a valid date range.');
            return;
        }

        const nameMap: Record<string, string> = {
            'Production Report': 'Production Performance Report',
            'Machine Report': 'Machine Health & Downtime Summary',
            'Employee Report': 'Worker Productivity & Shift Attendance',
            'Audit Report': 'User Access & Activity Audit Log'
        };

        const newId = `REP-${Math.floor(100 + Math.random() * 900)}`;
        const dateToday = new Date('2026-06-07T14:46:23+05:30').toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const newReport = {
            id: newId,
            name: `${nameMap[reportType]} (${startDate.split('-')[2]}/${startDate.split('-')[1]} - ${endDate.split('-')[2]}/${endDate.split('-')[1]})`,
            category: reportType.split(' ')[0],
            generatedBy: "Admin",
            date: dateToday,
            format: exportFormat,
            status: "Processing"
        };

        // Add with processing state
        setRecentReports(prev => [newReport, ...prev]);
        showToast('success', 'Report generation scheduled.');

        // Simulate background report generation processing
        setTimeout(() => {
            setRecentReports(prev => 
                prev.map(r => r.id === newId ? { ...r, status: "Completed" } : r)
            );
            showToast('success', 'Report generated successfully.');
        }, 2500);
    };

    // Delete Report
    const handleDeleteReport = () => {
        if (!deleteTarget) return;
        setRecentReports(prev => prev.filter(r => r.id !== deleteTarget.id));
        setDeleteTarget(null);
        showToast('success', 'Report deleted successfully.');
    };

    // Download Report (Real Generation for PDF, Excel, and CSV)
    const handleDownloadReport = (name: string, format: string) => {
        showToast('success', `Preparing download for "${name}"...`);
        
        // Determine category based on name or format to render mock datatables
        let category = "Production";
        const lowerName = name.toLowerCase();
        if (lowerName.includes("machine") || lowerName.includes("maintenance")) {
            category = "Machine";
        } else if (lowerName.includes("employee") || lowerName.includes("attendance") || lowerName.includes("productivity") || lowerName.includes("worker")) {
            category = "Employee";
        } else if (lowerName.includes("audit") || lowerName.includes("activity") || lowerName.includes("log") || lowerName.includes("security")) {
            category = "Audit";
        }

        if (format.toUpperCase() === 'PDF') {
            try {
                const doc = new jsPDF();
                
                // Draw a premium top banner header block
                doc.setFillColor(67, 56, 202); // indigo-700
                doc.rect(0, 0, 210, 38, 'F');
                
                // Header Text
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(20);
                doc.text("ECO-INNOVATOR HUB", 15, 18);
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text("INDUSTRIAL MANAGEMENT SYSTEM • OFFICIAL ARCHIVE REPORT", 15, 25);
                doc.text("Status: Verified & Validated", 15, 30);
                
                // Decorative line below header
                doc.setDrawColor(79, 70, 229); // indigo-600
                doc.setLineWidth(1);
                doc.line(0, 38, 210, 38);
                
                // Reset Text Color for content
                doc.setTextColor(51, 65, 85); // slate-700
                
                // Metadata section
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text(name, 15, 52);
                
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(`Report ID: REP-${Math.floor(100000 + Math.random() * 900000)}`, 15, 60);
                doc.text(`Category: ${category} Analysis`, 15, 66);
                doc.text(`Generated Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 15, 72);
                doc.text(`Generated By: Platform Administrator`, 15, 78);
                doc.text(`Data Classification: Internal Confidentials Only`, 15, 84);
                
                // Divider
                doc.setDrawColor(226, 232, 240); // slate-200
                doc.setLineWidth(0.5);
                doc.line(15, 90, 195, 90);
                
                // Section Title
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("REPORT DATATABLE EXTRACT", 15, 100);
                
                // Render Table Data
                let startY = 110;
                doc.setFontSize(9);
                
                if (category === "Production") {
                    // Table Headers
                    doc.setFillColor(248, 250, 252); // slate-50
                    doc.rect(15, startY, 180, 8, 'F');
                    doc.setFont("helvetica", "bold");
                    doc.text("Operational Metric Indicator", 18, startY + 6);
                    doc.text("Target Value", 90, startY + 6);
                    doc.text("Actual Measured", 130, startY + 6);
                    doc.text("Variance Rate", 170, startY + 6);
                    
                    doc.setFont("helvetica", "normal");
                    const prodData = [
                        ["Daily Production Yield Output", "12,000 Units", "11,850 Units", "-1.25%"],
                        ["Equipment Efficiency (OEE)", "85.0% Min", "88.2% Avg", "+3.20%"],
                        ["Packaging Throughput Log", "8,000 Units", "8,120 Units", "+1.50%"],
                        ["Quality Inspection Pass Rate", "98.0% Rate", "98.7% Actual", "+0.70%"],
                        ["Energy Consumption Efficiency", "420 kWh/ton", "415 kWh/ton", "+1.19%"],
                        ["Raw Material Waste Ratio", "2.0% Max", "1.85% Actual", "+0.15%"]
                    ];
                    
                    prodData.forEach((row, i) => {
                        const rowY = startY + 8 + (i * 8);
                        // Alternating background
                        if (i % 2 === 1) {
                            doc.setFillColor(241, 245, 249); // slate-100
                            doc.rect(15, rowY, 180, 8, 'F');
                        }
                        doc.text(row[0], 18, rowY + 6);
                        doc.text(row[1], 90, rowY + 6);
                        doc.text(row[2], 130, rowY + 6);
                        // Red color for negative variance, green for positive
                        if (row[3].startsWith("-")) {
                            doc.setTextColor(220, 38, 38); // red-600
                        } else {
                            doc.setTextColor(22, 163, 74); // green-600
                        }
                        doc.text(row[3], 170, rowY + 6);
                        doc.setTextColor(51, 65, 85); // reset
                    });
                } else if (category === "Machine") {
                    // Table Headers
                    doc.setFillColor(248, 250, 252);
                    doc.rect(15, startY, 180, 8, 'F');
                    doc.setFont("helvetica", "bold");
                    doc.text("Machine Asset Code / Name", 18, startY + 6);
                    doc.text("Operational Status", 90, startY + 6);
                    doc.text("Health Index", 130, startY + 6);
                    doc.text("Maintenance Due", 160, startY + 6);
                    
                    doc.setFont("helvetica", "normal");
                    const machineData = [
                        ["MAC-001 - CNC Cutting Mill A", "RUNNING (Active)", "94.5% Excellent", "28 Jun 2026"],
                        ["MAC-002 - Robotic Welding Arm B", "RUNNING (Active)", "89.0% Good", "14 Jul 2026"],
                        ["MAC-003 - Laser Engraver C", "IDLE (Standby)", "78.2% Fair", "18 Jun 2026"],
                        ["MAC-004 - Hydraulic Press D", "MAINTENANCE (Stop)", "62.0% Critical", "Immediate"],
                        ["MAC-005 - Heavy Conveyor Belt E", "RUNNING (Active)", "91.8% Excellent", "05 Aug 2026"],
                        ["MAC-006 - Packaging Automator F", "RUNNING (Active)", "87.4% Good", "22 Jul 2026"]
                    ];
                    
                    machineData.forEach((row, i) => {
                        const rowY = startY + 8 + (i * 8);
                        if (i % 2 === 1) {
                            doc.setFillColor(241, 245, 249);
                            doc.rect(15, rowY, 180, 8, 'F');
                        }
                        doc.text(row[0], 18, rowY + 6);
                        doc.text(row[1], 90, rowY + 6);
                        doc.text(row[2], 130, rowY + 6);
                        doc.text(row[3], 160, rowY + 6);
                    });
                } else if (category === "Employee") {
                    // Table Headers
                    doc.setFillColor(248, 250, 252);
                    doc.rect(15, startY, 180, 8, 'F');
                    doc.setFont("helvetica", "bold");
                    doc.text("Employee Name", 18, startY + 6);
                    doc.text("Department Assigned", 75, startY + 6);
                    doc.text("Shift Hours Completed", 120, startY + 6);
                    doc.text("Performance Rating", 160, startY + 6);
                    
                    doc.setFont("helvetica", "normal");
                    const empData = [
                        ["Sarah Jenkins", "Production Line A", "42.5 hrs", "96.4% Outstanding"],
                        ["Michael Chen", "Assembly Area C", "39.0 hrs", "92.0% Satisfactory"],
                        ["David Rodriguez", "Packaging Section D", "40.0 hrs", "88.5% Commendable"],
                        ["Emily Taylor", "Quality Control Lab", "41.5 hrs", "95.2% Outstanding"],
                        ["James O'Connor", "Maintenance Squad", "45.0 hrs", "91.0% Satisfactory"],
                        ["Jessica Patel", "Warehouse & Logistics", "38.5 hrs", "89.2% Commendable"]
                    ];
                    
                    empData.forEach((row, i) => {
                        const rowY = startY + 8 + (i * 8);
                        if (i % 2 === 1) {
                            doc.setFillColor(241, 245, 249);
                            doc.rect(15, rowY, 180, 8, 'F');
                        }
                        doc.text(row[0], 18, rowY + 6);
                        doc.text(row[1], 75, rowY + 6);
                        doc.text(row[2], 120, rowY + 6);
                        doc.text(row[3], 160, rowY + 6);
                    });
                } else {
                    // Audit Reports Table Headers
                    doc.setFillColor(248, 250, 252);
                    doc.rect(15, startY, 180, 8, 'F');
                    doc.setFont("helvetica", "bold");
                    doc.text("Timestamp / Log Occurred", 18, startY + 6);
                    doc.text("Operator Username", 70, startY + 6);
                    doc.text("Activity Description Action", 110, startY + 6);
                    doc.text("System Result", 170, startY + 6);
                    
                    doc.setFont("helvetica", "normal");
                    const auditData = [
                        ["2026-06-07 14:15:22", "admin_root", "Modify CNC machine parameters", "SUCCESS"],
                        ["2026-06-07 13:42:01", "worker_prod_2", "Logged In Shift B Portal", "SUCCESS"],
                        ["2026-06-07 12:05:45", "maint_lead", "Trigger calibration protocol MAC-003", "SUCCESS"],
                        ["2026-06-07 10:10:11", "system_monitor", "Network diagnostic sync completed", "SUCCESS"],
                        ["2026-06-07 09:30:15", "admin_root", "Export reports archive database", "SUCCESS"],
                        ["2026-06-07 08:00:00", "system_auth", "Automatic daily backup generated", "SUCCESS"]
                    ];
                    
                    auditData.forEach((row, i) => {
                        const rowY = startY + 8 + (i * 8);
                        if (i % 2 === 1) {
                            doc.setFillColor(241, 245, 249);
                            doc.rect(15, rowY, 180, 8, 'F');
                        }
                        doc.text(row[0], 18, rowY + 6);
                        doc.text(row[1], 70, rowY + 6);
                        doc.text(row[2], 110, rowY + 6);
                        if (row[3] === "SUCCESS") {
                            doc.setTextColor(22, 163, 74);
                        }
                        doc.text(row[3], 170, rowY + 6);
                        doc.setTextColor(51, 65, 85);
                    });
                }
                
                // Terms / Footer Info
                const footerY = 250;
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.5);
                doc.line(15, footerY, 195, footerY);
                
                doc.setFontSize(8);
                doc.setTextColor(100, 116, 139); // slate-500
                doc.setFont("helvetica", "normal");
                doc.text("DOCUMENT VERIFICATION AND AUTHENTICATION STAMP:", 15, footerY + 6);
                doc.text("This document is generated digitally under active authorization tokens. Signature is not required.", 15, footerY + 11);
                doc.text("Eco-Innovator Hub Industrial Platform - Confidential Audit Record", 15, footerY + 16);
                
                // Signature / Token code representation
                doc.setFont("courier", "bold");
                doc.text(`HASH-TOKEN: SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}`, 15, footerY + 22);
                
                // Save the PDF
                const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
                doc.save(fileName);
                showToast('success', `PDF Report "${fileName}" downloaded.`);
            } catch (error) {
                console.error("Error generating PDF:", error);
                showToast('error', 'Failed to generate PDF Report.');
            }
        } else if (format.toUpperCase() === 'EXCEL') {
            try {
                let headers: string[] = [];
                let data: any[][] = [];
                
                if (category === "Production") {
                    headers = ["Operational Metric Indicator", "Target Value", "Actual Measured", "Variance Rate"];
                    data = [
                        ["Daily Production Yield Output", "12,000 Units", "11,850 Units", "-1.25%"],
                        ["Equipment Efficiency (OEE)", "85.0% Min", "88.2% Avg", "+3.20%"],
                        ["Packaging Throughput Log", "8,000 Units", "8,120 Units", "+1.50%"],
                        ["Quality Inspection Pass Rate", "98.0% Rate", "98.7% Actual", "+0.70%"],
                        ["Energy Consumption Efficiency", "420 kWh/ton", "415 kWh/ton", "+1.19%"],
                        ["Raw Material Waste Ratio", "2.0% Max", "1.85% Actual", "+0.15%"]
                    ];
                } else if (category === "Machine") {
                    headers = ["Machine Asset Code / Name", "Operational Status", "Health Index", "Maintenance Due"];
                    data = [
                        ["MAC-001 - CNC Cutting Mill A", "RUNNING (Active)", "94.5% Excellent", "28 Jun 2026"],
                        ["MAC-002 - Robotic Welding Arm B", "RUNNING (Active)", "89.0% Good", "14 Jul 2026"],
                        ["MAC-003 - Laser Engraver C", "IDLE (Standby)", "78.2% Fair", "18 Jun 2026"],
                        ["MAC-004 - Hydraulic Press D", "MAINTENANCE (Stop)", "62.0% Critical", "Immediate"],
                        ["MAC-005 - Heavy Conveyor Belt E", "RUNNING (Active)", "91.8% Excellent", "05 Aug 2026"],
                        ["MAC-006 - Packaging Automator F", "RUNNING (Active)", "87.4% Good", "22 Jul 2026"]
                    ];
                } else if (category === "Employee") {
                    headers = ["Employee Name", "Department Assigned", "Shift Hours Completed", "Performance Rating"];
                    data = [
                        ["Sarah Jenkins", "Production Line A", "42.5 hrs", "96.4% Outstanding"],
                        ["Michael Chen", "Assembly Area C", "39.0 hrs", "92.0% Satisfactory"],
                        ["David Rodriguez", "Packaging Section D", "40.0 hrs", "88.5% Commendable"],
                        ["Emily Taylor", "Quality Control Lab", "41.5 hrs", "95.2% Outstanding"],
                        ["James O'Connor", "Maintenance Squad", "45.0 hrs", "91.0% Satisfactory"],
                        ["Jessica Patel", "Warehouse & Logistics", "38.5 hrs", "89.2% Commendable"]
                    ];
                } else {
                    headers = ["Timestamp / Log Occurred", "Operator Username", "Activity Description Action", "System Result"];
                    data = [
                        ["2026-06-07 14:15:22", "admin_root", "Modify CNC machine parameters", "SUCCESS"],
                        ["2026-06-07 13:42:01", "worker_prod_2", "Logged In Shift B Portal", "SUCCESS"],
                        ["2026-06-07 12:05:45", "maint_lead", "Trigger calibration protocol MAC-003", "SUCCESS"],
                        ["2026-06-07 10:10:11", "system_monitor", "Network diagnostic sync completed", "SUCCESS"],
                        ["2026-06-07 09:30:15", "admin_root", "Export reports archive database", "SUCCESS"],
                        ["2026-06-07 08:00:00", "system_auth", "Automatic daily backup generated", "SUCCESS"]
                    ];
                }

                const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Report Data");
                
                const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`;
                XLSX.writeFile(wb, fileName);
                showToast('success', `Excel Report "${fileName}" downloaded.`);
            } catch (error) {
                console.error("Error generating Excel:", error);
                showToast('error', 'Failed to generate Excel spreadsheet.');
            }
        } else {
            try {
                let headers: string[] = [];
                let data: any[][] = [];
                
                if (category === "Production") {
                    headers = ["Operational Metric Indicator", "Target Value", "Actual Measured", "Variance Rate"];
                    data = [
                        ["Daily Production Yield Output", "12,000 Units", "11,850 Units", "-1.25%"],
                        ["Equipment Efficiency (OEE)", "85.0% Min", "88.2% Avg", "+3.20%"],
                        ["Packaging Throughput Log", "8,000 Units", "8,120 Units", "+1.50%"],
                        ["Quality Inspection Pass Rate", "98.0% Rate", "98.7% Actual", "+0.70%"],
                        ["Energy Consumption Efficiency", "420 kWh/ton", "415 kWh/ton", "+1.19%"],
                        ["Raw Material Waste Ratio", "2.0% Max", "1.85% Actual", "+0.15%"]
                    ];
                } else if (category === "Machine") {
                    headers = ["Machine Asset Code / Name", "Operational Status", "Health Index", "Maintenance Due"];
                    data = [
                        ["MAC-001 - CNC Cutting Mill A", "RUNNING (Active)", "94.5% Excellent", "28 Jun 2026"],
                        ["MAC-002 - Robotic Welding Arm B", "RUNNING (Active)", "89.0% Good", "14 Jul 2026"],
                        ["MAC-003 - Laser Engraver C", "IDLE (Standby)", "78.2% Fair", "18 Jun 2026"],
                        ["MAC-004 - Hydraulic Press D", "MAINTENANCE (Stop)", "62.0% Critical", "Immediate"],
                        ["MAC-005 - Heavy Conveyor Belt E", "RUNNING (Active)", "91.8% Excellent", "05 Aug 2026"],
                        ["MAC-006 - Packaging Automator F", "RUNNING (Active)", "87.4% Good", "22 Jul 2026"]
                    ];
                } else if (category === "Employee") {
                    headers = ["Employee Name", "Department Assigned", "Shift Hours Completed", "Performance Rating"];
                    data = [
                        ["Sarah Jenkins", "Production Line A", "42.5 hrs", "96.4% Outstanding"],
                        ["Michael Chen", "Assembly Area C", "39.0 hrs", "92.0% Satisfactory"],
                        ["David Rodriguez", "Packaging Section D", "40.0 hrs", "88.5% Commendable"],
                        ["Emily Taylor", "Quality Control Lab", "41.5 hrs", "95.2% Outstanding"],
                        ["James O'Connor", "Maintenance Squad", "45.0 hrs", "91.0% Satisfactory"],
                        ["Jessica Patel", "Warehouse & Logistics", "38.5 hrs", "89.2% Commendable"]
                    ];
                } else {
                    headers = ["Timestamp / Log Occurred", "Operator Username", "Activity Description Action", "System Result"];
                    data = [
                        ["2026-06-07 14:15:22", "admin_root", "Modify CNC machine parameters", "SUCCESS"],
                        ["2026-06-07 13:42:01", "worker_prod_2", "Logged In Shift B Portal", "SUCCESS"],
                        ["2026-06-07 12:05:45", "maint_lead", "Trigger calibration protocol MAC-003", "SUCCESS"],
                        ["2026-06-07 10:10:11", "system_monitor", "Network diagnostic sync completed", "SUCCESS"],
                        ["2026-06-07 09:30:15", "admin_root", "Export reports archive database", "SUCCESS"],
                        ["2026-06-07 08:00:00", "system_auth", "Automatic daily backup generated", "SUCCESS"]
                    ];
                }

                const csvRows = [
                    headers.map(val => `"${val.replace(/"/g, '""')}"`).join(","),
                    ...data.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
                ].join("\n");

                const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('success', `CSV Report "${fileName}" downloaded.`);
            } catch (error) {
                console.error("Error generating CSV:", error);
                showToast('error', 'Failed to generate CSV file.');
            }
        }
    };

    // Export All Reports List (Real generation for PDF, Excel, and CSV)
    const handleExportAll = (format: string) => {
        showToast('success', `Exporting all reports index list as ${format}...`);
        
        if (format === 'PDF') {
            try {
                const doc = new jsPDF();
                
                // Draw header banner
                doc.setFillColor(67, 56, 202); // indigo-700
                doc.rect(0, 0, 210, 38, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(18);
                doc.text("ECO-INNOVATOR HUB REPORTS LISTING LOG", 15, 20);
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text("Generated index of all archived and live industrial reports", 15, 28);
                
                doc.setDrawColor(79, 70, 229);
                doc.setLineWidth(1);
                doc.line(0, 38, 210, 38);
                
                doc.setTextColor(51, 65, 85);
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Active Report Archive Catalog", 15, 50);
                
                doc.setFontSize(9);
                let startY = 60;
                
                // Table Headers
                doc.setFillColor(248, 250, 252);
                doc.rect(15, startY, 180, 8, 'F');
                doc.text("Report ID", 18, startY + 6);
                doc.text("Report Name", 45, startY + 6);
                doc.text("Category", 110, startY + 6);
                doc.text("Generated By", 135, startY + 6);
                doc.text("Date", 160, startY + 6);
                doc.text("Format", 185, startY + 6);
                
                doc.setFont("helvetica", "normal");
                recentReports.forEach((row, i) => {
                    const rowY = startY + 8 + (i * 8);
                    if (i % 2 === 1) {
                        doc.setFillColor(241, 245, 249);
                        doc.rect(15, rowY, 180, 8, 'F');
                    }
                    doc.text(row.id, 18, rowY + 6);
                    let nameStr = row.name;
                    if (nameStr.length > 30) nameStr = nameStr.substring(0, 28) + "...";
                    doc.text(nameStr, 45, rowY + 6);
                    doc.text(row.category, 110, rowY + 6);
                    doc.text(row.generatedBy, 135, rowY + 6);
                    doc.text(row.date, 160, rowY + 6);
                    doc.text(row.format, 185, rowY + 6);
                });
                
                const fileName = `reports_archive_index_${new Date().toISOString().split('T')[0]}.pdf`;
                doc.save(fileName);
                showToast('success', `PDF index listing saved.`);
            } catch (error) {
                console.error("PDF Index generate error:", error);
                showToast('error', 'Failed to generate PDF index.');
            }
        } else if (format === 'Excel') {
            try {
                const headers = ["Report ID", "Report Name", "Category", "Generated By", "Generated Date", "Format", "Status"];
                const data = recentReports.map(r => [r.id, r.name, r.category, r.generatedBy, r.date, r.format, r.status]);
                
                const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Reports Archive Index");
                
                const fileName = `reports_archive_index_${new Date().toISOString().split('T')[0]}.xlsx`;
                XLSX.writeFile(wb, fileName);
                showToast('success', `Excel index listing saved.`);
            } catch (error) {
                console.error("Excel Index generate error:", error);
                showToast('error', 'Failed to generate Excel index.');
            }
        } else if (format === 'CSV') {
            try {
                const headers = ["Report ID", "Report Name", "Category", "Generated By", "Generated Date", "Format", "Status"];
                const data = recentReports.map(r => [r.id, r.name, r.category, r.generatedBy, r.date, r.format, r.status]);
                
                const csvRows = [
                    headers.map(val => `"${val.replace(/"/g, '""')}"`).join(","),
                    ...data.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
                ].join("\n");
                
                const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                const fileName = `reports_archive_index_${new Date().toISOString().split('T')[0]}.csv`;
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('success', `CSV index listing saved.`);
            } catch (error) {
                console.error("CSV Index generate error:", error);
                showToast('error', 'Failed to generate CSV index.');
            }
        }
    };

    // Status Pill Badge Style Helper
    type StatusType = 'Completed' | 'Processing' | 'Failed' | 'Scheduled' | 'Active';
    const StatusBadge = ({ status }: { status: StatusType }) => {
        const styles: Record<StatusType, string> = {
            Completed: 'bg-green-100 text-green-800 border border-green-200',
            Processing: 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse',
            Failed: 'bg-red-100 text-red-800 border border-red-200',
            Scheduled: 'bg-amber-100 text-amber-800 border border-amber-200',
            Active: 'bg-indigo-100 text-indigo-800 border border-indigo-200'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                {status}
            </span>
        );
    };

    // Format Icon Helper
    const FormatIcon = ({ format }: { format: string }) => {
        if (format === 'PDF') return <File className="w-4 h-4 text-rose-500" />;
        if (format === 'Excel') return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
        return <FileText className="w-4 h-4 text-blue-500" />;
    };

    if (loading) {
        return <IntegratedLoader />;
    }

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
            <nav className="flex items-center text-sm font-medium text-slate-500 mb-3" aria-label="Breadcrumb">
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-semibold text-indigo-600">Reports</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-semibold text-indigo-600">Reports Center</span>
            </nav>

            {/* Header */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white drop-shadow-2xl leading-tight">
                            Reports Center
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-lg text-white/90 font-bold drop-shadow-lg mt-2">
                            Generate, manage, export, and monitor factory reports from a centralized location.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative">
                        <Button 
                            onClick={scrollToForm}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xl"
                        >
                            Generate Report
                        </Button>
                        <Button 
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all font-bold rounded-xl flex items-center gap-2 shadow-xl"
                        >
                            <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            Export All Reports
                        </Button>
                        {isExportOpen && (
                            <div className="absolute right-0 top-12 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20">
                                <button 
                                    onClick={() => { handleExportAll('PDF'); setIsExportOpen(false); }}
                                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium text-sm flex items-center gap-2"
                                >
                                    <File className="w-4 h-4 text-rose-500" />
                                    Export PDF List
                                </button>
                                <button 
                                    onClick={() => { handleExportAll('Excel'); setIsExportOpen(false); }}
                                    className="w-full px-4 py-3 text-left hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium text-sm flex items-center gap-2"
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                                    Export Excel List
                                </button>
                                <button 
                                    onClick={() => { handleExportAll('CSV'); setIsExportOpen(false); }}
                                    className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium text-sm flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Export CSV List
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Reports"
                    value={126}
                    subtitle="Reports available in the system"
                    icon={FileText}
                    color="blue"
                />
                <StatCard
                    title="Generated This Month"
                    value={34}
                    subtitle="Generated during current month"
                    icon={Calendar}
                    color="green"
                />
                <StatCard
                    title="Downloaded Reports"
                    value={89}
                    subtitle="Successfully downloaded reports"
                    icon={CheckCircle}
                    color="indigo"
                />
                <StatCard
                    title="Scheduled Reports"
                    value={12}
                    subtitle="Automatically generated reports"
                    icon={Clock}
                    color="purple"
                />
            </div>

            {/* Report Categories Section */}
            <div className="space-y-4">
                <div className="backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/10">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Report Categories</h2>
                    <p className="text-sm text-gray-700 font-semibold">Generate reports instantly by selecting a category module</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category 1 */}
                    <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                        <div>
                            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-block mb-4 shadow-inner">
                                <FileText className="w-6 h-6" />
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Production Reports</h3>
                            <ul className="text-xs text-slate-500 space-y-2 mb-6 list-disc list-inside">
                                <li>Daily Production Report</li>
                                <li>Weekly Production Report</li>
                                <li>Monthly Production Report</li>
                                <li>Target vs Actual Production</li>
                            </ul>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadReport('Production Template', 'PDF')}
                                className="w-full text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                View
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={() => { setReportType('Production Report'); scrollToForm(); }}
                                className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Category 2 */}
                    <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                        <div>
                            <span className="p-3 bg-purple-50 text-purple-600 rounded-xl inline-block mb-4 shadow-inner">
                                <Settings className="w-6 h-6" />
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Machine Reports</h3>
                            <ul className="text-xs text-slate-500 space-y-2 mb-6 list-disc list-inside">
                                <li>Machine Utilization</li>
                                <li>Machine Downtime</li>
                                <li>Machine Maintenance History</li>
                                <li>Machine Health Summary</li>
                            </ul>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadReport('Machine Template', 'PDF')}
                                className="w-full text-xs font-bold border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                                View
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={() => { setReportType('Machine Report'); scrollToForm(); }}
                                className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Category 3 */}
                    <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                        <div>
                            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block mb-4 shadow-inner">
                                <ClipboardList className="w-6 h-6" />
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Employee Reports</h3>
                            <ul className="text-xs text-slate-500 space-y-2 mb-6 list-disc list-inside">
                                <li>Attendance Report</li>
                                <li>Employee Performance Report</li>
                                <li>Worker Productivity Report</li>
                                <li>Shift Performance Report</li>
                            </ul>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadReport('Employee Template', 'PDF')}
                                className="w-full text-xs font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                View
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={() => { setReportType('Employee Report'); scrollToForm(); }}
                                className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Category 4 */}
                    <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                        <div>
                            <span className="p-3 bg-amber-50 text-amber-600 rounded-xl inline-block mb-4 shadow-inner">
                                <ShieldAlert className="w-6 h-6" />
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Audit Reports</h3>
                            <ul className="text-xs text-slate-500 space-y-2 mb-6 list-disc list-inside">
                                <li>User Login Activity</li>
                                <li>System Logs</li>
                                <li>User Actions</li>
                                <li>Security Events</li>
                            </ul>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadReport('Audit Template', 'PDF')}
                                className="w-full text-xs font-bold border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                                View
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={() => { setReportType('Audit Report'); scrollToForm(); }}
                                className="w-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Generate
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate Report Form Section */}
            <div id="generation-form" className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white p-6 md:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                        <Play className="h-6 w-6" />
                        Generate On-Demand Report
                    </h3>
                    <p className="text-emerald-100 text-sm mt-1">Configure report criteria and choose your desired export formatting.</p>
                </div>
                <form onSubmit={handleGenerateReport} className="p-6 md:p-8 space-y-6 text-slate-700 text-sm font-semibold">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Report Type */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-600 font-bold">Report Type *</label>
                            <select 
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                            >
                                <option value="Production Report">Production Report</option>
                                <option value="Machine Report">Machine Report</option>
                                <option value="Employee Report">Employee Report</option>
                                <option value="Audit Report">Audit Report</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-600 font-bold">Department *</label>
                            <select 
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                            >
                                <option value="All Departments">All Departments</option>
                                <option value="Production">Production</option>
                                <option value="Assembly">Assembly</option>
                                <option value="Packaging">Packaging</option>
                                <option value="Quality Control">Quality Control</option>
                                <option value="Warehouse">Warehouse</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-600 font-bold">Start Date *</label>
                            <input 
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                                required
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-600 font-bold">End Date *</label>
                            <input 
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Export Format */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-600 font-bold">Export Format *</label>
                            <select 
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                            >
                                <option value="PDF">PDF (Portable Document Format)</option>
                                <option value="Excel">Excel Spreadsheet (XLSX)</option>
                                <option value="CSV">CSV Tabular Log (Comma Separated)</option>
                            </select>
                        </div>

                        {/* Generate Button Container */}
                        <div className="flex items-end">
                            <Button 
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-2"
                            >
                                <Play className="w-4 h-4 fill-white" />
                                Generate Report
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Recent Reports Table */}
            <Card className="backdrop-blur-xl bg-white/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-white/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-800">
                        <FileText className="h-6 w-6 text-indigo-600" />
                        Recent Reports
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-slate-500 font-semibold mt-1">
                        View, export, or audit the history log of generated on-demand report operations.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Report Name</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Category</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Generated By</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Generated Date</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6 text-center">Format</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6 text-center">Status</TableHead>
                                    <TableHead className="text-right text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentReports.map((row, idx) => (
                                    <TableRow key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-800 font-semibold max-w-xs truncate" title={row.name}>{row.name}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700 font-medium">{row.category}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-500">{row.generatedBy}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-500 whitespace-nowrap">{row.date}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                            <div className="flex justify-center items-center gap-1">
                                                <FormatIcon format={row.format} />
                                                <span className="text-xs font-bold text-slate-600">{row.format}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                            <StatusBadge status={row.status as StatusType} />
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    onClick={() => setSelectedReport(row)}
                                                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                                    disabled={row.status !== 'Completed'}
                                                >
                                                    <Eye className="w-4 h-4 mr-1.5" />
                                                    View
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleDownloadReport(row.name, row.format)}
                                                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                    disabled={row.status !== 'Completed'}
                                                >
                                                    <Download className="w-4 h-4 mr-1.5" />
                                                    Download
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => setDeleteTarget(row)}
                                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Scheduled Reports Section */}
            <Card className="backdrop-blur-xl bg-white/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-white/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-800">
                        <Clock className="h-6 w-6 text-indigo-600" />
                        Scheduled Reports
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-slate-500 font-semibold mt-1">
                        Review auto-generated pipeline reports configured on fixed intervals.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Report Name</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Frequency</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6 text-center">Format</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Next Run Date</TableHead>
                                    <TableHead className="text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6 text-center">Status</TableHead>
                                    <TableHead className="text-right text-slate-600 font-bold py-3 sm:py-4 px-3 sm:px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scheduledReports.map((row, idx) => (
                                    <TableRow key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-800 font-semibold">{row.name}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-700 font-medium">{row.frequency}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                            <div className="flex justify-center items-center gap-1">
                                                <FormatIcon format={row.format} />
                                                <span className="text-xs font-bold text-slate-600">{row.format}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base text-slate-500 whitespace-nowrap">{row.nextRun}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                            <StatusBadge status={row.status as StatusType} />
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => {
                                                    console.log(`Triggering instant run for ${row.name}...`);
                                                    showToast('success', `Manual trigger for "${row.name}" has initiated.`);
                                                }}
                                                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                            >
                                                <Play className="w-3.5 h-3.5 mr-1" />
                                                Run Now
                                            </Button>
                                        </td>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Downloads Section */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Download className="w-6 h-6 text-indigo-600" />
                    Quick Downloads
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col justify-between gap-4 shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Today's Production Report</h4>
                            <p className="text-xs text-slate-500 mt-1 font-semibold">Immediate PDF export of line metrics</p>
                        </div>
                        <Button 
                            onClick={() => handleDownloadReport("Today's Production Report", 'PDF')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-lg"
                        >
                            Download PDF
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex flex-col justify-between gap-4 shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Machine Maintenance Report</h4>
                            <p className="text-xs text-slate-500 mt-1 font-semibold">Asset log history spreadsheet</p>
                        </div>
                        <Button 
                            onClick={() => handleDownloadReport("Machine Maintenance Report", 'Excel')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-lg"
                        >
                            Download Excel
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col justify-between gap-4 shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Employee Attendance Report</h4>
                            <p className="text-xs text-slate-500 mt-1 font-semibold">Shift register list CSV layout</p>
                        </div>
                        <Button 
                            onClick={() => handleDownloadReport("Employee Attendance Report", 'CSV')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-lg"
                        >
                            Download CSV
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 flex flex-col justify-between gap-4 shadow-sm">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Audit Activity Report</h4>
                            <p className="text-xs text-slate-500 mt-1 font-semibold">Security logs catalog output</p>
                        </div>
                        <Button 
                            onClick={() => handleDownloadReport("Audit Activity Report", 'PDF')}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 rounded-lg"
                        >
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>

            {/* View Report Preview Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden transform transition-all duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Report Preview</h3>
                                <p className="text-sm text-blue-100 mt-1">ID: {selectedReport.id} • {selectedReport.name}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedReport(null)} 
                                className="text-white/85 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-slate-700 text-sm font-semibold">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-xs text-slate-500">Report Category</span>
                                    <p className="font-bold text-slate-800">{selectedReport.category}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">Export Format</span>
                                    <p className="font-bold text-slate-800">{selectedReport.format}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">Generated Date</span>
                                    <p className="font-bold text-slate-800">{selectedReport.date}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">Generated By</span>
                                    <p className="font-bold text-slate-800">{selectedReport.generatedBy}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <h4 className="font-bold text-slate-800 mb-2">Tabular Data Summary Preview</h4>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-100">
                                            <TableRow>
                                                <TableHead className="py-2 px-3 text-slate-600 font-bold">Indicator Metric</TableHead>
                                                <TableHead className="py-2 px-3 text-slate-600 font-bold text-center">Total Target</TableHead>
                                                <TableHead className="py-2 px-3 text-slate-600 font-bold text-center">Actual Measured</TableHead>
                                                <TableHead className="py-2 px-3 text-slate-600 font-bold text-right">Variance Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="border-b border-slate-100">
                                                <td className="py-2 px-3 font-medium text-slate-700">Production Yield Output</td>
                                                <td className="py-2 px-3 text-center text-slate-600">10,000 Units</td>
                                                <td className="py-2 px-3 text-center text-slate-800 font-semibold">9,820 Units</td>
                                                <td className="py-2 px-3 text-right text-red-600 font-semibold">-1.8%</td>
                                            </TableRow>
                                            <TableRow className="border-b border-slate-100">
                                                <td className="py-2 px-3 font-medium text-slate-700">Machine Power Utilization</td>
                                                <td className="py-2 px-3 text-center text-slate-600">85.0% Min</td>
                                                <td className="py-2 px-3 text-center text-slate-800 font-semibold">89.4% Avg</td>
                                                <td className="py-2 px-3 text-right text-green-600 font-semibold">+4.4%</td>
                                            </TableRow>
                                            <TableRow className="border-b border-slate-100">
                                                <td className="py-2 px-3 font-medium text-slate-700">Employee Shift Compliance</td>
                                                <td className="py-2 px-3 text-center text-slate-600">95.0% Target</td>
                                                <td className="py-2 px-3 text-center text-slate-800 font-semibold">94.5% Actual</td>
                                                <td className="py-2 px-3 text-right text-amber-600 font-semibold">-0.5%</td>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    alert("Printing report content...");
                                }}
                                className="flex items-center gap-1.5 text-slate-700"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDownloadReport(selectedReport.name, selectedReport.format);
                                    setSelectedReport(null);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                            >
                                <Download className="w-4 h-4" />
                                Download Report
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedReport(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold border-0"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden p-6 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <Trash2 className="w-6 h-6" />
                            <h3 className="text-lg font-bold">Delete Report</h3>
                        </div>
                        <p className="text-slate-600 text-sm font-medium">
                            Are you sure you want to delete this report from the archive? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                onClick={() => setDeleteTarget(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold border-0"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteReport}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold border-0"
                            >
                                Delete
                            </Button>
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
                        {toast.type === 'success' ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5 stroke-[3]" />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
