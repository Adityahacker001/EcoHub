'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SvgIconComponent } from "@mui/icons-material";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: typeof LucideIcon | SvgIconComponent; // Allow Material-UI icons
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'indigo';
  description?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    text: 'text-blue-600',
    lightBg: 'bg-blue-50'
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    text: 'text-green-600',
    lightBg: 'bg-green-50'
  },
  orange: {
    bg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    text: 'text-orange-600',
    lightBg: 'bg-orange-50'
  },
  red: {
    bg: 'bg-gradient-to-br from-red-600 to-rose-700',
    text: 'text-red-600',
    lightBg: 'bg-red-50'
  },
  purple: {
    bg: 'bg-gradient-to-br from-fuchsia-600 to-pink-600',
    text: 'text-purple-600',
    lightBg: 'bg-purple-50'
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    text: 'text-indigo-600',
    lightBg: 'bg-indigo-50'
  }
};

const changeIcons = {
    increase: <TrendingUp className="h-4 w-4 text-white/90" />,
    decrease: <TrendingDown className="h-4 w-4 text-white/90" />,
    neutral: <Minus className="h-4 w-4 text-white/90" />,
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  color = 'blue',
  description
}: DashboardCardProps) {
  const colorConfig = colorVariants[color];

  const displayValue = typeof value === 'string' && value.includes('%') 
    ? value.replace('%', '') 
    : value;

  return (
    <Card className={cn(
      "overflow-hidden backdrop-blur-sm rounded-xl text-white card-hover animate-scaleIn",
      "border border-white/10 shadow-lg hover:shadow-2xl",
      "transition-all duration-500 group",
      colorConfig.bg
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardTitle className="text-sm sm:text-base font-medium text-white/90 relative z-10 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
          {title}
        </CardTitle>
        <div className={cn(
          'p-2 rounded-full bg-white/20 relative z-10',
          'transform transition-all duration-500 icon-hover',
          'group-hover:bg-white/30 group-hover:rotate-12',
          'before:content-[""] before:absolute before:inset-0 before:bg-white/10',
          'before:rounded-full before:scale-150 before:opacity-0',
          'group-hover:before:scale-200 group-hover:before:opacity-10',
          'before:transition-all before:duration-700'
        )}>
          <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6 text-white transform transition-transform')} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="relative">
          <div className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-bold",
            "bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent",
            "animate-slideInRight transform transition-all duration-500",
            "group-hover:scale-105 origin-left"
          )} style={{ animationDelay: '0.2s' }}>
            {displayValue}
            {typeof value === 'string' && value.includes('%') && 
              <span className="text-xl sm:text-2xl md:text-3xl opacity-80">%</span>
            }
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
        {change && (
          <div className="flex items-center text-xs sm:text-sm text-white/90 pt-2 animate-slideInRight" style={{ animationDelay: '0.3s' }}>
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              {changeIcons[changeType]}
            </div>
            <span className="ml-1.5 font-medium">{change}</span>
          </div>
        )}
        {description && !change && (
          <p className="text-xs sm:text-sm text-white/80 pt-2 animate-slideInRight line-clamp-2 group-hover:line-clamp-none transition-all duration-300" style={{ animationDelay: '0.3s' }}>
            {description}
          </p>
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </CardContent>
    </Card>
  );
}