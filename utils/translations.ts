export interface Translations {
  [key: string]: {
    en: string;
    sw: string;
  };
}

export const translations: Translations = {
  // Navigation
  Dashboard: { en: 'Dashboard', sw: 'Dashibodi' },
  Report: { en: 'Report', sw: 'Ripoti' },
  Leaders: { en: 'Leaders', sw: 'Viongozi' },
  'Zone & Community': { en: 'Zone & Community', sw: 'Kanda na Jumuiya' },
  Settings: { en: 'Settings', sw: 'Mipangilio' },

  // Parish info
  'Parokia ya': { en: 'Parish of', sw: 'Parokia ya' },
  'Mt. Padre Pio': { en: 'Mt. Padre Pio', sw: 'Mt. Padre Pio' },
  parishName: { en: 'Mt. Padre Pio Parish', sw: 'Parokia ya Mt. Padre Pio' },
  'System Online': { en: 'System Online', sw: 'Mfumo Unaendesha' },

  // Common terms
  name: { en: 'Name', sw: 'Jina' },
  gender: { en: 'Gender', sw: 'Jinsia' },
  male: { en: 'Male', sw: 'Mwanaume' },
  female: { en: 'Female', sw: 'Mwanamke' },
  dateOfBirth: { en: 'Date of Birth', sw: 'Tarehe ya Kuzaliwa' },
  phoneNumber: { en: 'Phone Number', sw: 'Nambari ya Simu' },
  occupation: { en: 'Occupation', sw: 'Kazi' },
  residence: { en: 'Residence', sw: 'Makazi' },
  permanent: { en: 'Permanent', sw: 'Ya Kudumu' },
  temporary: { en: 'Temporary', sw: 'Ya Muda' },

  // Church terms
  community: { en: 'Community', sw: 'Jumuiya' },
  zone: { en: 'Zone', sw: 'Kanda' },
  household: { en: 'Household', sw: 'Kaya' },
  householdPosition: { en: 'Position in Household', sw: 'Nafasi katika Kaya' },

  // Sacraments
  baptism: { en: 'Baptism', sw: 'Ubatizo' },
  baptized: { en: 'Baptized', sw: 'Amebatizwa' },
  baptismDate: { en: 'Baptism Date', sw: 'Tarehe ya Ubatizo' },
  baptismNumber: { en: 'Baptism Number', sw: 'Nambari ya Ubatizo' },
  churchBaptized: { en: 'Church Baptized', sw: 'Kanisa la Ubatizo' },

  confirmation: { en: 'Confirmation', sw: 'Uthibitisho' },
  confirmed: { en: 'Confirmed', sw: 'Amethibitishwa' },
  confirmationDate: { en: 'Confirmation Date', sw: 'Tarehe ya Uthibitisho' },
  confirmationNumber: { en: 'Confirmation Number', sw: 'Nambari ya Uthibitisho' },
  churchConfirmed: { en: 'Church Confirmed', sw: 'Kanisa la Uthibitisho' },

  marriage: { en: 'Marriage', sw: 'Ndoa' },
  marriageStatus: { en: 'Marriage Status', sw: 'Hali ya Ndoa' },
  married: { en: 'Married', sw: 'Ameoa/Ameolewa' },
  notMarried: { en: 'Not Married', sw: 'Hajaoa/Hajaolewa' },
  divorced: { en: 'Divorced', sw: 'Ametalakiana' },
  widowed: { en: 'Widowed', sw: 'Mjane' },
  separated: { en: 'Separated', sw: 'Wametenganishwa' },
  marriageDate: { en: 'Marriage Date', sw: 'Tarehe ya Ndoa' },
  marriageNumber: { en: 'Marriage Number', sw: 'Nambari ya Ndoa' },
  churchMarried: { en: 'Church Married', sw: 'Kanisa la Ndoa' },

  // Status
  yes: { en: 'Yes', sw: 'Ndio' },
  no: { en: 'No', sw: 'Hapana' },
  active: { en: 'Active', sw: 'Hai' },
  inactive: { en: 'Inactive', sw: 'Haikai' },

  // Actions
  save: { en: 'Save', sw: 'Hifadhi' },
  cancel: { en: 'Cancel', sw: 'Ghairi' },
  edit: { en: 'Edit', sw: 'Hariri' },
  delete: { en: 'Delete', sw: 'Futa' },
  add: { en: 'Add', sw: 'Ongeza' },
  search: { en: 'Search', sw: 'Tafuta' },
  filter: { en: 'Filter', sw: 'Chuja' },
  'Search Filter': { en: 'Search Filter', sw: 'Chuja Utafutaji' },
  'Add Column': { en: 'Add Column', sw: 'Ongeza Safu' },
  'Add Leader': { en: 'Add Leader', sw: 'Ongeza Kiongozi' },
  'Add Member': { en: 'Add Member', sw: 'Ongeza Mwanachama' },
  'Create Report': { en: 'Create Report', sw: 'Tengeneza Ripoti' },

  // Form labels
  required: { en: 'Required', sw: 'Inahitajika' },
  optional: { en: 'Optional', sw: 'Si lazima' },
  selectGender: { en: 'Select Gender', sw: 'Chagua Jinsia' },
  selectResidence: { en: 'Select Residence', sw: 'Chagua Makazi' },
  selectStatus: { en: 'Select Status', sw: 'Chagua Hali' },

  // Messages
  loading: { en: 'Loading...', sw: 'Inapakia...' },
  'Loading members...': { en: 'Loading members...', sw: 'Inapakia wanachama...' },
  saving: { en: 'Saving...', sw: 'Inahifadhi...' },
  success: { en: 'Success', sw: 'Imefanikiwa' },
  error: { en: 'Error', sw: 'Hitilafu' },
  noDataFound: { en: 'No data found', sw: 'Hakuna data iliyopatikana' },
  'No members found': { en: 'No members found', sw: 'Hakuna wanachama waliopatikana' },
  'Try adjusting your search criteria or filters.': { 
    en: 'Try adjusting your search criteria or filters.', 
    sw: 'Jaribu kubadilisha vigezo vya utafutaji au vichujio.' 
  },

  // Parish specific
  membershipStatus: { en: 'Membership Status', sw: 'Hali ya Uanachama' },
  memberInformation: { en: 'Member Information', sw: 'Taarifa za Mwanachama' },
  basicInformation: { en: 'Basic Information', sw: 'Taarifa za Msingi' },
  householdInformation: { en: 'Household Information', sw: 'Taarifa za Kaya' },
  communityInformation: { en: 'Community Information', sw: 'Taarifa za Jumuiya' },
  baptismInformation: { en: 'Baptism Information', sw: 'Taarifa za Ubatizo' },
  confirmationInformation: { en: 'Confirmation Information', sw: 'Taarifa za Uthibitisho' },
  marriageInformation: { en: 'Marriage Information', sw: 'Taarifa za Ndoa' },

  // Validation messages
  nameRequired: { en: 'Name is required', sw: 'Jina linahitajika' },
  genderRequired: { en: 'Gender is required', sw: 'Jinsia inahitajika' },
  residenceRequired: { en: 'Residence is required', sw: 'Makazi yanahitajika' },
  baptismStatusRequired: { en: 'Baptism status is required', sw: 'Hali ya ubatizo inahitajika' },
  confirmationStatusRequired: { en: 'Confirmation status is required', sw: 'Hali ya uthibitisho inahitajika' },
  marriageStatusRequired: { en: 'Marriage status is required', sw: 'Hali ya ndoa inahitajika' },

  // Header messages
  editMemberInformation: { en: 'Edit Member Information', sw: 'Hariri Taarifa za Mwanachama' },
  updateMemberDetails: { en: 'Update member details and church records', sw: 'Sasisha taarifa za mwanachama na rekodi za kanisa' },
  loadingMemberData: { en: 'Loading Member Data', sw: 'Inapakia Taarifa za Mwanachama' },
  fetchingMemberInfo: { en: 'Fetching member information...', sw: 'Inapata taarifa za mwanachama...' },
  failedToLoadData: { en: 'Failed to Load Member Data', sw: 'Imeshindwa Kupakia Taarifa za Mwanachama' },
  retry: { en: 'Retry', sw: 'Jaribu Tena' },
  saveChanges: { en: 'Save Changes', sw: 'Hifadhi Mabadiliko' },

  // Table headers
  'No.': { en: 'No.', sw: 'Na.' },
  'Jina': { en: 'Name', sw: 'Jina' },
  'Jinsia': { en: 'Gender', sw: 'Jinsia' },
  'Jumuiya': { en: 'Community', sw: 'Jumuiya' },
  'Kanda': { en: 'Zone', sw: 'Kanda' },
  'Nafasi': { en: 'Position', sw: 'Nafasi' },

  // Search and filter
  'Search members by name...': { en: 'Search members by name...', sw: 'Tafuta wanachama kwa jina...' },
  'Filters': { en: 'Filters', sw: 'Vichujio' },
  'Apply Filters': { en: 'Apply Filters', sw: 'Tumia Vichujio' },

  // Stats
  'Zones': { en: 'Zones', sw: 'Kanda' },
  'Communities': { en: 'Communities', sw: 'Jumuiya' },
  'Members': { en: 'Members', sw: 'Wanachama' },

  // Additional form fields
  'Full Name': { en: 'Full Name', sw: 'Jina Kamili' },
  'First Name': { en: 'First Name', sw: 'Jina la Kwanza' },
  'Middle Name': { en: 'Middle Name', sw: 'Jina la Kati' },
  'Last Name': { en: 'Last Name', sw: 'Jina la Mwisho' },
  'Date of Birth': { en: 'Date of Birth', sw: 'Tarehe ya Kuzaliwa' },
  'Phone Number': { en: 'Phone Number', sw: 'Nambari ya Simu' },
  'Occupation': { en: 'Occupation', sw: 'Kazi' },
  'Residence Status': { en: 'Residence Status', sw: 'Hali ya Makazi' },
  'Position in Household': { en: 'Position in Household', sw: 'Nafasi katika Kaya' },
  'Baptism Status': { en: 'Baptism Status', sw: 'Hali ya Ubatizo' },
  'Baptism Date': { en: 'Baptism Date', sw: 'Tarehe ya Ubatizo' },
  'Certificate Number': { en: 'Certificate Number', sw: 'Nambari ya Cheti' },
  'Church Baptized': { en: 'Church Baptized', sw: 'Kanisa la Ubatizo' },
  'Confirmation Status': { en: 'Confirmation Status', sw: 'Hali ya Uthibitisho' },
  'Confirmation Date': { en: 'Confirmation Date', sw: 'Tarehe ya Uthibitisho' },
  'Church Confirmed': { en: 'Church Confirmed', sw: 'Kanisa la Uthibitisho' },
  'Marital Status': { en: 'Marital Status', sw: 'Hali ya Ndoa' },
  'Marriage Date': { en: 'Marriage Date', sw: 'Tarehe ya Ndoa' },
  'Church Married': { en: 'Church Married', sw: 'Kanisa la Ndoa' },
  'Membership Status': { en: 'Membership Status', sw: 'Hali ya Uanachama' },

  // Placeholders
  'Enter full name': { en: 'Enter full name', sw: 'Ingiza jina kamili' },
  'Enter first name': { en: 'Enter first name', sw: 'Ingiza jina la kwanza' },
  'Enter middle name': { en: 'Enter middle name', sw: 'Ingiza jina la kati' },
  'Enter last name': { en: 'Enter last name', sw: 'Ingiza jina la mwisho' },
  'Enter phone number': { en: 'Enter phone number', sw: 'Ingiza nambari ya simu' },
  'Enter occupation': { en: 'Enter occupation', sw: 'Ingiza kazi' },
  'Enter household name/ID': { en: 'Enter household name/ID', sw: 'Ingiza jina/kitambulisho cha kaya' },
  'Enter position': { en: 'Enter position', sw: 'Ingiza nafasi' },
  'Enter community name': { en: 'Enter community name', sw: 'Ingiza jina la jumuiya' },
  'Enter zone': { en: 'Enter zone', sw: 'Ingiza kanda' },
  'Certificate #': { en: 'Certificate #', sw: 'Cheti Na.' },
  'Church name': { en: 'Church name', sw: 'Jina la kanisa' },

  // Select options
  'Select Gender': { en: 'Select Gender', sw: 'Chagua Jinsia' },
  'Select Residence Status': { en: 'Select Residence Status', sw: 'Chagua Hali ya Makazi' },
  'Select Status': { en: 'Select Status', sw: 'Chagua Hali' },
  'Select Marital Status': { en: 'Select Marital Status', sw: 'Chagua Hali ya Ndoa' },
  'Select Membership Status': { en: 'Select Membership Status', sw: 'Chagua Hali ya Uanachama' },

  // Marriage status options
  'Not Married': { en: 'Not Married', sw: 'Hajaoa/Hajaolewa' },
  'Married': { en: 'Married', sw: 'Ameoa/Ameolewa' },
  'Divorced': { en: 'Divorced', sw: 'Ametalakiana' },
  'Widowed': { en: 'Widowed', sw: 'Mjane' },
  'Separated': { en: 'Separated', sw: 'Wametenganishwa' },

  // Membership status options
  'Active': { en: 'Active', sw: 'Hai' },
  'Inactive - Death': { en: 'Inactive - Death', sw: 'Haikai - Kifo' },
  'Inactive - Moved': { en: 'Inactive - Moved', sw: 'Haikai - Amehamia' },

  // Buttons
  'Previous': { en: 'Previous', sw: 'Iliyotangulia' },
  'Next': { en: 'Next', sw: 'Ifuatayo' },
  'Save Member': { en: 'Save Member', sw: 'Hifadhi Mwanachama' },
  'Cancel': { en: 'Cancel', sw: 'Ghairi' },
  'Save Changes': { en: 'Save Changes', sw: 'Hifadhi Mabadiliko' },

  // Form sections
  'Personal Information': { en: 'Personal Information', sw: 'Taarifa za Kibinafsi' },
  'Community & Location': { en: 'Community & Location', sw: 'Jumuiya na Mahali' },
  'Baptism': { en: 'Baptism', sw: 'Ubatizo' },
  'Confirmation': { en: 'Confirmation', sw: 'Uthibitisho' },
  'Marriage & Membership': { en: 'Marriage & Membership', sw: 'Ndoa na Uanachama' },

  // Progress
  'Complete all sections': { en: 'Complete all sections', sw: 'Kamilisha sehemu zote' },
  'sections': { en: 'sections', sw: 'sehemu' },
  'Progress': { en: 'Progress', sw: 'Maendeleo' },

  // Error messages
  'Please fill in all baptism details': { en: 'Please fill in all baptism details', sw: 'Tafadhali jaza maelezo yote ya ubatizo' },
  'Please fill in all confirmation details': { en: 'Please fill in all confirmation details', sw: 'Tafadhali jaza maelezo yote ya uthibitisho' },
  'Please fill in all marriage details': { en: 'Please fill in all marriage details', sw: 'Tafadhali jaza maelezo yote ya ndoa' },
  'Please specify the date for inactive membership status': { en: 'Please specify the date for inactive membership status', sw: 'Tafadhali bainisha tarehe ya hali ya uanachama usioendelea' },
  'Please select all required options marked with (*)': { en: 'Please select all required options marked with (*)', sw: 'Tafadhali chagua chaguzi zote zinazohitajika zilizo na alama ya (*)' },

  // Date field
  'Date': { en: 'Date', sw: 'Tarehe' }
};

export function getTranslation(key: string, language: 'en' | 'sw' = 'en'): string {
  return translations[key]?.[language] || key;
}