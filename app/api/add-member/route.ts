import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('=== ADD MEMBER API ROUTE CALLED ===');
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }

    if (!session) {
      console.error('No session found');
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    console.log('User authenticated:', session.user.email);

    // Parse request body
    let memberData;
    try {
      memberData = await request.json();
      console.log('Received member data:', JSON.stringify(memberData, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = ['name', 'gender', 'residence', 'baptized', 'confirmed', 'marriage_status'];
    const missingFields = requiredFields.filter(field => !memberData[field] || memberData[field] === 'select');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    console.log('All required fields present, proceeding with database insertion...');

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
      return NextResponse.json({ 
        error: `Failed to create member: ${memberError.message}` 
      }, { status: 500 });
    }

    console.log('Member created successfully:', member);
    const memberId = member.member_id;

    // Insert related records
    const promises = [];

    // Community information
    if (memberData.community || memberData.zone) {
      console.log('Inserting community data...');
      promises.push(
        supabase.from('community').insert({
          member_id: memberId,
          community: memberData.community || null,
          zone: memberData.zone || null
        })
      );
    }

    // Baptism information
    console.log('Inserting baptism data...');
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
    console.log('Inserting confirmation data...');
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
    console.log('Inserting marriage data...');
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
    console.log('Executing all related data inserts...');
    const results = await Promise.all(promises);
    
    // Check for errors in any of the related inserts
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.error) {
        console.error(`Error inserting related data (index ${i}):`, result.error);
        
        // Clean up the member record if related data failed
        console.log('Cleaning up member record due to related data failure...');
        await supabase.from('waumini').delete().eq('member_id', memberId);
        
        return NextResponse.json({ 
          error: `Failed to create complete member record: ${result.error.message}` 
        }, { status: 500 });
      }
    }

    console.log('All data inserted successfully!');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Member created successfully',
      member: { ...member, member_id: memberId }
    });

  } catch (error) {
    console.error('Unexpected error in add-member API:', error);
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}