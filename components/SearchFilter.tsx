import { useState, useEffect } from 'react';
import { X, Check, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/utils/supabase';

interface SearchFilterProps {
  onFiltersChange: (filters: Record<string, string[]>) => void;
}

export default function SearchFilter({ onFiltersChange }: SearchFilterProps) {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [communities, setCommunities] = useState<string[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const staticFilters = [
    {
      id: 'personal',
      label: 'Personal Status',
      icon: (
        <svg className="w-5 h-5\" fill="none\" stroke="currentColor\" viewBox="0 0 24 24">
          <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      options: [
        { id: 'marriage_status', label: 'Marital Status' },
        { id: 'gender', label: 'Gender' },
        { id: 'residence', label: 'Residence Type' }
      ]
    },
    {
      id: 'religious',
      label: 'Religious Status',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      options: [
        { id: 'baptism', label: 'Baptism Status' },
        { id: 'confirmation', label: 'Confirmation Status' }
      ]
    }
  ];

  const maritalOptions = [ 
    { value: 'Married', label: 'Married', emoji: '💑' },
    { value: 'Not Married', label: 'Not Married', emoji: '👤' },
    { value: 'Divorced', label: 'Divorced', emoji: '💔' },
    { value: 'Separated', label: 'Separated', emoji: '↔️' },
    { value: 'Widowed', label: 'Widowed', emoji: '🕊️' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male', emoji: '👨' },
    { value: 'Female', label: 'Female', emoji: '👩' }
  ];

  const residenceOptions = [
    { value: 'Permanent', label: 'Permanent Residence', emoji: '🏠' },
    { value: 'Temporary', label: 'Temporary Residence', emoji: '🏨' }
  ];

  const baptizedOptions = [
    { value: 'Yes', label: 'Baptized', emoji: '✝️' },
    { value: 'No', label: 'Not Baptized', emoji: '⭕' }
  ];

  const confirmationOptions = [
    { value: 'Yes', label: 'Confirmed', emoji: '✅' },
    { value: 'No', label: 'Not Confirmed', emoji: '❌' }
  ];

  useEffect(() => {
    fetchDynamicOptions();
  }, []);

  const fetchDynamicOptions = async () => {
    try {
      const { data: communityData } = await supabase
        .from('community')
        .select('community')
        .not('community', 'is', null);

      const { data: zoneData } = await supabase
        .from('community')
        .select('zone')
        .not('zone', 'is', null);

      if (communityData) {
        const uniqueCommunities = [...new Set(communityData.map(item => item.community))];
        setCommunities(uniqueCommunities);
      }

      if (zoneData) {
        const uniqueZones = [...new Set(zoneData.map(item => item.zone))];
        setZones(uniqueZones);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFiltersChange = useDebounce((newFilters: Record<string, string[]>) => {
    onFiltersChange(newFilters);
  }, 300);

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }
      
      if (checked) {
        newFilters[category] = [...newFilters[category], value];
      } else {
        newFilters[category] = newFilters[category].filter(v => v !== value);
      }
      
      if (newFilters[category].length === 0) {
        delete newFilters[category];
      }
      
      debouncedFiltersChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const getOptionsForCategory = (category: string) => {
    switch (category) {
      case 'marriage_status':
        return maritalOptions;
      case 'gender':
        return genderOptions;
      case 'residence':
        return residenceOptions;
      case 'baptism':
        return baptizedOptions;
      case 'confirmation':
        return confirmationOptions;
      case 'community':
        return communities.map(c => ({ value: c, label: c, emoji: '🏘️' }));
      case 'zone':
        return zones.map(z => ({ value: z, label: z, emoji: '📍' }));
      default:
        return [];
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative overflow-hidden flex items-center gap-3 px-6 py-3 text-gray-700 
          bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200
          hover:from-indigo-500/5 hover:to-indigo-500/10 hover:border-indigo-500/30 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          transition-all duration-300 ease-out font-medium
          ${isOpen ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-lg from-indigo-500/5 to-indigo-500/10 border-indigo-500/30' : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Filter className={`w-5 h-5 transition-all duration-300 ${isOpen ? 'text-indigo-500 rotate-12' : 'text-gray-500 group-hover:text-indigo-500'}`} />
        <span className="relative z-10">Filters</span>
        {getActiveFiltersCount() > 0 && (
          <div className="relative">
            <span className="flex items-center justify-center min-w-[24px] h-6 px-2 text-xs bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-full font-semibold shadow-sm">
              {getActiveFiltersCount()}
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-4 w-96 sm:w-[480px] lg:w-[640px] transform -translate-x-1/2 left-1/2">
          <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-white via-white to-gray-50/50 p-6 lg:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 rounded-xl">
                    <Filter className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-400 bg-clip-text text-transparent">
                    Filter Options
                  </h3>
                </div>
                <button
                  onClick={clearFilters}
                  className="group flex items-center gap-2 px-4 py-2 text-sm text-indigo-500 hover:text-indigo-400 
                           bg-indigo-500/5 hover:bg-indigo-500/10 rounded-xl transition-all duration-200 font-medium"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                {/* Static Filters */}
                {staticFilters.map((group) => (
                  <div 
                    key={group.id} 
                    className="group/section"
                    onMouseEnter={() => setHoveredSection(group.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <div className={`
                      p-6 rounded-2xl border transition-all duration-300
                      ${hoveredSection === group.id 
                        ? 'bg-gradient-to-r from-indigo-500/5 to-indigo-500/10 border-indigo-500/20 shadow-lg' 
                        : 'bg-white/50 border-gray-100 hover:border-gray-200'
                      }
                    `}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`
                          p-2 rounded-xl transition-all duration-300
                          ${hoveredSection === group.id 
                            ? 'bg-indigo-500/10 text-indigo-500' 
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {group.icon}
                        </div>
                        <h4 className={`
                          text-lg font-semibold transition-colors duration-300
                          ${hoveredSection === group.id ? 'text-indigo-500' : 'text-gray-800'}
                        `}>
                          {group.label}
                        </h4>
                      </div>
                      
                      <div className="space-y-4">
                        {group.options.map((option) => (
                          <div key={option.id} className="group/option">
                            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-indigo-500/40 rounded-full"></div>
                              {option.label}
                            </h5>
                            <div className="grid grid-cols-1 gap-3">
                              {getOptionsForCategory(option.id).map((opt) => (
                                <label
                                  key={opt.value}
                                  className="group/checkbox flex items-center gap-3 p-3 rounded-xl 
                                           text-sm text-gray-900 hover:text-indigo-500 cursor-pointer
                                           bg-white/80 hover:bg-indigo-500/5 border border-gray-100 
                                           hover:border-indigo-500/20 transition-all duration-200
                                           hover:shadow-sm"
                                >
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={filters[option.id]?.includes(opt.value) || false}
                                      onChange={(e) => handleFilterChange(option.id, opt.value, e.target.checked)}
                                    />
                                    <div className={`
                                      w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                      ${filters[option.id]?.includes(opt.value)
                                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 border-indigo-500 shadow-sm' 
                                        : 'border-gray-300 group-hover/checkbox:border-indigo-500/50'
                                      }
                                    `}>
                                      {filters[option.id]?.includes(opt.value) && (
                                        <Check className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                  </div>
                                  <span className="flex items-center gap-2">
                                    {opt.emoji && <span className="text-base">{opt.emoji}</span>}
                                    <span className="font-medium">{opt.label}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Location Filters */}
                <div 
                  className="group/section"
                  onMouseEnter={() => setHoveredSection('location')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className={`
                    p-6 rounded-2xl border transition-all duration-300
                    ${hoveredSection === 'location' 
                      ? 'bg-gradient-to-r from-indigo-500/5 to-indigo-500/10 border-indigo-500/20 shadow-lg' 
                      : 'bg-white/50 border-gray-100 hover:border-gray-200'
                    }
                  `}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`
                        p-2 rounded-xl transition-all duration-300
                        ${hoveredSection === 'location' 
                          ? 'bg-indigo-500/10 text-indigo-500' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 className={`
                        text-lg font-semibold transition-colors duration-300
                        ${hoveredSection === 'location' ? 'text-indigo-500' : 'text-gray-800'}
                      `}>
                        Location
                      </h4>
                    </div>
                    
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3 text-indigo-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                          <span className="font-medium">Loading locations...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {['community', 'zone'].map((locationType) => (
                          <div key={locationType}>
                            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-indigo-500/40 rounded-full"></div>
                              {locationType === 'community' ? 'Community' : 'Zone'}
                            </h5>
                            <div className="grid grid-cols-1 gap-3 max-h-32 overflow-y-auto">
                              {(locationType === 'community' ? communities : zones).map((location) => (
                                <label
                                  key={location}
                                  className="group/checkbox flex items-center gap-3 p-3 rounded-xl 
                                           text-sm text-gray-900 hover:text-indigo-500 cursor-pointer
                                           bg-white/80 hover:bg-indigo-500/5 border border-gray-100 
                                           hover:border-indigo-500/20 transition-all duration-200
                                           hover:shadow-sm"
                                >
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={filters[locationType]?.includes(location) || false}
                                      onChange={(e) => handleFilterChange(locationType, location, e.target.checked)}
                                    />
                                    <div className={`
                                      w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                      ${filters[locationType]?.includes(location)
                                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 border-indigo-500 shadow-sm' 
                                        : 'border-gray-300 group-hover/checkbox:border-indigo-500/50'
                                      }
                                    `}>
                                      {filters[locationType]?.includes(location) && (
                                        <Check className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                  </div>
                                  <span className="flex items-center gap-2">
                                    <span className="text-base">{locationType === 'community' ? '🏘️' : '📍'}</span>
                                    <span className="font-medium">{location}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Apply Button */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      debouncedFiltersChange(filters);
                      setIsOpen(false);
                    }}
                    className="group relative overflow-hidden w-full flex items-center justify-center gap-3 px-8 py-4 
                             bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-2xl 
                             hover:from-indigo-400 hover:to-indigo-500 shadow-lg hover:shadow-xl 
                             transition-all duration-300 font-semibold text-lg
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" 
                         className="w-6 h-6 group-hover:scale-110 transition-transform duration-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <span className="relative z-10">Apply Filters</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="relative z-10 px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}