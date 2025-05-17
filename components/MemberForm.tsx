'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MemberFormProps {
  onClose: () => void;
}

export default function MemberForm({ onClose }: MemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
  [key: string]: string;
}>({
    jina_first: '',
    jina_middle: '',
    jina_last: '',
    gender: 'select',
    jumuiya: '',
    kanda: '',
    kaya: '',
    nafasi_kaya: '',
    phone: '',
    occupation: '',
    tarehe_kuzaliwa: '',
    residence: 'select',
    baptism: 'select',
    baptismDate: '',
    baptismNumber: '',
    baptismChurch: '',
    confirmation: 'select',
    confirmationDate: '',
    confirmationNumber: '',
    confirmationChurch: '',
    marriage: 'select',
    marriageDate: '',
    marriageNumber: '',
    marriageChurch: '',
    membershipStatus: 'select',
    endDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Validate required selections
    const requiredFields = ['gender', 'residence', 'baptism', 'confirmation', 'marriage', 'membershipStatus'];
    const emptyFields = requiredFields.filter(field => formData[field] === 'select');
    
    if (emptyFields.length > 0) {
      setError('Please select all required options marked with (*)');
      setIsSubmitting(false);
      return;
    }

    // Validate conditional requirements
    if (formData.baptism === 'Baptized') {
      if (!formData.baptismDate || !formData.baptismNumber || !formData.baptismChurch) {
        setError('Please fill in all baptism details');
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.confirmation === 'Confirmed') {
      if (!formData.confirmationDate || !formData.confirmationNumber || !formData.confirmationChurch) {
        setError('Please fill in all confirmation details');
        setIsSubmitting(false);
        return;
      }
    }

    if (['Married', 'Separated'].includes(formData.marriage)) {
      if (!formData.marriageDate || !formData.marriageNumber || !formData.marriageChurch) {
        setError('Please fill in all marriage details');
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.membershipStatus === 'Inactive - Death' && !formData.endDate) {
      setError('Please specify the date for inactive membership status');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Step 1: Create the member record first
      const { data: memberData, error: memberError } = await supabase
        .from('waumini')
        .insert([{
          name: `${formData.jina_first} ${formData.jina_middle} ${formData.jina_last}`.trim(),
          gender: formData.gender,
          household: formData.kaya,
          household_position: formData.nafasi_kaya,
          birth_date: formData.tarehe_kuzaliwa,
          phone_no: formData.phone,
          occupation: formData.occupation,
          residence: formData.residence
        }])
        .select()
        .single();

      if (memberError) throw memberError;
      if (!memberData) throw new Error('Failed to create member record');
      
      // Step 2: Create the community record
      const { error: communityError } = await supabase
        .from('community')
        .insert([{
          member_id: memberData.member_id,
          community: formData.jumuiya,
          zone: formData.kanda,
          end_of_parish_membership: formData.membershipStatus === 'Inactive - Death' ? formData.endDate : null,
          date_of_death: formData.membershipStatus === 'Inactive - Death' ? formData.endDate : null
        }]);

      if (communityError) throw communityError;

      // Step 3: Create baptism record if applicable
      if (formData.baptism === 'Baptized') {
        const { error: baptismError } = await supabase
          .from('baptized')
          .insert([{
            member_id: memberData.member_id,
            baptized: 'Yes',
            date_baptized: formData.baptismDate,
            church_baptized: formData.baptismChurch,
            baptism_no: formData.baptismNumber
          }]);
        
        if (baptismError) throw baptismError;
      }

      // Step 4: Create confirmation record if applicable
      if (formData.confirmation === 'Confirmed') {
        const { error: confirmationError } = await supabase
          .from('confirmation')
          .insert([{
            member_id: memberData.member_id,
            confirmed: 'Yes',
            confirmation_date: formData.confirmationDate,
            church_confirmed: formData.confirmationChurch,
            confirmation_no: formData.confirmationNumber
          }]);
        
        if (confirmationError) throw confirmationError;
      }

      // Step 5: Create marriage record if applicable
      if (formData.marriage !== 'Not Married') {
        const { error: marriageError } = await supabase
          .from('married')
          .insert([{
            member_id: memberData.member_id,
            marriage_status: formData.marriage,
            marriage_date: formData.marriageDate,
            church_married: formData.marriageChurch,
            marriage_no: formData.marriageNumber
          }]);
        
        if (marriageError) throw marriageError;
      }

      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the member';
      setError(errorMessage);
      console.error('Error adding member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-[200]">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-accent">Member Information</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 px-6 py-6 overflow-y-auto">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Name</label>
              <div className="flex-1 grid grid-cols-3 gap-2">
                {['First', 'Middle', 'Last'].map((part, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`jina_${part.toLowerCase()}`}
                    placeholder={part}
                    value={formData[`jina_${part.toLowerCase()}`] || ''}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-500 placeholder-gray-500"
                    required
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Gender *</label>
              <div className="flex gap-4">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  required
                >
                  <option value="select" className="text-gray-500">Select Gender</option>
                  <option value="Male" className="text-gray-500">Male</option>
                  <option value="Female" className="text-gray-500">Female</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Community</label>
              <div className="flex-1">
                <input
                  type="text"
                  name="jumuiya"
                  value={formData.jumuiya}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Zone</label>
              <div className="flex-1">
                <input
                  type="text"
                  name="kanda"
                  value={formData.kanda}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Household</label>
              <div className="flex-1">
                <input
                  type="text"
                  name="kaya"
                  value={formData.kaya}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Position</label>
              <div className="flex-1">
                <input
                  type="text"
                  name="nafasi_kaya"
                  value={formData.nafasi_kaya}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Phone</label>
              <div className="flex-1">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Occupation</label>
              <div className="flex-1">
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Date of Birth</label>
              <div className="flex-1">
                <input
                  type="date"
                  name="tarehe_kuzaliwa"
                  value={formData.tarehe_kuzaliwa}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 text-right mr-4 text-accent font-medium">Residence Status *</label>
              <div className="flex gap-4">
                <select
                  name="residence"
                  value={formData.residence}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  required
                >
                  <option value="select" className="text-gray-500">Select Residence Status</option>
                  <option value="Permanent" className="text-gray-500">Permanent</option>
                  <option value="Temporary" className="text-gray-500">Temporary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Baptism Section */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Baptismal Status *</label>
                <div className="flex gap-4">
                  <select
                    name="baptism"
                    value={formData.baptism}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                    required
                  >
                    <option value="select" className="text-gray-500">Select Baptismal Status</option>
                    <option value="Baptized" className="text-gray-500">Baptized</option>
                    <option value="Not Baptized" className="text-gray-500">Not Baptized</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Date</label>
                <div className="flex-1">
                  <input
                    type="date"
                    name="baptismDate"
                    value={formData.baptismDate}
                    onChange={handleChange}
                    required={formData.baptism === 'Baptized'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Number</label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="baptismNumber"
                    value={formData.baptismNumber}
                    onChange={handleChange}
                    required={formData.baptism === 'Baptized'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Church</label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="baptismChurch"
                    value={formData.baptismChurch}
                    onChange={handleChange}
                    required={formData.baptism === 'Baptized'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Section */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Confirmation Status *</label>
                <div className="flex gap-4">
                  <select
                    name="confirmation"
                    value={formData.confirmation}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                    required
                  >
                    <option value="select" className="text-gray-500">Select Confirmation Status</option>
                    <option value="Confirmed" className="text-gray-500">Confirmed</option>
                    <option value="Not Confirmed" className="text-gray-500">Not Confirmed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Date</label>
                <div className="flex-1">
                  <input
                    type="date"
                    name="confirmationDate"
                    value={formData.confirmationDate}
                    onChange={handleChange}
                    required={formData.confirmation === 'Confirmed'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Number</label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="confirmationNumber"
                    value={formData.confirmationNumber}
                    onChange={handleChange}
                    required={formData.confirmation === 'Confirmed'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Church</label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="confirmationChurch"
                    value={formData.confirmationChurch}
                    onChange={handleChange}
                    required={formData.confirmation === 'Confirmed'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Marriage Section */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Marital Status *</label>
                <div className="flex gap-4">
                  <select
                    name="marriage"
                    value={formData.marriage}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                    required
                  >
                    <option value="select" className="text-gray-500">Select Marital Status</option>
                    <option value="Divorced" className="text-gray-500">Divorced</option>
                    <option value="Married" className="text-gray-500">Married</option>
                    <option value="Not Married" className="text-gray-500">Not Married</option>
                    <option value="Separated" className="text-gray-500">Separated</option>
                    <option value="Widowed" className="text-gray-500">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Date</label>
                <div className="flex-1">
                  <input
                    type="date"
                    name="marriageDate"
                    value={formData.marriageDate}
                    onChange={handleChange}
                    required={['Married', 'Separated'].includes(formData.marriage)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Number</label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="marriageNumber"
                    value={formData.marriageNumber}
                    onChange={handleChange}
                    required={['Married', 'Separated'].includes(formData.marriage)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Church</label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="marriageChurch"
                    value={formData.marriageChurch}
                    onChange={handleChange}
                    required={['Married', 'Separated'].includes(formData.marriage)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* End of Membership Section */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Membership Status *</label>
                <div className="flex gap-4">
                  <select
                    name="membershipStatus"
                    value={formData.membershipStatus}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                    required
                  >
                    <option value="select" className="text-gray-500">Select Membership Status</option>
                    <option value="Active" className="text-gray-500">Active</option>
                    <option value="Inactive - Death" className="text-gray-500">Inactive - Death</option>
                    <option value="Inactive - Moved" className="text-gray-500">Inactive - Moved</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right mr-4 text-accent font-medium">Date</label>
                <div className="flex-1">
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required={formData.membershipStatus === 'Inactive - Death'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-12 py-3 border-2 border-accent rounded-full text-accent hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-3 bg-accent text-white rounded-full font-medium
                ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-900'}`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
          
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t rounded-b-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-6 py-2 border-2 border-accent rounded-full text-accent hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent/90"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
