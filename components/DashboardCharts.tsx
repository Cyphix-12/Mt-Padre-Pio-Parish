import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Heart, UserCheck } from 'lucide-react';
import { supabase } from '@/utils/supabase';

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

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
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
     type ConfirmationRecord = {
  confirmed: string;
};

const confirmationStats = confirmationData?.reduce(
  (acc: { confirmed: number; notConfirmed: number }, curr: ConfirmationRecord) => {
    curr.confirmed === 'Yes' ? acc.confirmed++ : acc.notConfirmed++;
    return acc;
  },
  { confirmed: 0, notConfirmed: 0 }
);


      // Calculate marriage stats
  // ✅ Define MarriageStatus first
type MarriageStatus = 'married' | 'notmarried' | 'divorced' | 'widowed' | 'separated';

// ✅ Then use it in MarriageStats
type MarriageStats = Record<MarriageStatus, number>;

const marriageStats = marriageData?.reduce(
  (acc: MarriageStats, curr: { marriage_status: string }) => {
    const key = curr.marriage_status.toLowerCase() as MarriageStatus;
    if (key in acc) {
      acc[key]++;
    }
    return acc;
  },
  { married: 0, notmarried: 0, divorced: 0, widowed: 0, separated: 0 }
);

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
      setLoading(false);
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

  const sacramentData = [
    { name: 'Baptized & Confirmed', value: sacramentStats.baptized + sacramentStats.confirmed, color: '#10B981' },
    { name: 'Baptized Only', value: sacramentStats.baptized - sacramentStats.confirmed, color: '#3B82F6' },
    { name: 'Neither', value: sacramentStats.notBaptized, color: '#EF4444' }
  ];

  const maritalData = [
    { status: 'Married', count: marriageStats.married, color: '#10B981' },
    { status: 'Single', count: marriageStats.notMarried, color: '#3B82F6' },
    { status: 'Separated', count: marriageStats.separated, color: '#F59E0B' },
    { status: 'Divorced', count: marriageStats.divorced, color: '#EF4444' },
    { status: 'Widowed', count: marriageStats.widowed, color: '#8B5CF6' }
  ];

  const totalMembers = sacramentData.reduce((sum, item) => sum + item.value, 0);
  const totalMarital = maritalData.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm animate-pulse">
          <div className="h-[300px] bg-gray-200 rounded-lg"></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm animate-pulse">
          <div className="h-[300px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Charts Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sacrament Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Sacrament Status</h2>
              <p className="text-gray-600 text-sm">Distribution of baptism and confirmation status</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sacramentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sacramentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary stats below pie chart */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Fully Initiated</p>
                <p className="text-lg font-bold text-green-600">{sacramentData[0].value}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Needs Sacraments</p>
                <p className="text-lg font-bold text-red-600">
                  {sacramentData[1].value + sacramentData[2].value}
                </p>
              </div>
            </div>
          </div>

          {/* Marital Status Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Marital Status</h2>
              <p className="text-gray-600 text-sm">Distribution of marital status among members</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maritalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="status" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    radius={[4, 4, 0, 0]}
                  >
                    {maritalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary stats below bar chart */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Active Marriages</p>
                <p className="text-lg font-bold text-green-600">{marriageStats.married}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Single Members</p>
                <p className="text-lg font-bold text-blue-600">{marriageStats.notMarried}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Need Support</p>
                <p className="text-lg font-bold text-orange-600">
                  {marriageStats.separated + marriageStats.divorced + marriageStats.widowed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Parish Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Sacramental Life</h4>
                <p className="text-sm text-gray-600">
                  {((sacramentData[0].value / totalMembers) * 100).toFixed(1)}% of members are fully initiated
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Family Life</h4>
                <p className="text-sm text-gray-600">
                  {((marriageStats.married / totalMarital) * 100).toFixed(1)}% of members are married
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Community Growth</h4>
                <p className="text-sm text-gray-600">
                  Active parish community of {totalMembers} registered members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}