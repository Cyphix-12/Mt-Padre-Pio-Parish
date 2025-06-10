import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';

interface EditMemberModalProps {
  member: any;
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onUpdate: () => Promise<void>;
}

export default function EditMemberModal({ member, isOpen, onSuccess, onCancel, onUpdate }: EditMemberModalProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    gender: member?.gender || 'select',
    birth_date: member?.birth_date || '',
    residence: member?.residence || 'select',
    phone_no: member?.phone_no || '',
    occupation: member?.occupation || '',
    household: member?.household || '',
    household_position: member?.household_position || '',
    community: member?.community || '',
    zone: member?.zone || '',
    baptized: member?.baptized || 'select',
    date_baptized: member?.date_baptized || '',
    baptism_no: member?.baptism_no || '',
    church_baptized: member?.church_baptized || '',
    confirmed: member?.confirmed || 'select',
    confirmation_date: member?.confirmation_date || '',
    confirmation_no: member?.confirmation_no || '',
    church_confirmed: member?.church_confirmed || '',
    marriage_status: member?.marriage_status || 'select',
    marriage_date: member?.marriage_date || '',
    marriage_no: member?.marriage_no || '',
    church_married: member?.church_married || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Update waumini table
      const { error: memberError } = await supabase
        .from('waumini')
        .update({
          name: formData.name,
          gender: formData.gender,
          birth_date: formData.birth_date,
          residence: formData.residence,
          phone_no: formData.phone_no,
          occupation: formData.occupation,
          household: formData.household,
          household_position: formData.household_position
        })
        .eq('member_id', member.id);

      if (memberError) throw memberError;

      // Update related tables
      await Promise.all([
        supabase
          .from('community')
          .upsert({
            member_id: member.id,
            community: formData.community,
            zone: formData.zone
          }),
        supabase
          .from('baptized')
          .upsert({
            member_id: member.id,
            baptized: formData.baptized,
            date_baptized: formData.date_baptized,
            baptism_no: formData.baptism_no,
            church_baptized: formData.church_baptized
          }),
        supabase
          .from('confirmation')
          .upsert({
            member_id: member.id,
            confirmed: formData.confirmed,
            confirmation_date: formData.confirmation_date,
            confirmation_no: formData.confirmation_no,
            church_confirmed: formData.church_confirmed
          }),
        supabase
          .from('married')
          .upsert({
            member_id: member.id,
            marriage_status: formData.marriage_status,
            marriage_date: formData.marriage_date,
            marriage_no: formData.marriage_no,
            church_married: formData.church_married
          })
      ]);

      await onUpdate();
      onCancel();
    } catch (error) {
      console.error('Error updating member:', error);
      setError(error instanceof Error ? error.message : 'Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-[100]">
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
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            {error && (
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
          </div>
          
          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 lg:px-8 py-6 border-t border-gray-200 rounded-b-2xl">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
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
        </div>
      </div>
    </Dialog>
  );
}
