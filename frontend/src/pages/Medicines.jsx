import React, { useState, useEffect } from 'react';
import { getPrescriptions, getPrescriptionDetails } from '../services/api';
import EmptyState from '../components/common/EmptyState';
import { Pill, Search, Loader2 } from 'lucide-react';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllMedicines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Get all prescriptions
        const prescriptionsData = await getPrescriptions();
        
        // 2. Filter completed prescriptions that have medicines
        const completedPrescriptions = prescriptionsData.filter(
          p => p.processing_status === 'completed' && p.medicine_count > 0
        );

        // 3. Fetch details for each to get the medicines array
        // We use Promise.all to fetch them concurrently
        const detailsPromises = completedPrescriptions.map(p => 
          getPrescriptionDetails(p.prescription_id)
        );
        
        const detailsResults = await Promise.all(detailsPromises);

        // 4. Flatten the medicines into a single array, attaching the source filename
        let allMedicines = [];
        detailsResults.forEach(detail => {
          if (detail.medicines && Array.isArray(detail.medicines)) {
            const medsWithSource = detail.medicines.map(m => ({
              ...m,
              source_filename: detail.prescription.original_filename,
              source_id: detail.prescription.id,
              date: detail.prescription.uploaded_at
            }));
            allMedicines = [...allMedicines, ...medsWithSource];
          }
        });

        // Sort by most recent prescription date
        allMedicines.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setMedicines(allMedicines);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError("Failed to load your medicines. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMedicines();
  }, []);

  const filteredMedicines = medicines.filter(m => 
    m.medicine_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.source_filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Medicines</h2>
          <p className="text-gray-500 text-sm mt-1">A consolidated list of all active medications from your prescriptions.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search className="h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by medicine name or prescription..."
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
        <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-gray-500">Aggregating medicines from your prescriptions...</p>
        </div>
      ) : filteredMedicines.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                  <th className="py-4 px-6">Medicine Name</th>
                  <th className="py-4 px-6">Dosage</th>
                  <th className="py-4 px-6">Frequency</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6 text-right">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredMedicines.map((med, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900 flex items-center gap-3">
                      <div className="bg-purple-50 text-purple-600 p-2 rounded-lg hidden sm:block">
                        <Pill className="h-4 w-4" />
                      </div>
                      {med.medicine_name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{med.dosage || '-'}</td>
                    <td className="py-4 px-6 text-gray-600">{med.frequency || '-'}</td>
                    <td className="py-4 px-6 text-gray-600">{med.duration || '-'}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 truncate max-w-[150px]" title={med.source_filename}>
                        {med.source_filename}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState 
          icon={Pill}
          title={searchQuery ? "No matching medicines" : "No medicines found"}
          description={searchQuery ? "Try adjusting your search terms." : "You have no medicines extracted from prescriptions yet."}
        />
      )}
    </div>
  );
}
