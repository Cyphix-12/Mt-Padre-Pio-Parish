import { supabase } from './supabase';

interface MemberUpdateData {
  memberId: string;
  communityInfo?: {
    community: string;
    zone: string;
    endMembership: string | null;
    dateOfDeath: string | null;
  };
  baptismInfo?: {
    baptized: 'Yes' | 'No';
    dateBaptized: string | null;
    churchBaptized: string | null;
    baptismNo: string | null;
  };
  confirmationInfo?: {
    confirmed: 'Yes' | 'No';
    confirmationDate: string | null;
    churchConfirmed: string | null;
    confirmationNo: string | null;
  };
  marriageInfo?: {
    marriageStatus: 'Separated' | 'Married' | 'Widowed' | 'Divorced' | 'Not Married';
    marriageDate: string | null;
    churchMarried: string | null;
    marriageNo: string | null;
  };
}

export async function updateMemberData(data: MemberUpdateData): Promise<{ error: Error | null }> {
  try {
    // Ensure member exists in 'waumini' table
    const { error: memberError } = await supabase
      .from('waumini')
      .select('member_id')
      .eq('member_id', data.memberId)
      .single();

    if (memberError) throw new Error('Member not found');

    // Update baptism info
    if (data.baptismInfo) {
      const { error: baptismError } = await supabase
        .from('baptized')
        .upsert({
          member_id: data.memberId,
          baptized: data.baptismInfo.baptized,
          date_baptized: data.baptismInfo.dateBaptized,
          church_baptized: data.baptismInfo.churchBaptized,
          baptism_no: data.baptismInfo.baptismNo
        }, {
          onConflict: 'member_id'
        });

      if (baptismError) throw baptismError;
    }

    // Update confirmation info
    if (data.confirmationInfo) {
      const { error: confirmationError } = await supabase
        .from('confirmation')
        .upsert({
          member_id: data.memberId,
          confirmed: data.confirmationInfo.confirmed,
          confirmation_date: data.confirmationInfo.confirmationDate,
          church_comfirmed: data.confirmationInfo.churchConfirmed,
          confirmation_no: data.confirmationInfo.confirmationNo
        }, {
          onConflict: 'member_id'
        });

      if (confirmationError) throw confirmationError;
    }

    // Update marriage info
    if (data.marriageInfo) {
      const { error: marriageError } = await supabase
        .from('married')
        .upsert({
          member_id: data.memberId,
          marriage_status: data.marriageInfo.marriageStatus,
          marriage_date: data.marriageInfo.marriageDate,
          church_married: data.marriageInfo.churchMarried,
          marriage_no: data.marriageInfo.marriageNo
        }, {
          onConflict: 'member_id'
        });

      if (marriageError) throw marriageError;
    }

    // Update community info
    if (data.communityInfo) {
      const { error: communityError } = await supabase
        .from('community')
        .upsert({
          member_id: data.memberId,
          community: data.communityInfo.community,
          zone: data.communityInfo.zone,
          end_of_parish_membership: data.communityInfo.endMembership,
          date_of_death: data.communityInfo.dateOfDeath
        }, {
          onConflict: 'member_id'
        });

      if (communityError) throw communityError;
    }

    return { error: null };
  } catch (error: unknown) {
    console.error('Error updating member data:', error);
    const message = error instanceof Error
      ? error.message
      : 'An unknown error occurred while updating member data';
    return { error: new Error(message) };
  }
}
