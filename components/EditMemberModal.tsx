import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';

interface EditMemberModalProps {
  member: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}

export default function EditMemberModal({ member, isOpen, onClose, onUpdate }: EditMemberModalProps) {
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
      onClose();
    } catch (error) {
      console.error('Error updating member:', error);
      setError(error instanceof Error ? error.message : 'Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-[100]">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-5xl w-full mx-auto my-8">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold text-accent">
              Edit Member Information
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form id="edit-member-form" onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-accent">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  >
                    <option value="select">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Residence</label>
                  <select
                    name="residence"
                    value={formData.residence}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  >
                    <option value="select">Select Residence</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-accent">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Household Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-accent">Household Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Household</label>
                  <input
                    type="text"
                    name="household"
                    value={formData.household}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    name="household_position"
                    value={formData.household_position}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Community Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-accent">Community Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Community</label>
                  <input
                    type="text"
                    name="community"
                    value={formData.community}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zone</label>
                  <input
                    type="text"
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Baptism Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-accent">Baptism Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Baptism Status</label>
                  <select
                    name="baptized"
                    value={formData.baptized}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  >
                    <option value="select">Select Status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date_baptized"
                    value={formData.date_baptized}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                  <input
                    type="text"
                    name="baptism_no"
                    value={formData.baptism_no}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Church</label>
                  <input
                    type="text"
                    name="church_baptized"
                    value={formData.church_baptized}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Confirmation Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-accent">Confirmation Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmation Status</label>
                  <select
                    name="confirmed"
                    value={formData.confirmed}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  >
                    <option value="select">Select Status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="confirmation_date"
                    value={formData.confirmation_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                  <input
                    type="text"
                    name="confirmation_no"
                    value={formData.confirmation_no}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Church</label>
                  <input
                    type="text"
                    name="church_confirmed"
                    value={formData.church_confirmed}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Marriage Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-accent">Marriage Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Marriage Status</label>
                  <select
                    name="marriage_status"
                    value={formData.marriage_status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="marriage_date"
                    value={formData.marriage_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                  <input
                    type="text"
                    name="marriage_no"
                    value={formData.marriage_no}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Church</label>
                  <input
                    type="text"
                    name="church_married"
                    value={formData.church_married}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>
            </form>
          </div>
          
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-b-xl">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-member-form"
                className="px-8 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}