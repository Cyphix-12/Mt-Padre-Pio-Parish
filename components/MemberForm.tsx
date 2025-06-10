import { useState } from 'react';
import { X, User, MapPin, Heart, Calendar, Users } from 'lucide-react';
import { user } from 'util/auth';

const { data: { user }, error } = await supabase.auth.getUser();

interface MemberFormProps {
  onClose: () => void;
}

export default function MemberForm({ onClose }: MemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
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
    church_married: ''
  });

  const sections = [
    { id: 0, title: 'Personal Information', icon: User, color: 'bg-blue-500' },
    { id: 1, title: 'Community & Location', icon: MapPin, color: 'bg-green-500' },
    { id: 2, title: 'Baptism', icon: Heart, color: 'bg-purple-500' },
    { id: 3, title: 'Confirmation', icon: Calendar, color: 'bg-orange-500' },
    { id: 4, title: 'Marriage', icon: Users, color: 'bg-pink-500' }
  ];

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create member');
      }

      setSuccess(true);
      
      // Show success message for 2 seconds then close
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating member:', error);
      setError(error instanceof Error ? error.message : 'Failed to create member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            required
          >
            <option value="select">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Residence Status *</label>
          <select
            name="residence"
            value={formData.residence}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            required
          >
            <option value="select">Select Residence Status</option>
            <option value="Permanent">Permanent</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter occupation"
          />
        </div>
      </div>
    </div>
  );

  const renderCommunityInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Community</label>
          <input
            type="text"
            name="community"
            value={formData.community}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter community name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Zone</label>
          <input
            type="text"
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter zone"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Household</label>
          <input
            type="text"
            name="household"
            value={formData.household}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter household"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Position in Household</label>
          <input
            type="text"
            name="household_position"
            value={formData.household_position}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter position"
          />
        </div>
      </div>
    </div>
  );

  const renderBaptismInfo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Baptismal Status *</label>
        <select
          name="baptized"
          value={formData.baptized}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
          required
        >
          <option value="select">Select Baptismal Status</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {formData.baptized === 'Yes' && (
        <div className="space-y-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="text-lg font-semibold text-purple-800">Baptism Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Baptism Date</label>
              <input
                type="date"
                name="date_baptized"
                value={formData.date_baptized}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Baptism Number</label>
              <input
                type="text"
                name="baptism_no"
                value={formData.baptism_no}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder="Enter baptism number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Church Baptized</label>
            <input
              type="text"
              name="church_baptized"
              value={formData.church_baptized}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
              placeholder="Enter church name"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmationInfo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Confirmation Status *</label>
        <select
          name="confirmed"
          value={formData.confirmed}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
          required
        >
          <option value="select">Select Confirmation Status</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {formData.confirmed === 'Yes' && (
        <div className="space-y-6 p-6 bg-orange-50 rounded-xl border border-orange-200">
          <h4 className="text-lg font-semibold text-orange-800">Confirmation Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirmation Date</label>
              <input
                type="date"
                name="confirmation_date"
                value={formData.confirmation_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirmation Number</label>
              <input
                type="text"
                name="confirmation_no"
                value={formData.confirmation_no}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder="Enter confirmation number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Church Confirmed</label>
            <input
              type="text"
              name="church_confirmed"
              value={formData.church_confirmed}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
              placeholder="Enter church name"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderMarriageInfo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Marital Status *</label>
        <select
          name="marriage_status"
          value={formData.marriage_status}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
          required
        >
          <option value="select">Select Marital Status</option>
          <option value="Not Married">Not Married</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Separated">Separated</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>

      {['Married', 'Separated'].includes(formData.marriage_status) && (
        <div className="space-y-6 p-6 bg-pink-50 rounded-xl border border-pink-200">
          <h5 className="text-md font-semibold text-pink-800">Marriage Details</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Marriage Date</label>
              <input
                type="date"
                name="marriage_date"
                value={formData.marriage_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Marriage Number</label>
              <input
                type="text"
                name="marriage_no"
                value={formData.marriage_no}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder="Enter marriage number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Church Married</label>
            <input
              type="text"
              name="church_married"
              value={formData.church_married}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
              placeholder="Enter church name"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 0: 
        return renderPersonalInfo();
      case 1: 
        return renderCommunityInfo();
      case 2: 
        return renderBaptismInfo();
      case 3: 
        return renderConfirmationInfo();
      case 4: 
        return renderMarriageInfo();
      default: 
        return renderPersonalInfo();
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Member Created Successfully!</h3>
          <p className="text-gray-600">The new member has been added to the parish records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black bg-opacity-50 overflow-auto lg:pl-64">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl min-h-[90vh] flex overflow-hidden my-4">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex flex-col max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Member Registration</h2>
              <p className="text-slate-300 text-sm mt-1">Complete all sections</p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="space-y-2 flex-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeSection === section.id ? section.color : 'bg-slate-600'
                  }`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{section.title}</div>
                    <div className="text-xs opacity-70">Step {section.id + 1}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 p-4 bg-slate-700 rounded-xl">
            <div className="text-slate-300 text-xs mb-2">Progress</div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-slate-400 text-xs mt-2">
              {activeSection + 1} of {sections.length} sections
            </div>
          </div>
        </div>

        {/* Main Content - Wrapped in form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-h-screen">
          <div className="p-8 flex-1 overflow-y-auto min-h-0">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {sections[activeSection].title}
              </h3>
              <p className="text-gray-600">
                Please fill in the required information below
              </p>
            </div>

            <div>
              {renderSectionContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeSection === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              
              {activeSection === sections.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'opacity-75 cursor-not-allowed'
                      : 'hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Member'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
