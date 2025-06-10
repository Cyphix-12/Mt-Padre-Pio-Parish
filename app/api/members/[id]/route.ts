import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberId = params.id;
    const memberData = await request.json();

    // Validate required fields
    if (!memberData.name || !memberData.gender || !memberData.residence || 
        !memberData.baptized || !memberData.confirmed || !memberData.marriage_status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update main member record
    const { error: memberError } = await supabase
      .from('waumini')
      .update({
        name: memberData.name,
        gender: memberData.gender,
        birth_date: memberData.birth_date || null,
        residence: memberData.residence,
        phone_no: memberData.phone_no || null,
        occupation: memberData.occupation || null,
        household: memberData.household || null,
        household_position: memberData.household_position || null
      })
      .eq('member_id', memberId);

    if (memberError) {
      console.error('Error updating member:', memberError);
      return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }

    // Update related records using upsert
    const promises = [];

    // Community information
    promises.push(
      supabase.from('community').upsert({
        member_id: memberId,
        community: memberData.community || null,
        zone: memberData.zone || null
      }, {
        onConflict: 'member_id'
      })
    );

    // Baptism information
    promises.push(
      supabase.from('baptized').upsert({
        member_id: memberId,
        baptized: memberData.baptized,
        date_baptized: memberData.date_baptized || null,
        baptism_no: memberData.baptism_no || null,
        church_baptized: memberData.church_baptized || null
      }, {
        onConflict: 'member_id'
      })
    );

    // Confirmation information
    promises.push(
      supabase.from('confirmation').upsert({
        member_id: memberId,
        confirmed: memberData.confirmed,
        confirmation_date: memberData.confirmation_date || null,
        confirmation_no: memberData.confirmation_no || null,
        church_confirmed: memberData.church_confirmed || null
      }, {
        onConflict: 'member_id'
      })
    );

    // Marriage information
    promises.push(
      supabase.from('married').upsert({
        member_id: memberId,
        marriage_status: memberData.marriage_status,
        marriage_date: memberData.marriage_date || null,
        marriage_no: memberData.marriage_no || null,
        church_married: memberData.church_married || null
      }, {
        onConflict: 'member_id'
      })
    );

    // Execute all updates
    const results = await Promise.all(promises);
    
    // Check for errors
    for (const result of results) {
      if (result.error) {
        console.error('Error updating related data:', result.error);
        return NextResponse.json({ error: 'Failed to update complete member record' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}