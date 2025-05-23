'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getUserRole } from '@/utils/auth';
import EditMemberModal from './EditMemberModal';

interface Muumini {
  id: string;
  // Primary Information
  name: string;
  gender: string;
  birth_date: string;
  residence: string;
  phone_no: string;
  occupation: string;
  // Household Details
  household: string;
  household_position: string;
  community: string;
  zone: string;
  // Sacramental Records
  baptized: string;
  date_baptized: string;
  baptism_no: string;
  church_baptized: string;
  confirmed: string;
  confirmation_date: string;
  confirmation_no: string;
  church_confirmed: string;
  marriage_status: string;
  marriage_date: string;
  marriage_no: string;
  church_married: string;
}

interface ReportTableProps {
  filters: Record<string, string[]>;
  searchQuery: string;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-sm text-gray-700">{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

function ReportTable({ filters, searchQuery }: ReportTableProps) {
  const [waumini, setWaumini] = useState<Muumini[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCommunityLeader, setIsCommunityLeader] = useState(false);
  const [allWaumini, setAllWaumini] = useState<Muumini[]>([]);
  const [selectedMember, setSelectedMember] = useState<Muumini | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching members with filters:', filters);
    fetchWaumini();
    checkAdminStatus();
  }, [filters]); // Consider adding checkAdminStatus to dependencies

  const checkAdminStatus = async () => {
    console.log('Checking admin status...');
    const role = await getUserRole();
    const roleName = role?.role_name;
    console.log('User role:', roleName);
    setIsAdmin(roleName === 'Admin');
    setIsCommunityLeader(roleName === 'Community Leader');
    console.log('isAdmin set to:', roleName === 'Admin');
    console.log('isCommunityLeader set to:', roleName === 'Community Leader');
  };

  const handleEdit = (member: Muumini) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const { error } = await supabase
        .from('waumini')
        .delete()
        .eq('member_id', memberId);

      if (error) throw error;

      // Update local state
      setWaumini(prev => prev.filter(m => m.id !== memberId));
      setAllWaumini(prev => prev.filter(m => m.id !== memberId));
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  };

  useEffect(() => {
    const filtered = allWaumini.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setWaumini(filtered);
  }, [searchQuery, allWaumini]);

  async function fetchWaumini() {
    try {
      console.log('Building query with filters:', filters);
      let query = supabase.from('member_details').select('*');

      // Handle basic filters
      if (filters.gender?.length) {
        query.in('gender', filters.gender);
      }
      
      if (filters.residence?.length) {
        query.in('residence', filters.residence);
      }

      // Handle community and zone filters
      if (filters.community?.length) {
        query.in('community', filters.community);
      }
      
      if (filters.zone?.length) {
        query.in('zone', filters.zone);
      }
      
      // Handle baptism status
      if (filters.baptism?.length) {
        query.in('baptized', filters.baptism);
      }

      // Handle confirmation status
      if (filters.confirmation?.length) {
        query.in('confirmed', filters.confirmation);
      }

      // Handle marriage status
      if (filters.marriage_status?.length) {
        query.in('marriage_status', filters.marriage_status);
      }

      // Execute query with ordering
      const { data, error } = await query.order('name');

      console.log('Query response:', { data, error }); // Add logging to debug

      if (error) throw error;

      const detailedData = data?.map(member => ({
        id: member.member_id,
        name: member.name,
        gender: member.gender,
        birth_date: member.birth_date || 'Not Available',
        residence: member.residence || 'Not Available',
        phone_no: member.phone_no || 'Not Available',
        occupation: member.occupation || 'Not Available',
        household: member.household || 'Not Available',
        household_position: member.household_position || 'Not Available',
        community: member.community || 'Not Available',
        zone: member.zone || 'Not Available',
        baptized: member.baptized || 'No',
        date_baptized: member.date_baptized || 'Not Available',
        baptism_no: member.baptism_no || 'Not Available',
        church_baptized: member.church_baptized || 'Not Available',
        confirmed: member.confirmed || 'No',
        confirmation_date: member.confirmation_date || 'Not Available',
        confirmation_no: member.confirmation_no || 'Not Available',
        church_confirmed: member.church_confirmed || 'Not Available',
        marriage_status: member.marriage_status || 'Not Married',
        marriage_date: member.marriage_date || 'Not Available',
        marriage_no: member.marriage_no || 'Not Available',
        church_married: member.church_married || 'Not Available'
      })) || [];

      console.log('Detailed data:', detailedData);
      setAllWaumini(detailedData);
      setWaumini(detailedData);
    } catch (error) {
      console.error('Error fetching members:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (waumini.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center text-gray-500">
        No members found
      </div>
    );
  }
  
 console.log('Current isAdmin state:', isAdmin);
  
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden max-w-full">
      <div className="overflow-x-auto">
       
        {waumini.map((muumini) => (
          <div key={muumini.id} className="border-b border-gray-200 last:border-b-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-accent">{muumini.name}</h3>
                <div className="flex gap-2 ml-4">
                  {(isAdmin || isCommunityLeader) && (
                    <button
                      onClick={() => handleEdit(muumini)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <PencilIcon className="w-5 h-5" />
                      <span>Edit</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(muumini.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                    >
                      <TrashIcon className="w-5 h-5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Gender:</span>{' '}
                    <span className="text-gray-900">{muumini.gender}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Date of Birth:</span>{' '}
                    <span className="text-gray-900">{muumini.birth_date}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Residence:</span>{' '}
                    <span className="text-gray-900">{muumini.residence}</span>
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Phone:</span>{' '}
                      <span className="text-gray-900">{muumini.phone_no}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Occupation:</span>{' '}
                      <span className="text-gray-900">{muumini.occupation}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Household Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Household:</span>{' '}
                      <span className="text-gray-900">{muumini.household}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Position:</span>{' '}
                      <span className="text-gray-900">{muumini.household_position}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Community Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Community:</span>{' '}
                      <span className="text-gray-900">{muumini.community}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Zone:</span>{' '}
                      <span className="text-gray-900">{muumini.zone}</span>
                    </p>
                  </div>
                </div>
              </div>

              <CollapsibleSection title="Baptism Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Status:</span>{' '}
                    <span className="text-gray-900">{muumini.baptized}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Date:</span>{' '}
                    <span className="text-gray-900">{muumini.date_baptized}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Certificate No:</span>{' '}
                    <span className="text-gray-900">{muumini.baptism_no}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Church:</span>{' '}
                    <span className="text-gray-900">{muumini.church_baptized}</span>
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Confirmation Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Status:</span>{' '}
                    <span className="text-gray-900">{muumini.confirmed}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Date:</span>{' '}
                    <span className="text-gray-900">{muumini.confirmation_date}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Certificate No:</span>{' '}
                    <span className="text-gray-900">{muumini.confirmation_no}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Church:</span>{' '}
                    <span className="text-gray-900">{muumini.church_confirmed}</span>
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Marriage Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Status:</span>{' '}
                    <span className="text-gray-900">{muumini.marriage_status}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Date:</span>{' '}
                    <span className="text-gray-900">{muumini.marriage_date}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Certificate No:</span>{' '}
                    <span className="text-gray-900">{muumini.marriage_no}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Church:</span>{' '}
                    <span className="text-gray-900">{muumini.church_married}</span>
                  </p>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <EditMemberModal
          member={selectedMember}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMember(null);
          }}
          onUpdate={fetchWaumini}
        />
      )}
    </div>
  );
}

export default ReportTable;
