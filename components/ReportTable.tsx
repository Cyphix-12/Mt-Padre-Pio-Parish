'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getUserRole } from '@/utils/auth';
import EditMemberModal from './EditMemberModal';

interface Member {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  residence: string;
  phone_no: string;
  occupation: string;
  household: string;
  household_position: string;
  community: string;
  zone: string;
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

export default function ReportTable({ filters, searchQuery }: ReportTableProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCommunityLeader, setIsCommunityLeader] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching members with filters:', filters);
    fetchMembers();
    checkAdminStatus();
  }, [filters, searchQuery]);

  const checkAdminStatus = async () => {
    console.log('Checking admin status...');
    const role = await getUserRole();
    const roleName = role?.role_name;
    console.log('User role:', roleName);
    setIsAdmin(roleName === 'Admin');
    setIsCommunityLeader(roleName === 'Community Leader');
  };

  const handleEdit = (member: Member) => {
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
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  };

  async function fetchMembers() {
    try {
      console.log('Building query with filters:', filters);
      let query = supabase.from('member_details').select('*');

      // Handle basic filters
      if (filters.gender?.length) {
        query = query.in('gender', filters.gender);
      }
      
      if (filters.residence?.length) {
        query = query.in('residence', filters.residence);
      }

      // Handle community and zone filters
      if (filters.community?.length) {
        query = query.in('community', filters.community);
      }
      
      if (filters.zone?.length) {
        query = query.in('zone', filters.zone);
      }
      
      // Handle baptism status
      if (filters.baptism?.length) {
        query = query.in('baptized', filters.baptism);
      }

      // Handle confirmation status
      if (filters.confirmation?.length) {
        query = query.in('confirmed', filters.confirmation);
      }

      // Handle marriage status
      if (filters.marriage_status?.length) {
        query = query.in('marriage_status', filters.marriage_status);
      }

      // Handle search query
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      // Execute query with ordering
      const { data, error } = await query.order('name');

      if (error) throw error;

      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center text-gray-500">
        No members found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {members.map((member) => (
        <div key={member.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-accent">{member.name}</h3>
              <div className="flex gap-2">
                {(isAdmin || isCommunityLeader) && (
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Edit
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Gender:</span>{' '}
                  <span className="text-gray-900">{member.gender}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Birth Date:</span>{' '}
                  <span className="text-gray-900">{member.birth_date}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Residence:</span>{' '}
                  <span className="text-gray-900">{member.residence}</span>
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-600 mb-2">Contact Information</h4>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Phone:</span>{' '}
                  <span className="text-gray-900">{member.phone_no}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Occupation:</span>{' '}
                  <span className="text-gray-900">{member.occupation}</span>
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-600 mb-2">Household Details</h4>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Household:</span>{' '}
                  <span className="text-gray-900">{member.household}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Position:</span>{' '}
                  <span className="text-gray-900">{member.household_position}</span>
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-600 mb-2">Community Details</h4>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Community:</span>{' '}
                  <span className="text-gray-900">{member.community}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Zone:</span>{' '}
                  <span className="text-gray-900">{member.zone}</span>
                </p>
              </div>
            </div>

            <CollapsibleSection title="Baptism Information">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Status:</span>{' '}
                  <span className="text-gray-900">{member.baptized}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Date:</span>{' '}
                  <span className="text-gray-900">{member.date_baptized}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Certificate No:</span>{' '}
                  <span className="text-gray-900">{member.baptism_no}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Church:</span>{' '}
                  <span className="text-gray-900">{member.church_baptized}</span>
                </p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Confirmation Information">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Status:</span>{' '}
                  <span className="text-gray-900">{member.confirmed}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Date:</span>{' '}
                  <span className="text-gray-900">{member.confirmation_date}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Certificate No:</span>{' '}
                  <span className="text-gray-900">{member.confirmation_no}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Church:</span>{' '}
                  <span className="text-gray-900">{member.church_confirmed}</span>
                </p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Marriage Information">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Status:</span>{' '}
                  <span className="text-gray-900">{member.marriage_status}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Date:</span>{' '}
                  <span className="text-gray-900">{member.marriage_date}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Certificate No:</span>{' '}
                  <span className="text-gray-900">{member.marriage_no}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Church:</span>{' '}
                  <span className="text-gray-900">{member.church_married}</span>
                </p>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      ))}

      {selectedMember && (
        <EditMemberModal
          member={selectedMember}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMember(null);
          }}
          onUpdate={fetchMembers}
        />
      )}
    </div>
  );
}