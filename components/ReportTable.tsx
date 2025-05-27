'use client'

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Trash2, User, Phone, MapPin, Home, Church, Calendar, Users, Award, AlertTriangle } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { getUserRole } from '@/utils/auth';

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

function DeleteConfirmationModal({ isOpen, member, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Member</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete <strong>{member?.name}</strong> from the church records?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This will permanently remove all their information including sacramental records.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, children, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 to-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
          <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
          )}
        </div>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-6 pb-6 pt-2 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      {Icon && <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm text-gray-900 font-medium break-words">{value || 'Not Available'}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status, type }) {
  const getStatusColor = (status, type) => {
    if (status === 'Yes' || status === 'Married') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else if (status === 'No' || status === 'Single') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    } else if (status === 'Not Available') {
      return 'bg-gray-100 text-gray-600 border-gray-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status, type)}`}>
      {status}
    </span>
  );
}

export default function ReportTable({ filters, searchQuery }: ReportTableProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCommunityLeader, setIsCommunityLeader] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMembers();
    checkAdminStatus();
  }, [filters, searchQuery]);

  const checkAdminStatus = async () => {
    const role = await getUserRole();
    const roleName = role?.role_name;
    setIsAdmin(roleName === 'Admin');
    setIsCommunityLeader(roleName === 'Community Leader');
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    // Handle edit functionality
  };

  const handleDelete = async (member: Member) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('waumini')
        .delete()
        .eq('member_id', memberToDelete.id)
        .single();

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      setDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  async function fetchMembers() {
    try {
      let query = supabase.from('member_details').select('*');

      // Apply filters
      if (filters.gender?.length) {
        query = query.in('gender', filters.gender);
      }
      
      if (filters.residence?.length) {
        query = query.in('residence', filters.residence);
      }

      if (filters.community?.length) {
        query = query.in('community', filters.community);
      }
      
      if (filters.zone?.length) {
        query = query.in('zone', filters.zone);
      }
      
      if (filters.baptism?.length) {
        query = query.in('baptized', filters.baptism);
      }

      if (filters.confirmation?.length) {
        query = query.in('confirmed', filters.confirmation);
      }

      if (filters.marriage_status?.length) {
        query = query.in('marriage_status', filters.marriage_status);
      }

      // Handle search query
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

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
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">
                {members.length} member{members.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      </div>

      {members.map((member) => (
        <div key={member.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-indigo-100 text-sm">{member.community}</span>
                    <span className="text-indigo-200 text-xs">•</span>
                    <span className="text-indigo-100 text-sm">{member.zone}</span>
                    <span className="text-indigo-200 text-xs">•</span>
                    <span className="text-indigo-100 text-sm">Age: {calculateAge(member.birth_date)}</span>
                  </div>
                </div>
              </div>
              
              {(isAdmin || isCommunityLeader) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(member)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-300/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Personal Info</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Gender:</span> <span className="font-medium">{member.gender}</span></div>
                  <div><span className="text-gray-600">DOB:</span> <span className="font-medium">{new Date(member.birth_date).toLocaleDateString()}</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Contact</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{member.phone_no}</span></div>
                  <div><span className="text-gray-600">Residence:</span> <span className="font-medium">{member.residence}</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <Home className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Household</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Family:</span> <span className="font-medium">{member.household}</span></div>
                  <div><span className="text-gray-600">Position:</span> <span className="font-medium">{member.household_position}</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Occupation</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-gray-900">{member.occupation}</div>
                </div>
              </div>
            </div>

            {/* Sacramental Status */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Baptized:</span>
                <StatusBadge status={member.baptized} type="baptism" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Confirmed:</span>
                <StatusBadge status={member.confirmed} type="confirmation" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Marriage:</span>
                <StatusBadge status={member.marriage_status} type="marriage" />
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <CollapsibleSection title="Baptism Information" icon={Church}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Baptism Status" value={member.baptized} />
                  <InfoItem label="Date Baptized" value={member.date_baptized} icon={Calendar} />
                  <InfoItem label="Certificate Number" value={member.baptism_no} />
                  <InfoItem label="Church" value={member.church_baptized} icon={Church} />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Confirmation Information" icon={Award}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Confirmation Status" value={member.confirmed} />
                  <InfoItem label="Confirmation Date" value={member.confirmation_date} icon={Calendar} />
                  <InfoItem label="Certificate Number" value={member.confirmation_no} />
                  <InfoItem label="Church" value={member.church_confirmed} icon={Church} />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Marriage Information" icon={Users}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Marriage Status" value={member.marriage_status} />
                  <InfoItem label="Marriage Date" value={member.marriage_date} icon={Calendar} />
                  <InfoItem label="Certificate Number" value={member.marriage_no} />
                  <InfoItem label="Church" value={member.church_married} icon={Church} />
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        member={memberToDelete}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}