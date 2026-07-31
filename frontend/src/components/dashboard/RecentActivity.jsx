import React from 'react';
import { FileText, Files } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function RecentActivity({ prescriptions = [], documents = [] }) {
  const hasActivity = prescriptions.length > 0 || documents.length > 0;

  // Combine and sort by date
  const combinedActivity = [
    ...prescriptions.map(p => ({
      id: p.prescription_id,
      title: p.original_filename || 'Unknown Prescription',
      date: new Date(p.upload_date),
      type: 'prescription',
      status: p.processing_status
    })),
    ...documents.map(d => ({
      id: d.document_id,
      title: d.original_filename || 'Unknown Document',
      date: new Date(d.uploaded_at),
      type: 'document',
      status: 'stored'
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 5); // Take top 5

  if (!hasActivity) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex-1 flex items-center justify-center">
           <EmptyState 
             icon={FileText}
             title="No recent activity"
             description="Upload a prescription or medical document to get started."
           />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4 flex-1">
        {combinedActivity.map((item) => (
          <div key={`${item.type}-${item.id}`} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
            <div className={`p-2 rounded-lg ${item.type === 'prescription' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
              {item.type === 'prescription' ? <FileText className="h-5 w-5" /> : <Files className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${item.status === 'completed' || item.status === 'stored' ? 'bg-green-100 text-green-800' : 
                  item.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
