import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { X, User, MapPin, Heart, Calendar, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MemberFormProps {
  onClose: () => void;
}

export default function MemberForm({ onClose }: MemberFormProps) {
  const { t } = useLanguage();
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
    { id: 0, title: t('Personal Information'), icon: User, color: 'bg-blue-500' },
    { id: 1, title: t('Community & Location'), icon: MapPin, color: 'bg-green-500' },
    { id: 2, title: t('Baptism'), icon: Heart, color: 'bg-purple-500' },
    { id: 3, title: t('Confirmation'), icon: Calendar, color: 'bg-orange-500' },
    { id: 4, title: t('Marriage & Membership'), icon: Users, color: 'bg-pink-500' }
  ];

  const formatDateForDatabase = (dateString: string) => {
    if (!dateString) return null;
    // Ensure date is in YYYY-MM-DD format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Validate required selections
    const requiredFields = ['gender', 'residence', 'baptism', 'confirmation', 'marriage', 'membershipStatus'];
    const emptyFields = requiredFields.filter( (field) => (formData as Record<string, string>)[field] === 'select');
    
    if (emptyFields.length > 0) {
      setError(t('Please select all required options marked with (*)'));
      setIsSubmitting(false);
      return;
    }

    // Validate conditional requirements
    if (formData.baptism === 'Baptized') {
      if (!formData.baptismDate || !formData.baptismNumber || !formData.baptismChurch) {
        setError(t('Please fill in all baptism details'));
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.confirmation === 'Confirmed') {
      if (!formData.confirmationDate || !formData.confirmationNumber || !formData.confirmationChurch) {
        setError(t('Please fill in all confirmation details'));
        setIsSubmitting(false);
        return;
      }
    }

    if (['Married', 'Separated'].includes(formData.marriage)) {
      if (!formData.marriageDate || !formData.marriageNumber || !formData.marriageChurch) {
        setError(t('Please fill in all marriage details'));
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.membershipStatus === 'Inactive - Death' && !formData.endDate) {
      setError(t('Please specify the date for inactive membership status'));
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare member data with proper formatting
      const memberData = {
        name: `${formData.jina_first} ${formData.jina_middle} ${formData.jina_last}`.trim(),
        gender: formData.gender,
        household: formData.kaya?.trim() || null,
        household_position: formData.nafasi_kaya?.trim() || null,
        birth_date: formatDateForDatabase(formData.tarehe_kuzaliwa),
        phone_no: formData.phone?.trim() || null,
        occupation: formData.occupation?.trim() || null,
        residence: formData.residence
      };

      console.log('Creating member with data:', memberData);

      // Step 1: Create the member record first
      const { data: memberRecord, error: memberError } = await supabase
        .from('waumini')
        .insert([memberData])
        .select()
        .single();

      if (memberError) {
        console.error('Member creation error:', memberError);
        throw new Error(`Failed to create member: ${memberError.message}`);
      }
      if (!memberRecord) throw new Error('Failed to create member record');
      
      const memberId = memberRecord.member_id;
      console.log('Member created with ID:', memberId);
      
      // Step 2: Create the community record
      const communityData = {
        member_id: memberId,
        community: formData.jumuiya?.trim() || null,
        zone: formData.kanda?.trim() || null,
        end_of_parish_membership: formData.membershipStatus === 'Inactive - Death' ? formatDateForDatabase(formData.endDate) : null,
        date_of_death: formData.membershipStatus === 'Inactive - Death' ? formatDateForDatabase(formData.endDate) : null
      };

      const { error: communityError } = await supabase
        .from('community')
        .insert([communityData]);

      if (communityError) {
        console.error('Community creation error:', communityError);
        throw new Error(`Failed to create community record: ${communityError.message}`);
      }

      // Step 3: Create baptism record
      const baptismData = {
        member_id: memberId,
        baptized: formData.baptism === 'Baptized' ? 'Yes' : 'No',
        date_baptized: formData.baptism === 'Baptized' ? formatDateForDatabase(formData.baptismDate) : null,
        church_baptized: formData.baptism === 'Baptized' ? formData.baptismChurch?.trim() : null,
        baptism_no: formData.baptism === 'Baptized' ? formData.baptismNumber?.trim() : null
      };

      const { error: baptismError } = await supabase
        .from('baptized')
        .insert([baptismData]);
      
      if (baptismError) {
        console.error('Baptism creation error:', baptismError);
        throw new Error(`Failed to create baptism record: ${baptismError.message}`);
      }

      // Step 4: Create confirmation record
      const confirmationData = {
        member_id: memberId,
        confirmed: formData.confirmation === 'Confirmed' ? 'Yes' : 'No',
        confirmation_date: formData.confirmation === 'Confirmed' ? formatDateForDatabase(formData.confirmationDate) : null,
        church_confirmed: formData.confirmation === 'Confirmed' ? formData.confirmationChurch?.trim() : null,
        confirmation_no: formData.confirmation === 'Confirmed' ? formData.confirmationNumber?.trim() : null
      };

      const { error: confirmationError } = await supabase
        .from('confirmation')
        .insert([confirmationData]);
      
      if (confirmationError) {
        console.error('Confirmation creation error:', confirmationError);
        throw new Error(`Failed to create confirmation record: ${confirmationError.message}`);
      }

      // Step 5: Create marriage record
      const marriageData = {
        member_id: memberId,
        marriage_status: formData.marriage,
        marriage_date: ['Married', 'Separated'].includes(formData.marriage) ? formatDateForDatabase(formData.marriageDate) : null,
        church_married: ['Married', 'Separated'].includes(formData.marriage) ? formData.marriageChurch?.trim() : null,
        marriage_no: ['Married', 'Separated'].includes(formData.marriage) ? formData.marriageNumber?.trim() : null
      };

      const { error: marriageError } = await supabase
        .from('married')
        .insert([marriageData]);
      
      if (marriageError) {
        console.error('Marriage creation error:', marriageError);
        throw new Error(`Failed to create marriage record: ${marriageError.message}`);
      }

      console.log('Member and all related records created successfully');
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

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('First Name')} *</label>
          <input
            type="text"
            name="jina_first"
            value={formData.jina_first}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter first name')}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('Middle Name')}</label>
          <input
            type="text"
            name="jina_middle"
            value={formData.jina_middle}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter middle name')}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('Last Name')} *</label>
          <input
            type="text"
            name="jina_last"
            value={formData.jina_last}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter last name')}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('gender')} *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            required
          >
            <option value="select">{t('Select Gender')}</option>
            <option value="Male">{t('male')}</option>
            <option value="Female">{t('female')}</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('Date of Birth')} *</label>
          <input
            type="date"
            name="tarehe_kuzaliwa"
            value={formData.tarehe_kuzaliwa}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('Phone Number')}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter phone number')}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('Occupation')}</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter occupation')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">{t('Residence Status')} *</label>
        <select
          name="residence"
          value={formData.residence}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
          required
        >
          <option value="select">{t('Select Residence Status')}</option>
          <option value="Permanent">{t('permanent')}</option>
          <option value="Temporary">{t('temporary')}</option>
        </select>
      </div>
    </div>
  );

  const renderCommunityInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('community')} *</label>
          <input
            type="text"
            name="jumuiya"
            value={formData.jumuiya}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder={t('Enter community name')}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('zone')} *</label>
          <input
            type="text"
            name="kanda"
            value={formData.kanda}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter zone')}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('household')} *</label>
          <input
            type="text"
            name="kaya"
            value={formData.kaya}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter household name/ID')}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('Position in Household')} *</label>
          <input
            type="text"
            name="nafasi_kaya"
            value={formData.nafasi_kaya}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder={t('Enter position')}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderBaptismInfo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">{t('Baptism Status')} *</label>
        <select
          name="baptism"
          value={formData.baptism}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
          required
        >
          <option value="select">{t('Select Status')}</option>
          <option value="Baptized">{t('baptized')}</option>
          <option value="Not Baptized">Not {t('baptized')}</option>
        </select>
      </div>

      {formData.baptism === 'Baptized' && (
        <div className="space-y-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="text-lg font-semibold text-purple-800">{t('baptismInformation')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t('Baptism Date')} *</label>
              <input
                type="date"
                name="baptismDate"
                value={formData.baptismDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
                required={formData.baptism === 'Baptized'}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t('baptismNumber')} *</label>
              <input
                type="text"
                name="baptismNumber"
                value={formData.baptismNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder={t('Certificate #')}
                required={formData.baptism === 'Baptized'}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">{t('churchBaptized')} *</label>
            <input
              type="text"
              name="baptismChurch"
              value={formData.baptismChurch}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700"
              placeholder={t('Church name')}
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
        <label className="block text-sm font-semibold text-gray-700">{t('Confirmation Status')} *</label>
        <select
          name="confirmation"
          value={formData.confirmation}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
          required
        >
          <option value="select">{t('Select Status')}</option>
          <option value="Confirmed">{t('confirmed')}</option>
          <option value="Not Confirmed">Not {t('confirmed')}</option>
        </select>
      </div>

      {formData.confirmation === 'Confirmed' && (
        <div className="space-y-6 p-6 bg-orange-50 rounded-xl border border-orange-200">
          <h4 className="text-lg font-semibold text-orange-800">{t('confirmationInformation')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t('Confirmation Date')} *</label>
              <input
                type="date"
                name="confirmationDate"
                value={formData.confirmationDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                required={formData.confirmation === 'Confirmed'}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t('confirmationNumber')} *</label>
              <input
                type="text"
                name="confirmationNumber"
                value={formData.confirmationNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder={t('Certificate #')}
                required={formData.confirmation === 'Confirmed'}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">{t('churchConfirmed')} *</label>
            <input
              type="text"
              name="confirmationChurch"
              value={formData.confirmationChurch}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
              placeholder={t('Church name')}
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
        <h4 className="text-lg font-semibold text-pink-800">{t('marriageInformation')}</h4>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">{t('Marital Status')} *</label>
          <select
            name="marriage"
            value={formData.marriage}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
            required
          >
            <option value="select">{t('Select Marital Status')}</option>
            <option value="Divorced">{t('divorced')}</option>
            <option value="Married">{t('married')}</option>
            <option value="Not Married">{t('notMarried')}</option>
            <option value="Separated">{t('separated')}</option>
            <option value="Widowed">{t('widowed')}</option>
          </select>
        </div>

        {['Married', 'Separated'].includes(formData.marriage) && (
          <div className="space-y-6 p-6 bg-pink-50 rounded-xl border border-pink-200">
            <h5 className="text-md font-semibold text-pink-800">{t('marriageInformation')}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('Marriage Date')} *</label>
                <input
                  type="date"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  required={['Married', 'Separated'].includes(formData.marriage)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('marriageNumber')} *</label>
                <input
                  type="text"
                  name="marriageNumber"
                  value={formData.marriageNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  placeholder={t('Certificate #')}
                  required={['Married', 'Separated'].includes(formData.marriage)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t('churchMarried')} *</label>
              <input
                type="text"
                name="marriageChurch"
                value={formData.marriageChurch}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder={t('Church name')}
                required={['Married', 'Separated'].includes(formData.marriage)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-pink-800">{t('membershipStatus')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">{t('Membership Status')} *</label>
            <select
              name="membershipStatus"
              value={formData.membershipStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
              required
            >
              <option value="select">{t('Select Membership Status')}</option>
              <option value="Active">{t('active')}</option>
              <option value="Inactive - Death">{t('Inactive - Death')}</option>
              <option value="Inactive - Moved">{t('Inactive - Moved')}</option>
            </select>
          </div>
          {formData.membershipStatus === 'Inactive - Death' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t('Date')} *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
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
              <h2 className="text-xl font-bold text-white">{t('memberInformation')}</h2>
              <p className="text-slate-300 text-sm mt-1">{t('Complete all sections')}</p>
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
            <div className="text-slate-300 text-xs mb-2">{t('Progress')}</div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-slate-400 text-xs mt-2">
              {activeSection + 1} of {sections.length} {t('sections')}
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
              {t('Previous')}
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                {t('Cancel')}
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
                  {isSubmitting ? t('saving') : t('Save Member')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {t('Next')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}