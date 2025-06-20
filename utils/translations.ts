export interface Translations {
  [key: string]: {
    en: string;
    sw: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', sw: 'Dashibodi' },
  report: { en: 'Report', sw: 'Ripoti' },
  leaders: { en: 'Leaders', sw: 'Viongozi' },
  zoneAndCommunity: { en: 'Zone & Community', sw: 'Kanda na Jumuiya' },
  settings: { en: 'Settings', sw: 'Mipangilio' },

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

  // Form labels
  required: { en: 'Required', sw: 'Inahitajika' },
  optional: { en: 'Optional', sw: 'Si lazima' },
  selectGender: { en: 'Select Gender', sw: 'Chagua Jinsia' },
  selectResidence: { en: 'Select Residence', sw: 'Chagua Makazi' },
  selectStatus: { en: 'Select Status', sw: 'Chagua Hali' },

  // Messages
  loading: { en: 'Loading...', sw: 'Inapakia...' },
  saving: { en: 'Saving...', sw: 'Inahifadhi...' },
  success: { en: 'Success', sw: 'Imefanikiwa' },
  error: { en: 'Error', sw: 'Hitilafu' },
  noDataFound: { en: 'No data found', sw: 'Hakuna data iliyopatikana' },

  // Parish specific
  parishName: { en: 'Mt. Padre Pio Parish', sw: 'Parokia ya Mt. Padre Pio' },
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
  saveChanges: { en: 'Save Changes', sw: 'Hifadhi Mabadiliko' }
};

export function getTranslation(key: string, language: 'en' | 'sw' = 'en'): string {
  return translations[key]?.[language] || key;
}
