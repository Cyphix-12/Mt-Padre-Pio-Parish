'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Users, Home, Church } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import StatCard from '@/components/StatCard';

interface Stats {
  zones: number;
  communities: number;
  members: number;
}

export default function DashboardStats() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    zones: 0,
    communities: 0,
    members: 0
  });

  useEffect(() => {
    console.log('Fetching dashboard stats...');
    // Initial fetch of counts
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Get distinct zones count
      const { data: zones } = await supabase
        .from('community')
        .select('zone')
        .not('zone', 'is', null);
      console.log('Zones data:', zones);
      
      const uniqueZones = new Set(zones?.map(z => z.zone));
      
      // Get unique communities count
      const { data: communities } = await supabase
        .from('community')
        .select('community')
        .not('community', 'is', null);
      console.log('Communities data:', communities);
      
      const uniqueCommunities = new Set(communities?.map(c => c.community));
      
      // Get members count
      const { count: membersCount } = await supabase
        .from('waumini')
        .select('*', { count: 'exact', head: true });
      console.log('Members count:', membersCount);
      
      setStats({
        zones: uniqueZones.size || 0,
        communities: uniqueCommunities.size || 0,
        members: membersCount ?? 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 w-full">
      <StatCard
        title={t('Zones')}
        value={stats.zones}
        icon="activity"
        color="purple"
        trend={{ value: stats.zones, isPositive: true }}
      />
      <StatCard
        title={t('Communities')}
        value={stats.communities}
        icon="users"
        color="blue"
        trend={{ value: stats.communities, isPositive: true }}
      />
      <StatCard
        title={t('Members')}
        value={stats.members}
        icon="trending"
        color="green"
        trend={{ value: stats.members, isPositive: true }}
      />
    </div>
  );
}