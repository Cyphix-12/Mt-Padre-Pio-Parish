import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SettingsContent from '@/components/SettingsContent';
import LanguageSwitch from '@/components/LanguageSwitch';

export default function SettingsPage() {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen bg-white relative">
      <Sidebar />
      
      <div className="flex-1 md:ml-20">
        <Header />
        
        <main className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-accent">{t('Settings')}</h1>
          </div>
          
          <SettingsContent />
        </main>
      </div>
    </div>
  );
}
