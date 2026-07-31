import React, { useState, useEffect } from 'react';
import { X, Calendar, Stethoscope, Pill, Clock, FileText, Loader2, ExternalLink, Bot } from 'lucide-react';
import { getPrescriptionDetails, getPrescriptionFileUrl } from '../../services/api';
import Button from '../common/Button';

export default function PrescriptionDetailsModal({ isOpen, onClose, prescriptionId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && prescriptionId) {
      fetchDetails();
    } else {
      setDetails(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prescriptionId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPrescriptionDetails(prescriptionId);
      setDetails(data);
    } catch (err) {
      setError("Failed to load prescription details.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = async () => {
    try {
      const response = await getPrescriptionFileUrl(prescriptionId);
      if (response.download_url) {
        window.open(response.download_url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      alert("Failed to securely open the document.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
            {details && (
              <p className="text-sm text-gray-500 mt-1">
                {details.prescription.original_filename} • {new Date(details.prescription.uploaded_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-gray-500">Loading AI insights...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          ) : details ? (
            <div className="space-y-6">
              
              {/* Doctor Summary Section (Highlighted) */}
              {details.doctor_summary && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-900">AI Doctor Summary</h3>
                  </div>
                  <div className="prose prose-sm prose-blue max-w-none text-blue-800 bg-white/50 p-4 rounded-xl">
                    {/* Assuming summary_text is markdown, but we'll render it as plain text with whitespace preserved for safety if no markdown parser is installed */}
                    <div className="whitespace-pre-wrap font-medium leading-relaxed">
                      {details.doctor_summary.summary_text}
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted Medicines Table */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex-1">Extracted Medicines</h3>
                  <span className="bg-purple-50 text-purple-700 py-1 px-3 rounded-full text-xs font-bold">
                    {details.medicines.length} Found
                  </span>
                </div>
                
                {details.medicines.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                          <th className="pb-3 pl-2">Medicine Name</th>
                          <th className="pb-3">Dosage</th>
                          <th className="pb-3">Frequency</th>
                          <th className="pb-3">Duration</th>
                          <th className="pb-3">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {details.medicines.map((med, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="py-3 pl-2 font-medium text-gray-900">{med.medicine_name}</td>
                            <td className="py-3 text-gray-600">{med.dosage || '-'}</td>
                            <td className="py-3 text-gray-600">{med.frequency || '-'}</td>
                            <td className="py-3 text-gray-600">{med.duration || '-'}</td>
                            <td className="py-3 text-gray-500 text-xs">{med.instructions || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-xl">No medicines were detected in this prescription.</p>
                )}
              </div>

              {/* Reminders Schedule */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex-1">Generated Reminders</h3>
                  <span className="bg-orange-50 text-orange-700 py-1 px-3 rounded-full text-xs font-bold">
                    {details.reminders.length} Scheduled
                  </span>
                </div>

                {details.reminders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.reminders.map((rem, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-orange-50/30">
                        <div className="bg-white border border-orange-100 text-orange-600 p-2 rounded-lg shadow-sm font-bold text-lg min-w-[70px] text-center">
                          {rem.reminder_time.substring(0, 5)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{rem.medicine_name}</p>
                          <p className="text-sm text-gray-600">{rem.dose_description}</p>
                          <p className="text-xs text-gray-400 mt-1 capitalize">{rem.frequency} • {rem.reminder_type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-xl">No reminders were generated.</p>
                )}
              </div>

            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 flex-shrink-0 rounded-b-2xl">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" icon={ExternalLink} onClick={handleViewFile} disabled={!details}>
            View Original File
          </Button>
        </div>
      </div>
    </div>
  );
}
