"use client";

import { useSearchParams } from 'next/navigation';
import Sidebar from './sidebar';
import Header from './header';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'workers' | 'Supervisor' | 'admin' | 'manager';
  name: string;
}

const roleTitles = {
  workers: 'Workers Dashboard',
  Supervisor: 'Supervisor Interface',
  admin: 'Admin Dashboard',
  manager: 'Manager Dashboard',
};

export default function DashboardLayout({ children, role, name }: DashboardLayoutProps) {
  const searchParams = useSearchParams();
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      const newModalRoot = document.createElement('div');
      newModalRoot.id = 'modal-root';
      document.body.appendChild(newModalRoot);
      setModalContainer(newModalRoot);
    } else {
      setModalContainer(modalRoot);
    }
  }, []);

  const title = name || (roleTitles as any)[role] || 'Dashboard';

  return (
    <div className="flex h-screen relative">
      {/* Single Sidebar instance - handles both desktop and mobile */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-64">
        <Header dashboardTitle={title} userName={title} />
        <main className="flex-1 bg-gray-50 p-3 sm:p-4 lg:p-4 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Modal Root for React Portal */}
      {modalContainer && createPortal(<div id="modal-root" />, modalContainer)}
    </div>
  );
}