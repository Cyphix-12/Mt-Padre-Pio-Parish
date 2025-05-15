import { FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import LeaderTable from '@/components/LeaderTable';

export default function LeadersPage() {
  return (
    <div className="flex min-h-screen bg-white relative">
      <Sidebar />
      
      <div className="flex-1 md:ml-20">
        <Header />
        
        <main className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-accent">Leaders</h1>
            
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-full border hover:bg-gray-50">
                <FunnelIcon className="w-5 h-5" />
                Search Filter
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-full border hover:bg-gray-50">
                <PlusIcon className="w-5 h-5" />
                Add Column
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 text-white bg-secondary rounded-full hover:bg-blue-600">
                <PlusIcon className="w-5 h-5" />
                Add Leader
              </button>
            </div>
          </div>
          
          <LeaderTable />
        </main>
      </div>
    </div>
  );
}