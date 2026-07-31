import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UpcomingReminders({ prescriptions }) {
  // Extract all reminders
  let allReminders = [];
  
  prescriptions.forEach(p => {
    // If the prescription object has embedded reminders or if we had fetched them
    // Note: the backend `getPrescriptions` returns `PrescriptionHistoryModel` which has `reminder_count`
    // but not the actual reminders list. 
    // Since we don't have the actual reminders list without making N API calls,
    // we'll just display a simplified summary directing them to the Reminders page.
  });

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-sm border border-orange-200 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-500 p-2 rounded-xl shadow-sm text-white">
          <Clock className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Upcoming Reminders</h3>
      </div>
      
      <p className="text-sm text-orange-800 mb-5 font-medium leading-relaxed">
        Stay on top of your health! Check your daily schedule to see when it's time to take your next medication.
      </p>

      <Link 
        to="/reminders" 
        className="block w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-orange-200 text-center rounded-xl font-bold text-orange-600 transition-colors shadow-sm"
      >
        View Today's Schedule
      </Link>
    </div>
  );
}
