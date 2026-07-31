import React from 'react';
import { cn } from './Button';

export default function SummaryCard({ title, value, icon: Icon, colorClass = "text-blue-600", bgClass = "bg-blue-50" }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
      <div className={cn("p-4 rounded-xl", bgClass, colorClass)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
