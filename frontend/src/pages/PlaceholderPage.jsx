import React from 'react';
import EmptyState from '../components/common/EmptyState';
import { Clock } from 'lucide-react';

export default function PlaceholderPage({ title }) {
  return (
    <div className="pt-10">
      <EmptyState 
        icon={Clock}
        title={`${title} Coming Soon`}
        description="We are currently building this feature. Check back later!"
      />
    </div>
  );
}
