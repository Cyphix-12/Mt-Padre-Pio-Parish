import { useState } from 'react';
import { X, User, MapPin, Heart, Calendar, Users } from 'lucide-react';

interface MemberFormProps {
  onClose: () => void;
}

export default function MemberForm({ onClose }: MemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState({
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

  const sections = [
    { id: 0, title: 'Personal Information', icon: User, color: 'bg-blue-500' },
    { id: 1, title: 'Community & Location', icon: MapPin, color: 'bg-green-500' },
    { id: 2, title: 'Baptism', icon: Heart, color: 'bg-purple-500' },
    { id: 3, title: 'Confirmation', icon: Calendar, color: 'bg-orange-500' },
    { id: 4, title: 'Marriage & Membership', icon: Users, color: 'bg-pink-500' }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Validation logic (simplified for demo)
    const requiredFields: (keyof typeof formData)[] = ['gender', 'residence', 'baptism', 'confirmation', 'marriage', 'membershipStatus'];
    const emptyFields = requiredFields.filter(field => formData[field] === 'select');
    
    if (emptyFields.length > 0) {
      setError('Please select all required options marked with (*)');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Member saved successfully!');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">First Name *</label>
          <input
            type="text"
            name="jina_first"
            value={formData.jina_first}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Middle Name</label>
          <input
            type="text"
            name="jina_middle"
            value={formData.jina_middle}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter middle name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Last Name *</label>
          <input
            type="text"
            name="jina_last"
            value={formData.jina_last}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value="select">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Date of Birth *</label>
          <input
            type="date"
            name="tarehe_kuzaliwa"
            value={formData.tarehe_kuzaliwa}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter occupation"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Residence Status *</label>
        <select
          name="residence"
          value={formData.residence}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        >
          <option value="select">Select Residence Status</option>
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
        </select>
      </div>
    </div>
  );

  const renderCommunityInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Community *</label>
          <input
            type="text"
            name="jumuiya"
            value={formData.jumuiya}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter community name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Zone *</label>
          <input
            type="text"
            name="kanda"
            value={formData.kanda}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter zone"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Household *</label>
          <input
            type="text"
            name="kaya"
            value={formData.kaya}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter household"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Position in Household *</label>
          <input
            type="text"
            name="nafasi_kaya"
            value={formData.nafasi_kaya}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter position"
            required
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
          name="baptism"
          value={formData.baptism}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          required
        >
          <option value="select">Select Baptismal Status</option>
          <option value="Baptized">Baptized</option>
          <option value="Not Baptized">Not Baptized</option>
        </select>
      </div>

      {formData.baptism === 'Baptized' && (
        <div className="space-y-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="text-lg font-semibold text-purple-800">Baptism Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Baptism Date *</label>
              <input
                type="date"
                name="baptismDate"
                value={formData.baptismDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required={formData.baptism === 'Baptized'}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Baptism Number *</label>
              <input
                type="text"
                name="baptismNumber"
                value={formData.baptismNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter baptism number"
                required={formData.baptism === 'Baptized'}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Church Baptized *</label>
            <input
              type="text"
              name="baptismChurch"
              value={formData.baptismChurch}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter church name"
              required={formData.baptism === 'Baptized'}
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
          name="confirmation"
          value={formData.confirmation}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          required
        >
          <option value="select">Select Confirmation Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Not Confirmed">Not Confirmed</option>
        </select>
      </div>

      {formData.confirmation === 'Confirmed' && (
        <div className="space-y-6 p-6 bg-orange-50 rounded-xl border border-orange-200">
          <h4 className="text-lg font-semibold text-orange-800">Confirmation Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirmation Date *</label>
              <input
                type="date"
                name="confirmationDate"
                value={formData.confirmationDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required={formData.confirmation === 'Confirmed'}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirmation Number *</label>
              <input
                type="text"
                name="confirmationNumber"
                value={formData.confirmationNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter confirmation number"
                required={formData.confirmation === 'Confirmed'}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Church Confirmed *</label>
            <input
              type="text"
              name="confirmationChurch"
              value={formData.confirmationChurch}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter church name"
              required={formData.confirmation === 'Confirmed'}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderMarriageAndMembership = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-pink-800">Marriage Information</h4>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Marital Status *</label>
          <select
            name="marriage"
            value={formData.marriage}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value="select">Select Marital Status</option>
            <option value="Divorced">Divorced</option>
            <option value="Married">Married</option>
            <option value="Not Married">Not Married</option>
            <option value="Separated">Separated</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {['Married', 'Separated'].includes(formData.marriage) && (
          <div className="space-y-6 p-6 bg-pink-50 rounded-xl border border-pink-200">
            <h5 className="text-md font-semibold text-pink-800">Marriage Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Marriage Date *</label>
                <input
                  type="date"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  required={['Married', 'Separated'].includes(formData.marriage)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Marriage Number *</label>
                <input
                  type="text"
                  name="marriageNumber"
                  value={formData.marriageNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter marriage number"
                  required={['Married', 'Separated'].includes(formData.marriage)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Church Married *</label>
              <input
                type="text"
                name="marriageChurch"
                value={formData.marriageChurch}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter church name"
                required={['Married', 'Separated'].includes(formData.marriage)}
              />
            </div>
          </div>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                required={formData.membershipStatus === 'Inactive - Death'}
              />
            </div>
          )}
        </div>
      </div>
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
        return renderMarriageAndMembership();
      default: 
        return renderPersonalInfo();
    }
  };

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

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-h-screen">
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
                  onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
}
