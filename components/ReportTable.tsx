'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getUserRole } from '@/utils/auth';
import EditMemberModal from './EditMemberModal';

interface Muumini {
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
      {isOpen && <div className="px-4 py-3 bg-white">{children}</div>}
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
    fetchWaumini();
    checkUserRole();
  }, [filters]);

  const checkUserRole = async () => {
    const role = await getUserRole();
    const roleName = role?.role_name;
    setIsAdmin(roleName === 'Admin');
    setIsCommunityLeader(roleName === 'Community Leader');
  };

  const handleEdit = (member: Muumini) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    const { error } = await supabase.from('waumini').delete().eq('member_id', memberId);
    if (error) {
      alert('Failed to delete member');
      return;
    }
    setWaumini(prev => prev.filter(m => m.id !== memberId));
    setAllWaumini(prev => prev.filter(m => m.id !== memberId));
  };

  useEffect(() => {
    const filtered = allWaumini.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setWaumini(filtered);
  }, [searchQuery, allWaumini]);

  async function fetchWaumini() {
    setLoading(true);
    try {
      let query = supabase.from('member_details').select('*');

      Object.entries(filters).forEach(([key, value]) => {
        if (value.length) query = query.in(key, value);
      });

      const { data, error } = await query.order('name');
      if (error) throw error;

      const formatted = (data || []).map(member => ({
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
      }));

      setAllWaumini(formatted);
      setWaumini(formatted);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (waumini.length === 0)
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center text-gray-500">
        No members found
      </div>
    );

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden max-w-full">
      <div className="overflow-x-auto">
        {waumini.map(m => (
          <div key={m.id} className="border-b border-gray-200 last:border-b-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-accent">{m.name}</h3>
                {(isAdmin || isCommunityLeader) && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(m)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <PencilIcon className="w-5 h-5" /> <span>Edit</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                      >
                        <TrashIcon className="w-5 h-5" /> <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm"><strong>Gender:</strong> {m.gender}</p>
                  <p className="text-sm"><strong>Date of Birth:</strong> {m.birth_date}</p>
                  <p className="text-sm"><strong>Residence:</strong> {m.residence}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Contact Information</h4>
                  <p className="text-sm"><strong>Phone:</strong> {m.phone_no}</p>
                  <p className="text-sm"><strong>Occupation:</strong> {m.occupation}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Household Details</h4>
                  <p className="text-sm"><strong>Household:</strong> {m.household}</p>
                  <p className="text-sm"><strong>Position:</strong> {m.household_position}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Community Details</h4>
                  <p className="text-sm"><strong>Community:</strong> {m.community}</p>
                  <p className="text-sm"><strong>Zone:</strong> {m.zone}</p>
                </div>
              </div>

              <CollapsibleSection title="Baptism Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <p className="text-sm"><strong>Status:</strong> {m.baptized}</p>
                  <p className="text-sm"><strong>Date:</strong> {m.date_baptized}</p>
                  <p className="text-sm"><strong>Certificate No:</strong> {m.baptism_no}</p>
                  <p className="text-sm"><strong>Church:</strong> {m.church_baptized}</p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Confirmation Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <p className="text-sm"><strong>Status:</strong> {m.confirmed}</p>
                  <p className="text-sm"><strong>Date:</strong> {m.confirmation_date}</p>
                  <p className="text-sm"><strong>Certificate No:</strong> {m.confirmation_no}</p>
                  <p className="text-sm"><strong>Church:</strong> {m.church_confirmed}</p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Marriage Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <p className="text-sm"><strong>Status:</strong> {m.marriage_status}</p>
                  <p className="text-sm"><strong>Date:</strong> {m.marriage_date}</p>
                  <p className="text-sm"><strong>Certificate No:</strong> {m.marriage_no}</p>
                  <p className="text-sm"><strong>Church:</strong> {m.church_married}</p>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        ))}
      </div>

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={selectedMember}
      />
    </div>
  );
}

export default ReportTable;
