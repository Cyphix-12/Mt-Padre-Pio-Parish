import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { supabase } from '@/utils/supabase';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardCharts() {
  const [sacramentStats, setSacramentStats] = useState({
    baptized: 0,
    notBaptized: 0,
    confirmed: 0,
    notConfirmed: 0
  });

  const [marriageStats, setMarriageStats] = useState({
    married: 0,
    notMarried: 0,
    divorced: 0,
    widowed: 0,
    separated: 0
  });

  const fetchStats = async () => {
    try {
      // Fetch baptism stats
      const { data: baptismData } = await supabase
        .from('baptized')
        .select('baptized')
        .not('baptized', 'is', null);

      // Fetch confirmation stats
      const { data: confirmationData } = await supabase
        .from('confirmation')
        .select('confirmed')
        .not('confirmed', 'is', null);

      // Fetch marriage stats
      const { data: marriageData } = await supabase
        .from('married')
        .select('marriage_status')
        .not('marriage_status', 'is', null);

      // Calculate baptism stats
      type BaptismRecord = {
  baptized: string; // or boolean, depending on your data
};

const baptismStats = baptismData?.reduce(
  (acc: { baptized: number; notBaptized: number }, curr: BaptismRecord) => {
    curr.baptized === 'Yes' ? acc.baptized++ : acc.notBaptized++;
    return acc;
  },
  { baptized: 0, notBaptized: 0 }
);


      // Calculate confirmation stats
      const confirmationStats = confirmationData?.reduce((acc, curr) => {
        curr.confirmed === 'Yes' ? acc.confirmed++ : acc.notConfirmed++;
        return acc;
      }, { confirmed: 0, notConfirmed: 0 });

      // Calculate marriage stats
      const marriageStats = marriageData?.reduce((acc, curr) => {
        acc[curr.marriage_status.toLowerCase()]++;
        return acc;
      }, { married: 0, notmarried: 0, divorced: 0, widowed: 0, separated: 0 });

      setSacramentStats({
        baptized: baptismStats?.baptized || 0,
        notBaptized: baptismStats?.notBaptized || 0,
        confirmed: confirmationStats?.confirmed || 0,
        notConfirmed: confirmationStats?.notConfirmed || 0
      });

      setMarriageStats({
        married: marriageStats?.married || 0,
        notMarried: marriageStats?.notmarried || 0,
        divorced: marriageStats?.divorced || 0,
        widowed: marriageStats?.widowed || 0,
        separated: marriageStats?.separated || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to changes
    const subscription = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'baptized'
      }, () => fetchStats())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'confirmation'
      }, () => fetchStats())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'married'
      }, () => fetchStats())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sacramentData = {
    labels: ['Baptized', 'Not Baptized', 'Confirmed', 'Not Confirmed'],
    datasets: [
      {
        data: [
          sacramentStats.baptized,
          sacramentStats.notBaptized,
          sacramentStats.confirmed,
          sacramentStats.notConfirmed
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ]
      }
    ]
  };

  const marriageData = {
    labels: ['Married', 'Not Married', 'Divorced', 'Widowed', 'Separated'],
    datasets: [
      {
        label: 'Marriage Status',
        data: [
          marriageStats.married,
          marriageStats.notMarried,
          marriageStats.divorced,
          marriageStats.widowed,
          marriageStats.separated
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ]
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-accent">Sacrament Statistics</h3>
        <div className="h-[300px] flex items-center justify-center">
          <Pie data={sacramentData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-accent">Marriage Statistics</h3>
        <div className="h-[300px] flex items-center justify-center">
          <Bar 
            data={marriageData} 
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}
