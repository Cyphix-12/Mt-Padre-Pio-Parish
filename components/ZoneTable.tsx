'use client';

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface Zone {
  community_id: string;
  community: string;
  zone: string;
}

export default function ZoneTable() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZones();
  }, []);

  async function fetchZones() {
    try {
      const { data, error } = await supabase
        .from('community')
        .select('community_id, community, zone')
        .not('zone', 'is', null)
        .not('community', 'is', null)
        .order('zone', { ascending: true });

      if (error) throw error;
      setZones(data || []);
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden max-w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">No.</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">Jumuiya</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500">Kanda</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {zones.map((zone, index) => (
              <tr key={zone.community_id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{zone.community}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{zone.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}