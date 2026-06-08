'use client';

import React from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';

interface HeaderProps {
  title?: string;
  userName?: string;
  dashboardTitle?: string;
}


export default function Header({ userName, dashboardTitle }: HeaderProps) {
  return (
    <header className="w-full px-4 sm:px-6 py-4 bg-white border-b flex items-center justify-between" style={{ minHeight: '68px' }}>
      {/* Logo and Title */}
      <div className="flex items-center space-x-3 ml-0 lg:ml-0">
        {/* Add margin for mobile menu button on mobile/tablet */}
        <div className="ml-12 lg:ml-0 flex items-center space-x-3">
          <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center font-bold text-lg">
            N
          </div>
          <div className="block">
            <div className="font-semibold text-base sm:text-lg text-gray-900">
              <span className="hidden md:inline">Eco-Innovator Hub</span>
              <span className="md:hidden">Eco-Innovator Hub</span>
            </div>
            {dashboardTitle && (
              <div className="text-xs sm:text-sm text-gray-500">{dashboardTitle}</div>
            )}
          </div>
        </div>
      </div>



      {/* Notification & User */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        <div className="relative">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </div>
          <span className="hidden sm:inline text-gray-700 text-sm">{dashboardTitle || userName}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
