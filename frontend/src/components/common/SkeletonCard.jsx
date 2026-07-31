import React from 'react';
import { cn } from './Button';

export default function SkeletonCard({ className }) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex items-center gap-4", className)}>
      <div className="h-14 w-14 bg-gray-200 rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}
