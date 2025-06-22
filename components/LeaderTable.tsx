import { useLanguage } from '@/contexts/LanguageContext';

interface Leader {
  id: string;
  jina: string;
  jinsia: string;
  jumuiya: string;
  kanda: string;
  nafasi: string;
}

export default function LeaderTable() {
  const { t } = useLanguage();
  
  const leaders: Leader[] = [
    {
      id: '1',
      jina: 'John Doe',
      jinsia: 'Male',
      jumuiya: 'St. Joseph',
      kanda: 'Central',
      nafasi: 'Chairman'
    },
    {
      id: '2',
      jina: 'Jane Smith',
      jinsia: 'Female',
      jumuiya: 'St. Mary',
      kanda: 'Eastern',
      nafasi: 'Secretary'
    },
    {
      id: '3',
      jina: 'Michael Johnson',
      jinsia: 'Male',
      jumuiya: 'St. Peter',
      kanda: 'Western',
      nafasi: 'Treasurer'
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden max-w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">{t('No.')}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">{t('Jina')}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">{t('Jinsia')}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">{t('Jumuiya')}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">{t('Kanda')}</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">{t('Nafasi')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaders.map((leader, index) => (
              <tr key={leader.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{leader.jina}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{leader.jinsia}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{leader.jumuiya}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{leader.kanda}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{leader.nafasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}