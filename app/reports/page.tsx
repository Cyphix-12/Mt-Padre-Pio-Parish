'use client';

import { useState, useCallback, useMemo } from 'react';
import { FunnelIcon, PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ReportTable from '@/components/ReportTable';
import MemberForm from '@/components/MemberForm';
import SearchFilter from '@/components/SearchFilter';

export default function ReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleFiltersChange = useCallback((filters: Record<string, string[]>) => {
    setActiveFilters(filters);
  }, []);

  return (
    <div className="flex min-h-screen bg-white relative">
      <Sidebar />
      
      <div className="flex-1 md:ml-20">
        <Header />
        
        <main className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-accent">Report</h1>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-full md:w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900"
                />
              </div>

              <SearchFilter onFiltersChange={handleFiltersChange} />
              
              <button 
                className="flex items-center gap-2 px-6 py-2 text-white bg-accent rounded-full hover:bg-accent/90 shrink-0"
              >
                <DocumentTextIcon className="w-5 h-5" />
                Create Report
              </button>
              
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-2 text-white bg-secondary rounded-full hover:bg-blue-600 shrink-0"
              >
                <PlusIcon className="w-5 h-5" />
                Add Member
              </button>
            </div>
          </div>
          
          <ReportTable filters={activeFilters} searchQuery={searchQuery} />
          {showForm && <MemberForm onClose={() => setShowForm(false)} />}
        </main>
      </div>
    </div>
  );
}