import React, { useState, useEffect } from 'react';
import { FileText, Files, Pill, Clock } from 'lucide-react';
import { getPrescriptions, getDocuments } from '../services/api';
import SummaryCard from '../components/common/SummaryCard';
import SkeletonCard from '../components/common/SkeletonCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingReminders from '../components/dashboard/UpcomingReminders';

export default function Dashboard() {
  const [data, setData] = useState({
    prescriptions: [],
    documents: [],
    totals: {
      prescriptions: 0,
      documents: 0,
      medicines: 0,
      reminders: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prescriptionsData, documentsData] = await Promise.all([
          getPrescriptions(),
          getDocuments()
        ]);

        let totalMedicines = 0;
        let totalReminders = 0;

        prescriptionsData.forEach(p => {
          totalMedicines += (p.medicine_count || 0);
          totalReminders += (p.reminder_count || 0);
        });

        setData({
          prescriptions: prescriptionsData,
          documents: documentsData,
          totals: {
            prescriptions: prescriptionsData.length,
            documents: documentsData.length,
            medicines: totalMedicines,
            reminders: totalReminders
          }
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <SummaryCard 
              title="Total Prescriptions" 
              value={data.totals.prescriptions} 
              icon={FileText} 
              colorClass="text-blue-600" 
              bgClass="bg-blue-50" 
            />
            <SummaryCard 
              title="Medical Documents" 
              value={data.totals.documents} 
              icon={Files} 
              colorClass="text-purple-600" 
              bgClass="bg-purple-50" 
            />
            <SummaryCard 
              title="Active Medicines" 
              value={data.totals.medicines} 
              icon={Pill} 
              colorClass="text-green-600" 
              bgClass="bg-green-50" 
            />
            <SummaryCard 
              title="Active Reminders" 
              value={data.totals.reminders} 
              icon={Clock} 
              colorClass="text-orange-600" 
              bgClass="bg-orange-50" 
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 animate-pulse"></div>
          ) : (
            <RecentActivity 
              prescriptions={data.prescriptions} 
              documents={data.documents} 
            />
          )}
        </div>
        
        <div>
          <QuickActions />
          <UpcomingReminders prescriptions={data.prescriptions} />
        </div>
      </div>
    </div>
  );
}
