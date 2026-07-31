import React, { useState, useCallback } from 'react';
import { X, UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { 
  uploadPrescription, 
  processOCR, 
  extractMedicines, 
  generateReminders, 
  generateSummary 
} from '../../services/api';

export default function PrescriptionUploadModal({ isOpen, onClose, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, ocr, extracting, reminders, summary, success, error
  const [errorMsg, setErrorMsg] = useState(null);

  const resetState = () => {
    setFile(null);
    setStatus('idle');
    setErrorMsg(null);
  };

  const handleClose = () => {
    if (status !== 'idle' && status !== 'success' && status !== 'error') {
      if (!window.confirm("Processing is still running. Are you sure you want to close? The process may continue in the background.")) {
        return;
      }
    }
    resetState();
    onClose();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const startPipeline = async () => {
    if (!file) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    try {
      setErrorMsg(null);
      
      // Step 1: Upload
      setStatus('uploading');
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await uploadPrescription(formData);
      const prescriptionId = uploadRes.prescription_id;

      // Step 2: OCR
      setStatus('ocr');
      await processOCR(prescriptionId);

      // Step 3: Extract Medicines
      setStatus('extracting');
      await extractMedicines(prescriptionId);

      // Step 4: Reminders
      setStatus('reminders');
      await generateReminders(prescriptionId);

      // Step 5: Summary
      setStatus('summary');
      await generateSummary(prescriptionId);

      setStatus('success');
      
      // Notify parent to refresh
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      // Close automatically after 2 seconds on success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || "An error occurred during processing. Some data may be partially saved.");
      // Still refresh the parent list so they can see the partially processed prescription
      if (onUploadComplete) {
        onUploadComplete();
      }
    }
  };

  if (!isOpen) return null;

  const renderStatus = () => {
    const states = [
      { id: 'uploading', label: 'Uploading File' },
      { id: 'ocr', label: 'Reading Text (AI)' },
      { id: 'extracting', label: 'Extracting Medicines (AI)' },
      { id: 'reminders', label: 'Generating Schedule (AI)' },
      { id: 'summary', label: 'Writing Doctor Summary (AI)' }
    ];

    if (status === 'idle') return null;
    if (status === 'success') {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-3">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="text-lg font-medium text-green-700">Processing Complete!</p>
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-3">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-lg font-medium text-red-700 text-center">{errorMsg}</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        {states.map((s, index) => {
          const currentIndex = states.findIndex(st => st.id === status);
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={s.id} className={`flex items-center gap-3 ${isPending ? 'opacity-40' : ''}`}>
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : isCurrent ? (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
              <span className={`text-sm font-medium ${isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Upload Prescription</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {status === 'idle' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (PDF, JPG, PNG)</label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors
                    ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 bg-gray-50'}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud className={`mx-auto h-12 w-12 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="prescription-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>{file ? file.name : "Drag and drop or click to browse"}</span>
                        <input 
                          id="prescription-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFile(e.target.files[0]);
                            }
                          }} 
                          accept=".pdf,.jpg,.jpeg,.png" 
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">Up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="button" variant="primary" className="flex-1" onClick={startPipeline} disabled={!file}>
                  Process with AI
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {renderStatus()}
              {status === 'error' && (
                <div className="mt-4 flex justify-center">
                  <Button variant="secondary" onClick={handleClose}>Close</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
