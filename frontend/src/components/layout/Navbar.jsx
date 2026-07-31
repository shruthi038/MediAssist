import React from 'react';
import { User, Bell } from 'lucide-react';

export default function Navbar({ title = "Overview" }) {
  // In a real app, you'd decode the JWT or fetch user details to get the name
  // For now, we'll just say Welcome
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-700">Welcome back!</p>
            <p className="text-xs text-gray-500">Patient</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 border border-blue-200">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
