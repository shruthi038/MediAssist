import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  Pill, 
  Clock, 
  Bot, 
  User, 
  LogOut 
} from 'lucide-react';
import { cn } from '../common/Button';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
  { path: '/dashboard/documents', label: 'Medical Documents', icon: Files },
  { path: '/dashboard/medicines', label: 'Medicines', icon: Pill },
  { path: '/dashboard/reminders', label: 'Reminders', icon: Clock },
  { path: '/dashboard/assistant', label: 'AI Health Assistant', icon: Bot },
  { path: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">MediAssist</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.comingSoon ? '#' : item.path}
            onClick={(e) => item.comingSoon && e.preventDefault()}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive && !item.comingSoon
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              item.comingSoon && "opacity-70 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5", 
              "group-hover:scale-110 transition-transform"
            )} />
            <span className="flex-1">{item.label}</span>
            {item.comingSoon && (
              <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-700 py-1 px-2 rounded-full">
                Soon
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
