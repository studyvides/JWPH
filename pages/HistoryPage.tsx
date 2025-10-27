import React from 'react';
import { MonthlyTotals } from '../types';
import ServiceYearHistory from '../components/ServiceYearHistory';

interface HistoryPageProps {
  monthlyTotals: MonthlyTotals;
  serviceYearMonths: string[];
  currentServiceYear: number;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ monthlyTotals, serviceYearMonths, currentServiceYear }) => {
  return (
    <div className="space-y-6">
      <ServiceYearHistory 
        monthlyTotals={monthlyTotals}
        serviceYearMonths={serviceYearMonths}
        currentServiceYear={currentServiceYear}
      />
    </div>
  );
};

export default HistoryPage;