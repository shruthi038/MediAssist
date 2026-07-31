import React from 'react';
import { FileText, Loader2, CheckCircle, AlertCircle, FileSearch } from 'lucide-react';
import Button from '../common/Button';

export default function PrescriptionCard({ prescription, onViewDetails }) {
  const date = new Date(prescription.upload_date);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case 'failed':
      case 'ocr_failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <AlertCircle className="h-3.5 w-3.5" />
            Failed
          </span>
        );
      default:
        // Any other state is processing
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
          <FileText className="h-6 w-6" />
        </div>
        {getStatusBadge(prescription.processing_status)}
      </div>
      
      <div className="flex-1 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" title={prescription.original_filename || "Untitled Prescription"}>
          {prescription.original_filename || "Untitled Prescription"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Uploaded on {date.toLocaleDateString()}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Button 
          variant="secondary" 
          className="w-full text-sm" 
          icon={FileSearch}
          onClick={() => onViewDetails(prescription.prescription_id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
