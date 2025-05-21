import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-white relative">
      <Sidebar />
      
      <div className="flex-1 md:ml-20">
        <Header />
        
        <main className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-accent">Settings</h1>
          </div>
          
          <SettingsContent />
        </main>
      </div>
    </div>
  );
}