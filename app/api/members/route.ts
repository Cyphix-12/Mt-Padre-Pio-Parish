import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberData = await request.json();

    // Validate required fields
    if (!memberData.name || !memberData.gender || !memberData.residence || 
        !memberData.baptized || !memberData.confirmed || !memberData.marriage_status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Start transaction by creating the main member record
    const { data: member, error: memberError } = await supabase
      .from('waumini')
      .insert({
        name: memberData.name,
        gender: memberData.gender,
        birth_date: memberData.birth_date || null,
        residence: memberData.residence,
        phone_no: memberData.phone_no || null,
        occupation: memberData.occupation || null,
        household: memberData.household || null,
        household_position: memberData.household_position || null
      })
      .select()
      .single();

    if (memberError) {
      console.error('Error creating member:', memberError);
      return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
    }

    const memberId = member.member_id;

    // Insert related records
    const promises = [];

    // Community information
    if (memberData.community || memberData.zone) {
      promises.push(
        supabase.from('community').insert({
          member_id: memberId,
          community: memberData.community || null,
          zone: memberData.zone || null
        })
      );
    }

    // Baptism information
    promises.push(
      supabase.from('baptized').insert({
        member_id: memberId,
        baptized: memberData.baptized,
        date_baptized: memberData.date_baptized || null,
        baptism_no: memberData.baptism_no || null,
        church_baptized: memberData.church_baptized || null
      })
    );

    // Confirmation information
    promises.push(
      supabase.from('confirmation').insert({
        member_id: memberId,
        confirmed: memberData.confirmed,
        confirmation_date: memberData.confirmation_date || null,
        confirmation_no: memberData.confirmation_no || null,
        church_confirmed: memberData.church_confirmed || null
      })
    );

    // Marriage information
    promises.push(
      supabase.from('married').insert({
        member_id: memberId,
        marriage_status: memberData.marriage_status,
        marriage_date: memberData.marriage_date || null,
        marriage_no: memberData.marriage_no || null,
        church_married: memberData.church_married || null
      })
    );

    // Execute all related inserts
    const results = await Promise.all(promises);
    
    // Check for errors in any of the related inserts
    for (const result of results) {
      if (result.error) {
        console.error('Error inserting related data:', result.error);
        // Clean up the member record if related data failed
        await supabase.from('waumini').delete().eq('member_id', memberId);
        return NextResponse.json({ error: 'Failed to create complete member record' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      member: { ...member, member_id: memberId }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}