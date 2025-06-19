import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface EditMemberModalProps {
  member: any;
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onUpdate: () => Promise<void>;
}

interface MemberData {
  member_id: string;
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
  end_of_parish_membership: string;
  date_of_death: string;
}

export default function EditMemberModal({ member, isOpen, onSuccess, onCancel, onUpdate }: EditMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'select',
    birth_date: '',
    residence: 'select',
    phone_no: '',
    occupation: '',
    household: '',
    household_position: '',
    community: '',
    zone: '',
    baptized: 'select',
    date_baptized: '',
    baptism_no: '',
    church_baptized: '',
    confirmed: 'select',
    confirmation_date: '',
    confirmation_no: '',
    church_confirmed: '',
    marriage_status: 'select',
    marriage_date: '',
    marriage_no: '',
    church_married: '',
    end_of_parish_membership: 'select',
    date_of_death: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch complete member data when modal opens
  const fetchMemberData = async (memberId: string) => {
    if (!memberId) return;
    
    setIsLoading(true);
    setFetchError(null);
    
    try {
      console.log('Fetching member data for ID:', memberId);
      
      // Fetch complete member data from the member_details view
      const { data: memberData, error: memberError } = await supabase
        .from('member_details')
        .select('*')
        .eq('member_id', memberId)
        .single();

      if (memberError) {
        console.error('Error fetching member data:', memberError);
        throw new Error(`Failed to fetch member data: ${memberError.message}`);
      }

      if (!memberData) {
        throw new Error('Member not found');
      }

      console.log('Fetched member data:', memberData);

      // Format and populate form data
      const formattedData = {
        name: memberData.name || '',
        gender: memberData.gender || 'select',
        birth_date: memberData.birth_date || '',
        residence: memberData.residence || 'select',
        phone_no: memberData.phone_no || '',
        occupation: memberData.occupation || '',
        household: memberData.household || '',
        household_position: memberData.household_position || '',
        community: memberData.community || '',
        zone: memberData.zone || '',
        baptized: memberData.baptized || 'select',
        date_baptized: memberData.date_baptized || '',
        baptism_no: memberData.baptism_no || '',
        church_baptized: memberData.church_baptized || '',
        confirmed: memberData.confirmed || 'select',
        confirmation_date: memberData.confirmation_date || '',
        confirmation_no: memberData.confirmation_no || '',
        church_confirmed: memberData.church_confirmed || '',
        marriage_status: memberData.marriage_status || 'select',
        marriage_date: memberData.marriage_date || '',
        marriage_no: memberData.marriage_no || '',
        church_married: memberData.church_married || '',
        end_of_parish_membership: memberData.end_of_parish_membership || 'select',
        date_of_death: memberData.date_of_death || ''
      };

      setFormData(formattedData);
      console.log('Form data populated:', formattedData);
      
    } catch (error) {
      console.error('Error in fetchMemberData:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch member data';
      setFetchError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data when modal opens or member changes
  useEffect(() => {
    if (isOpen && member?.member_id) {
      fetchMemberData(member.member_id);
    } else if (isOpen && member?.id) {
      // Fallback for different ID field names
      fetchMemberData(member.id);
    }
  }, [isOpen, member?.member_id, member?.id]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        gender: 'select',
        birth_date: '',
        residence: 'select',
        phone_no: '',
        occupation: '',
        household: '',
        household_position: '',
        community: '',
        zone: '',
        baptized: 'select',
        date_baptized: '',
        baptism_no: '',
        church_baptized: '',
        confirmed: 'select',
        confirmation_date: '',
        confirmation_no: '',
        church_confirmed: '',
        marriage_status: 'select',
        marriage_date: '',
        marriage_no: '',
        church_married: '',
        end_of_parish_membership: 'select',
        date_of_death: ''
      });
      setError(null);
      setFetchError(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'gender', 'residence', 'baptized', 'confirmed', 'marriage_status'];
    const selectFields = ['gender', 'residence', 'baptized', 'confirmed', 'marriage_status'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || 
          (selectFields.includes(field) && formData[field as keyof typeof formData] === 'select')) {
        return `Please select a valid ${field.replace('_', ' ')}`;
      }
    }
    
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Update waumini table
      const { error: memberError } = await supabase
        .from('waumini')
        .update({
          name: formData.name,
          gender: formData.gender,
          birth_date: formData.birth_date || null,
          residence: formData.residence,
          phone_no: formData.phone_no || null,
          occupation: formData.occupation || null,
          household: formData.household || null,
          household_position: formData.household_position || null
        })
        .eq('member_id', member.member_id || member.id);

      if (memberError) throw memberError;

      // Update related tables using upsert
      const promises = [];

      // Community information
      promises.push(
        supabase.from('community').upsert({
          member_id: member.member_id || member.id,
          community: formData.community || null,
          zone: formData.zone || null,
          end_of_parish_membership: formData.membershipStatus === 'Inactive - Death' ? formData.endDate : null,
          date_of_death: formData.membershipStatus === 'Inactive - Death' ? formData.endDate : null
        }, {
          onConflict: 'member_id'
        })
      );

      // Baptism information
      promises.push(
        supabase.from('baptized').upsert({
          member_id: member.member_id || member.id,
          baptized: formData.baptized,
          date_baptized: formData.date_baptized || null,
          baptism_no: formData.baptism_no || null,
          church_baptized: formData.church_baptized || null
        }, {
          onConflict: 'member_id'
        })
      );

      // Confirmation information
      promises.push(
        supabase.from('confirmation').upsert({
          member_id: member.member_id || member.id,
          confirmed: formData.confirmed,
          confirmation_date: formData.confirmation_date || null,
          confirmation_no: formData.confirmation_no || null,
          church_confirmed: formData.church_confirmed || null
        }, {
          onConflict: 'member_id'
        })
      );

      // Marriage information
      promises.push(
        supabase.from('married').upsert({
          member_id: member.member_id || member.id,
          marriage_status: formData.marriage_status,
          marriage_date: formData.marriage_date || null,
          marriage_no: formData.marriage_no || null,
          church_married: formData.church_married || null
        }, {
          onConflict: 'member_id'
        })
      );

      // Execute all updates
      const results = await Promise.all(promises);
      
      // Check for errors
      for (const result of results) {
        if (result.error) {
          console.error('Error updating related data:', result.error);
          throw new Error('Failed to update complete member record');
        }
      }

      // Call the update function to refresh data
      await onUpdate();
      
      // Call success callback and close modal
      onSuccess();
      onCancel();
      
    } catch (error) {
      console.error('Error updating member:', error);
      setError(error instanceof Error ? error.message : 'Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryFetch = () => {
    if (member?.member_id || member?.id) {
      fetchMemberData(member.member_id || member.id);
    }
  //};

  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-[100]">
      <div className="flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" />
        
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-auto my-4 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 z-10 px-6 lg:px-8 py-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <Dialog.Title className="text-2xl font-bold text-white">
                  Edit Member Information
                </Dialog.Title>
                <p className="text-blue-100 mt-1 text-sm">
                  Update member details and church records
                </p>
              </div>
              <button
                onClick={onCancel}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Loading Member Data</h3>
                    <p className="text-sm text-gray-500">Fetching member information...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fetch Error State */}
            {fetchError && !isLoading && (
              <div className="mx-6 lg:mx-8 mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">Failed to Load Member Data</h3>
                    <p className="text-sm text-red-700 mt-1">{fetchError}</p>
                    <div className="mt-4">
                      <button
                        onClick={handleRetryFetch}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Error State */}
            {error && !isLoading && (
              <div className="mx-6 lg:mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content - Only show when not loading and no fetch error */}
            {!isLoading && !fetchError && (
              <form id="edit-member-form" onSubmit={handleSubmit} className="px-6 lg:px-8 py-8 space-y-12">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        required
                      >
                        <option value="select">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Residence *</label>
                      <select
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        required
                      >
                        <option value="select">Select Residence</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Temporary">Temporary</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_no"
                        value={formData.phone_no}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="+255 XXX XXX XXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>
                </div>

                {/* Household Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Household Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Household</label>
                      <input
                        type="text"
                        name="household"
                        value={formData.household}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Enter household name/ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Position in Household</label>
                      <input
                        type="text"
                        name="household_position"
                        value={formData.household_position}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="e.g., Head, Spouse, Child"
                      />
                    </div>
                  </div>
                </div>

                {/* Community Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Community Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Community</label>
                      <input
                        type="text"
                        name="community"
                        value={formData.community}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Enter community name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Zone</label>
                      <input
                        type="text"
                        name="zone"
                        value={formData.zone}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Enter zone"
                      />
                    </div>
                  </div>
                </div>

                {/* Baptism Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Baptism Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Baptism Status *</label>
                      <select
                        name="baptized"
                        value={formData.baptized}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        required
                      >
                        <option value="select">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Baptism Date</label>
                      <input
                        type="date"
                        name="date_baptized"
                        value={formData.date_baptized}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                      <input
                        type="text"
                        name="baptism_no"
                        value={formData.baptism_no}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Certificate #"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Church Baptized</label>
                      <input
                        type="text"
                        name="church_baptized"
                        value={formData.church_baptized}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Church name"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirmation Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Confirmation Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Confirmation Status *</label>
                      <select
                        name="confirmed"
                        value={formData.confirmed}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        required
                      >
                        <option value="select">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Confirmation Date</label>
                      <input
                        type="date"
                        name="confirmation_date"
                        value={formData.confirmation_date}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                      <input
                        type="text"
                        name="confirmation_no"
                        value={formData.confirmation_no}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Certificate #"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Church Confirmed</label>
                      <input
                        type="text"
                        name="church_confirmed"
                        value={formData.church_confirmed}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Church name"
                      />
                    </div>
                  </div>
                </div>

                {/* Marriage Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Marriage Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Marriage Status *</label>
                      <select
                        name="marriage_status"
                        value={formData.marriage_status}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        required
                      >
                        <option value="select">Select Status</option>
                        <option value="Not Married">Not Married</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Marriage Date</label>
                      <input
                        type="date"
                        name="marriage_date"
                        value={formData.marriage_date}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                      <input
                        type="text"
                        name="marriage_no"
                        value={formData.marriage_no}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Certificate #"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Church Married</label>
                      <input
                        type="text"
                        name="church_married"
                        value={formData.church_married}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors"
                        placeholder="Church name"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="space-y-6">
        <h4 className="text-lg font-semibold text-pink-800">Membership Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Membership Status *</label>
            <select
              name="membershipStatus"
              value={formData.membershipStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
              required
            >
              <option value="select">Select Membership Status</option>
              <option value="Active">Active</option>
              <option value="Inactive - Death">Inactive - Death</option>
              <option value="Inactive - Moved">Inactive - Moved</option>
            </select>
          </div>
          {formData.membershipStatus === 'Inactive - Death' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
                required={formData.membershipStatus === 'Inactive - Death'}
              />
            </div>
          
          {/* Footer - Only show when not loading and no fetch error */}
          {!isLoading && !fetchError && (
            <div className="sticky bottom-0 bg-gray-50 px-6 lg:px-8 py-6 border-t border-gray-200 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 font-medium transition-all duration-200 text-center"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-member-form"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
