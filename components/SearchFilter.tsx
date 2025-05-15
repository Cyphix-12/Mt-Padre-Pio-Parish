import { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/utils/supabase';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface SearchFilterProps {
  onFiltersChange: (filters: Record<string, string[]>) => void;
}

export default function SearchFilter({ onFiltersChange }: SearchFilterProps) {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [communities, setCommunities] = useState<string[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const staticFilters: FilterGroup[] = [
    {
      id: 'personal',
      label: 'Personal Status',
      options: [
        { id: 'marriage_status', label: 'Marital Status' },
        { id: 'gender', label: 'Gender' },
        { id: 'residence', label: 'Residence Type' }
      ]
    },
    {
      id: 'religious',
      label: 'Religious Status',
      options: [
        { id: 'baptism', label: 'Baptism Status' },
        { id: 'confirmation', label: 'Confirmation Status' }
      ]
    }
  ];

  const maritalOptions = [
    { value: 'Married', label: 'Married' },
    { value: 'Not Married', label: 'Not Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Separated', label: 'Separated' },
    { value: 'Widowed', label: 'Widowed' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const residenceOptions = [
    { value: 'Permanent', label: 'Permanent Residence' },
    { value: 'Temporary', label: 'Temporary Residence' }
  ];

  const baptizedOptions = [
    { value: 'Yes', label: 'Baptized' },
    { value: 'No', label: 'Not Baptized' }
  ];

  const confirmationOptions = [
    { value: 'Yes', label: 'Confirmed' },
    { value: 'No', label: 'Not Confirmed' }
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
        return communities.map(c => ({ value: c, label: c }));
      case 'zone':
        return zones.map(z => ({ value: z, label: z }));
      default:
        return [];
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-full border
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent
              ${open ? 'ring-2 ring-offset-2 ring-accent' : ''}
            `}
          >
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-accent text-white rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-md transform px-4 sm:px-0 lg:max-w-2xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-white p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-accent">Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-accent hover:text-accent/80 font-medium"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {staticFilters.map((group) => (
                      <div key={group.id} className="py-4">
                        <h4 className="text-sm font-semibold text-accent mb-3">
                          {group.label}
                        </h4>
                        <div className="space-y-4">
                          {group.options.map((option) => (
                            <div key={option.id}>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">{option.label}</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {getOptionsForCategory(option.id).map((opt) => (
                                  <label
                                    key={opt.value}
                                    className="flex items-center space-x-2 text-sm text-gray-900 hover:text-accent cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      className="rounded border-gray-400 text-accent focus:ring-accent"
                                      checked={filters[option.id]?.includes(opt.value) || false}
                                      onChange={(e) => handleFilterChange(option.id, opt.value, e.target.checked)}
                                    />
                                    <span>{opt.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="py-4">
                      <h4 className="text-sm font-semibold text-accent mb-3">
                        Location
                      </h4>
                      {loading ? (
                        <div className="text-sm font-medium text-gray-700">Loading...</div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Community</h5>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                              {communities.map((community) => (
                                <label
                                  key={community}
                                  className="flex items-center space-x-2 text-sm text-gray-900 hover:text-accent cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-400 text-accent focus:ring-accent"
                                    checked={filters.community?.includes(community) || false}
                                    onChange={(e) => handleFilterChange('community', community, e.target.checked)}
                                  />
                                  <span>{community}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Zone</h5>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                              {zones.map((zone) => (
                                <label
                                  key={zone}
                                  className="flex items-center space-x-2 text-sm text-gray-900 hover:text-accent cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-400 text-accent focus:ring-accent"
                                    checked={filters.zone?.includes(zone) || false}
                                    onChange={(e) => handleFilterChange('zone', zone, e.target.checked)}
                                  />
                                  <span>{zone}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-6 border-t">
                      <button
                        onClick={() => {
                          debouncedFiltersChange(filters);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}