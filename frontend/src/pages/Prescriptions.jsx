import React, { useState, useEffect } from 'react';
import { getPrescriptions } from '../services/api';
import PrescriptionCard from '../components/prescriptions/PrescriptionCard';
import PrescriptionUploadModal from '../components/prescriptions/PrescriptionUploadModal';
import PrescriptionDetailsModal from '../components/prescriptions/PrescriptionDetailsModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import SkeletonCard from '../components/common/SkeletonCard';
import { FileUp, Search, FileText } from 'lucide-react';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleUploadComplete = () => {
    fetchPrescriptions();
  };

  const handleViewDetails = (id) => {
    setSelectedPrescriptionId(id);
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    p.original_filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Prescriptions</h2>
          <p className="text-gray-500 text-sm mt-1">Upload and manage AI-processed prescriptions.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} icon={FileUp}>
          Upload Prescription
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search className="h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search prescriptions by filename..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
        </div>
      ) : filteredPrescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrescriptions.map(p => (
            <PrescriptionCard 
              key={p.prescription_id} 
              prescription={p} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FileText}
          title={searchQuery ? "No matching prescriptions" : "No prescriptions yet"}
          description={searchQuery ? "Try adjusting your search terms." : "Upload a prescription to extract medicines and automatically generate reminders!"}
        />
      )}

      {/* Upload Modal */}
      <PrescriptionUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Details Modal */}
      <PrescriptionDetailsModal
        isOpen={!!selectedPrescriptionId}
        prescriptionId={selectedPrescriptionId}
        onClose={() => setSelectedPrescriptionId(null)}
      />
    </div>
  );
}
