import React, { useState, useEffect } from 'react';
import { getPrescriptions, getPrescriptionDetails } from '../services/api';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { Clock, Loader2, Check, X as CloseIcon } from 'lucide-react';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Frontend-only state since backend doesn't support completing reminders yet
  const [completedReminders, setCompletedReminders] = useState(new Set());
  const [skippedReminders, setSkippedReminders] = useState(new Set());

  useEffect(() => {
    const fetchAllReminders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const prescriptionsData = await getPrescriptions();
        
        const completedPrescriptions = prescriptionsData.filter(
          p => p.processing_status === 'completed'
        );

        const detailsPromises = completedPrescriptions.map(p => 
          getPrescriptionDetails(p.prescription_id)
        );
        
        const detailsResults = await Promise.all(detailsPromises);

        let allReminders = [];
        detailsResults.forEach(detail => {
          if (detail.reminders && Array.isArray(detail.reminders)) {
            const remsWithSource = detail.reminders.map(r => ({
              ...r,
              // Create a unique ID since backend doesn't return one for the reminder itself
              id: `${detail.prescription.id}-${r.medicine_name}-${r.reminder_time}-${r.reminder_type}`,
              source_filename: detail.prescription.original_filename
            }));
            allReminders = [...allReminders, ...remsWithSource];
          }
        });

        // Sort by time
        allReminders.sort((a, b) => a.reminder_time.localeCompare(b.reminder_time));
        
        setReminders(allReminders);
      } catch (err) {
        console.error("Error fetching reminders:", err);
        setError("Failed to load your reminders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllReminders();
  }, []);

  const handleAction = (id, action) => {
    if (action === 'complete') {
      setCompletedReminders(prev => new Set(prev).add(id));
      setSkippedReminders(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else if (action === 'skip') {
      setSkippedReminders(prev => new Set(prev).add(id));
      setCompletedReminders(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Group by time of day (Morning, Afternoon, Evening, Night)
  const groupedReminders = reminders.reduce((acc, reminder) => {
    const hour = parseInt(reminder.reminder_time.split(':')[0], 10);
    let timeOfDay = 'Night';
    if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';

    if (!acc[timeOfDay]) acc[timeOfDay] = [];
    acc[timeOfDay].push(reminder);
    return acc;
  }, { 'Morning': [], 'Afternoon': [], 'Evening': [], 'Night': [] });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Reminders</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your medication schedule.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
          <p className="text-gray-500">Loading your schedule...</p>
        </div>
      ) : reminders.length > 0 ? (
        <div className="space-y-8">
          {['Morning', 'Afternoon', 'Evening', 'Night'].map((timeOfDay) => {
            const periodReminders = groupedReminders[timeOfDay];
            if (periodReminders.length === 0) return null;

            return (
              <div key={timeOfDay} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
                  {timeOfDay}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {periodReminders.map(rem => {
                    const isCompleted = completedReminders.has(rem.id);
                    const isSkipped = skippedReminders.has(rem.id);

                    return (
                      <div 
                        key={rem.id} 
                        className={`bg-white rounded-2xl p-5 shadow-sm border flex flex-col transition-all
                          ${isCompleted ? 'border-green-200 bg-green-50/30' : 
                            isSkipped ? 'border-gray-200 bg-gray-50 opacity-75' : 'border-gray-100 hover:shadow-md'}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`font-bold text-xl px-3 py-1 rounded-lg border ${
                            isCompleted ? 'bg-green-100 text-green-700 border-green-200' :
                            isSkipped ? 'bg-gray-200 text-gray-600 border-gray-300' :
                            'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                            {rem.reminder_time.substring(0, 5)}
                          </div>
                          {isCompleted && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Taken</span>}
                          {isSkipped && <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Skipped</span>}
                        </div>

                        <div className="flex-1">
                          <h4 className={`text-lg font-bold ${isCompleted || isSkipped ? 'text-gray-600 line-through decoration-gray-400' : 'text-gray-900'}`}>
                            {rem.medicine_name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{rem.dose_description}</p>
                          <p className="text-xs text-gray-400 mt-2 capitalize">
                            {rem.frequency} • {rem.reminder_type.replace('_', ' ')}
                          </p>
                        </div>

                        {!isCompleted && !isSkipped && (
                          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                            <Button 
                              variant="ghost" 
                              className="flex-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200"
                              onClick={() => handleAction(rem.id, 'skip')}
                            >
                              Skip
                            </Button>
                            <Button 
                              variant="primary" 
                              className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                              icon={Check}
                              onClick={() => handleAction(rem.id, 'complete')}
                            >
                              Take
                            </Button>
                          </div>
                        )}
                        
                        {(isCompleted || isSkipped) && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <Button 
                              variant="ghost" 
                              className="w-full text-xs text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                setCompletedReminders(prev => { const n = new Set(prev); n.delete(rem.id); return n; });
                                setSkippedReminders(prev => { const n = new Set(prev); n.delete(rem.id); return n; });
                              }}
                            >
                              Undo
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          icon={Clock}
          title="No reminders scheduled"
          description="Upload a prescription to automatically generate your medication schedule."
        />
      )}
    </div>
  );
}
