import React from 'react';
import Button from '../common/Button';
import { FileUp, FilePlus, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        <Button 
          icon={FileUp} 
          className="w-full justify-start text-left" 
          onClick={() => navigate('/dashboard/prescriptions')}
        >
          Upload Prescription
        </Button>
        <Button 
          variant="secondary" 
          icon={FilePlus} 
          className="w-full justify-start text-left"
          onClick={() => navigate('/dashboard/documents')}
        >
          Upload Medical Document
        </Button>
        <Button 
          variant="ghost" 
          icon={Bell} 
          className="w-full justify-start text-left"
          onClick={() => navigate('/dashboard/reminders')}
        >
          View Reminders
        </Button>
      </div>
    </div>
  );
}
