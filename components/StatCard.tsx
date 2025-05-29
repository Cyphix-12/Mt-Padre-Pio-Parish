import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Users, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  className?: string;
  icon?: 'trending' | 'activity' | 'users' | 'dollar';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
  suffix?: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

const iconMap = {
  trending: TrendingUp,
  activity: Activity,
  users: Users,
  dollar: DollarSign,
};

const colorVariants = {
  blue: 'from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/25',
  purple: 'from-purple-500 via-purple-600 to-purple-700 shadow-purple-500/25',
  green: 'from-green-500 via-green-600 to-green-700 shadow-green-500/25',
  orange: 'from-orange-500 via-orange-600 to-orange-700 shadow-orange-500/25',
  pink: 'from-pink-500 via-pink-600 to-pink-700 shadow-pink-500/25',
};

export default function StatCard({ 
  title, 
  value, 
  className = '', 
  icon,
  trend,
  prefix = '',
  suffix = '',
  color = 'blue'
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const IconComponent = icon ? iconMap[icon] : null;
  
  // Animate counter on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-3xl p-6 text-white 
        h-[200px] w-full flex-1
        bg-gradient-to-br ${colorVariants[color]}
        shadow-2xl backdrop-blur-sm
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:shadow-3xl hover:-translate-y-1
        focus-within:scale-[1.02] focus-within:shadow-3xl focus-within:-translate-y-1
        cursor-pointer group
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${prefix}${value}${suffix}`}
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white/30 rounded-full animate-pulse ${
              isHovered ? 'animate-bounce' : ''
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {IconComponent && (
              <div className={`p-2 rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 ${
                isHovered ? 'scale-110 rotate-12' : ''
              }`}>
                <IconComponent size={20} className="text-white" />
              </div>
            )}
            <h3 className="text-sm font-medium text-white/90 leading-tight max-w-[120px]">
              {title}
            </h3>
          </div>
          
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend.isPositive 
                ? 'bg-green-500/20 text-green-200' 
                : 'bg-red-500/20 text-red-200'
            }`}>
              <TrendingUp 
                size={12} 
                className={`${trend.isPositive ? '' : 'rotate-180'} transition-transform duration-300`} 
              />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        {/* Main value */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold mb-1 transition-all duration-300 ${
              isHovered ? 'scale-110 text-white' : 'text-white/95'
            }`}>
              {prefix}{formatNumber(displayValue)}{suffix}
            </div>
            <div className="h-1 w-16 mx-auto bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(displayValue / value) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Subtle bottom accent */}
        <div className="flex justify-center">
          <div className="w-8 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
      
      {/* Glass morphism border */}
      <div className="absolute inset-0 rounded-3xl border border-white/10" />
    </div>
  );
}