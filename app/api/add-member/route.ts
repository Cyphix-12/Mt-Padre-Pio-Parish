import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Define the expected structure of the request body
interface MemberData {
  name: string;
  gender: string;
  birth_date?: string;
  residence: string;
  phone_no?: string;
  occupation?: string;
  household?: string;
  household_position?: string;
  community?: string;
  zone?: string;
  baptized: string;
  date_baptized?: string;
  baptism_no?: string;
  church_baptized?: string;
  confirmed: string;
  confirmation_date?: string;
  confirmation_no?: string;
  church_confirmed?: string;
  marriage_status: string;
  marriage_date?: string;
  marriage_no?: string;
  church_married?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== ADD MEMBER API ROUTE CALLED ===');

    const authHeader = headers().get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Missing token' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // CRITICAL SESSION CHECK - Validate session before proceeding
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Authentication error - Please sign in again' }, { status: 401 });
    }

    if (!session) {
      console.error('No session found');
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    console.log('Session validated for user:', session.user.email);

    // Parse request body
    let memberData: MemberData;
    try {
      memberData = await request.json();
      console.log('Received member data:', JSON.stringify(memberData, null, 2));
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const requiredFields = ['name', 'gender', 'residence', 'baptized', 'confirmed', 'marriage_status'];
    const missingFields = requiredFields.filter(field =>
      !memberData[field as keyof MemberData] || memberData[field as keyof MemberData] === 'select'
    );

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

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
      console.error('Member creation error:', memberError);
      return NextResponse.json({ error: `Failed to create member: ${memberError.message}` }, { status: 500 });
    }

    const memberId = member.member_id;
    const promises = [];

    // Related Inserts
    if (memberData.community || memberData.zone) {
      promises.push(
        supabase.from('community').insert({
          member_id: memberId,
          community: memberData.community || null,
          zone: memberData.zone || null
        })
      );
    }

    promises.push(
      supabase.from('baptized').insert({
        member_id: memberId,
        baptized: memberData.baptized,
        date_baptized: memberData.date_baptized || null,
        baptism_no: memberData.baptism_no || null,
        church_baptized: memberData.church_baptized || null
      }),

      supabase.from('confirmation').insert({
        member_id: memberId,
        confirmed: memberData.confirmed,
        confirmation_date: memberData.confirmation_date || null,
        confirmation_no: memberData.confirmation_no || null,
        church_confirmed: memberData.church_confirmed || null
      }),

      supabase.from('married').insert({
        member_id: memberId,
        marriage_status: memberData.marriage_status,
        marriage_date: memberData.marriage_date || null,
        marriage_no: memberData.marriage_no || null,
        church_married: memberData.church_married || null
      })
    );

    const results = await Promise.all(promises);

    for (let i = 0; i < results.length; i++) {
      if (results[i].error) {
        console.error(`Related data insertion error at index ${i}:`, results[i].error);
        // Rollback: Delete the member record if related data failed
        await supabase.from('waumini').delete().eq('member_id', memberId);
        return NextResponse.json({
          error: `Failed to create complete member record: ${results[i].error?.message ?? 'Unknown error'}`
        }, { status: 500 });
      }
    }

    console.log('Member created successfully with ID:', memberId);

    return NextResponse.json({
      success: true,
      message: 'Member created successfully',
      member: { ...member, member_id: memberId }
    });

  } catch (error) {
    console.error('Unexpected error in add-member route:', error);
    return NextResponse.json({
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}