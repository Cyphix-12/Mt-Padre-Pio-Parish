'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Users, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface Zone {
  community_id: string;
  community: string;
  zone: string;
}

export default function ZoneTable() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [filteredZones, setFilteredZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('community')
        .select('community_id, community, zone')
        .not('zone', 'is', null)
        .not('community', 'is', null)
        .order('zone', { ascending: true });

      if (error) throw error;
      const zoneData = data || [];
      setZones(zoneData);
      setFilteredZones(zoneData);
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    let filtered = zones;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(zone =>
        zone.community.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.zone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected zone
    if (selectedZone !== 'all') {
      filtered = filtered.filter(zone => zone.zone === selectedZone);
    }

    setFilteredZones(filtered);
  }, [searchTerm, selectedZone, zones]);

  const uniqueZones = [...new Set(zones.map(zone => zone.zone))];
  const zoneStats = uniqueZones.map(zoneName => ({
    name: zoneName,
    count: zones.filter(z => z.zone === zoneName).length
  }));

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border border-gray-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">Loading Zones</h3>
            <p className="text-sm text-gray-500">Fetching community data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <MapPin className="h-8 w-8" />
              Community Zones
            </h1>
            <p className="text-blue-100 mt-2">Manage and explore community zones</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <Users className="h-5 w-5" />
            <span className="font-semibold">{zones.length} Communities</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zoneStats.map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => setSelectedZone(selectedZone === stat.name ? 'all' : stat.name)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{stat.name}</h3>
                <p className="text-sm text-gray-500">{stat.count} communities</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                index % 3 === 0 ? 'bg-blue-100 text-blue-600' :
                index % 3 === 1 ? 'bg-purple-100 text-purple-600' :
                'bg-green-100 text-green-600'
              }`}>
                <MapPin className="h-6 w-6" />
              </div>
            </div>
            {selectedZone === stat.name && (
              <div className="mt-2 text-xs text-blue-600 font-medium">Selected</div>
            )}
          </div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search communities or zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white min-w-[150px]"
            >
              <option value="all">All Zones</option>
              {uniqueZones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Jumuiya
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Kanda
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredZones.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="space-y-2">
                      <Search className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="font-medium">No communities found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredZones.map((zone, index) => (
                  <tr 
                    key={zone.community_id} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-xs font-semibold group-hover:text-blue-600 transition-all duration-200">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                        {zone.community}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-200">
                        <MapPin className="h-3 w-3" />
                        {zone.zone}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        Showing {filteredZones.length} of {zones.length} communities
        {selectedZone !== 'all' && ` in ${selectedZone}`}
      </div>
    </div>
  );
}