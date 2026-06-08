'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'indigo' | 'emerald' | 'amber' | 'sky' | 'violet' | 'pink';
  className?: string;
  onClick?: () => void;
}

const colorVariants = {
  blue: {
    bg: 'from-sky-600 to-blue-700',
    hoverBg: 'hover:from-sky-700 hover:to-blue-800',
    shadow: 'shadow-blue-500/30',
    hoverShadow: 'hover:shadow-sky-500/50',
    ring: 'hover:ring-sky-400/50',
    textHover: 'group-hover:text-blue-50'
  },
  green: {
    bg: 'from-emerald-600 to-green-700',
    hoverBg: 'hover:from-emerald-700 hover:to-green-800',
    shadow: 'shadow-green-500/30',
    hoverShadow: 'hover:shadow-emerald-500/50',
    ring: 'hover:ring-emerald-400/50',
    textHover: 'group-hover:text-emerald-50'
  },
  orange: {
    bg: 'from-yellow-600 to-orange-600',
    hoverBg: 'hover:from-yellow-700 hover:to-orange-700',
    shadow: 'shadow-orange-600/40',
    hoverShadow: 'hover:shadow-orange-600/60',
    ring: 'hover:ring-orange-500/60',
    textHover: 'group-hover:text-orange-50'
  },
  red: {
    bg: 'from-red-600 to-pink-600',
    hoverBg: 'hover:from-red-700 hover:to-pink-700',
    shadow: 'shadow-red-500/30',
    hoverShadow: 'hover:shadow-red-500/50',
    ring: 'hover:ring-red-400/50',
    textHover: 'group-hover:text-red-50'
  },
  purple: {
    bg: 'from-purple-600 to-violet-700',
    hoverBg: 'hover:from-purple-700 hover:to-violet-800',
    shadow: 'shadow-purple-500/30',
    hoverShadow: 'hover:shadow-purple-500/50',
    ring: 'hover:ring-purple-400/50',
    textHover: 'group-hover:text-purple-50'
  },
  indigo: {
    bg: 'from-indigo-600 to-blue-700',
    hoverBg: 'hover:from-indigo-700 hover:to-blue-800',
    shadow: 'shadow-indigo-500/30',
    hoverShadow: 'hover:shadow-indigo-500/50',
    ring: 'hover:ring-indigo-400/50',
    textHover: 'group-hover:text-indigo-50'
  },
  emerald: {
    bg: 'from-emerald-600 to-teal-700',
    hoverBg: 'hover:from-emerald-700 hover:to-teal-800',
    shadow: 'shadow-emerald-500/30',
    hoverShadow: 'hover:shadow-emerald-500/50',
    ring: 'hover:ring-emerald-400/50',
    textHover: 'group-hover:text-emerald-50'
  },
  amber: {
    bg: 'from-amber-600 to-yellow-500',
    hoverBg: 'hover:from-amber-700 hover:to-yellow-600',
    shadow: 'shadow-amber-600/40',
    hoverShadow: 'hover:shadow-amber-600/60',
    ring: 'hover:ring-amber-500/60',
    textHover: 'group-hover:text-amber-50'
  },
  sky: {
    bg: 'from-sky-600 to-cyan-700',
    hoverBg: 'hover:from-sky-700 hover:to-cyan-800',
    shadow: 'shadow-sky-500/30',
    hoverShadow: 'hover:shadow-sky-500/50',
    ring: 'hover:ring-sky-400/50',
    textHover: 'group-hover:text-sky-50'
  },
  violet: {
    bg: 'from-violet-600 to-purple-700',
    hoverBg: 'hover:from-violet-700 hover:to-purple-800',
    shadow: 'shadow-violet-500/30',
    hoverShadow: 'hover:shadow-violet-500/50',
    ring: 'hover:ring-violet-400/50',
    textHover: 'group-hover:text-violet-50'
  },
  pink: {
    bg: 'from-pink-600 to-rose-700',
    hoverBg: 'hover:from-pink-700 hover:to-rose-800',
    shadow: 'shadow-pink-500/30',
    hoverShadow: 'hover:shadow-pink-500/50',
    ring: 'hover:ring-pink-400/50',
    textHover: 'group-hover:text-pink-50'
  }
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  className,
  onClick
}: StatCardProps) {
  const colorConfig = colorVariants[color];

  return (
    <div 
      className={cn(
        "group w-full bg-gradient-to-br text-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl lg:shadow-2xl hover:shadow-xl sm:hover:shadow-2xl lg:hover:shadow-3xl hover:ring-1 sm:hover:ring-2 transition-all duration-300 relative overflow-hidden min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]",
        colorConfig.bg,
        colorConfig.hoverBg,
        colorConfig.shadow,
        colorConfig.hoverShadow,
        colorConfig.ring,
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >      
      <div className="flex items-start sm:items-center justify-between relative z-10 h-full">
        <div className="relative flex-1 min-w-0">
          {/* Title */}
          <div className="relative">
            <p className={cn(
              "text-xs sm:text-sm lg:text-base font-semibold transition-colors duration-300 relative z-10 text-white leading-tight",
              colorConfig.textHover
            )}>
              {title}
            </p>
          </div>
          
          {/* Value */}
          <div className="relative mt-1 sm:mt-2">
            <p className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold group-hover:scale-105 transition-transform duration-300 relative z-10 text-white leading-none">
              {value}
            </p>
            {/* Subtle Underline Effect */}
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-white/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
          
          {subtitle && (
            <div className="relative mt-1">
              <p className="text-xs sm:text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 relative z-10 text-white/90 leading-tight">
                {subtitle}
              </p>
            </div>
          )}
        </div>
        
        {/* Icon Container */}
        <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-white/15 rounded-lg sm:rounded-xl group-hover:bg-white/25 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative backdrop-blur-sm ml-2 sm:ml-3">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 opacity-90 group-hover:opacity-100 transition-all duration-300 relative z-10" />
        </div>
      </div>
      
      {/* Background decorative elements for mobile */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
    </div>
  );
}