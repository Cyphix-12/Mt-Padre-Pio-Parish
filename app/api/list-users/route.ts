import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Admin client (with service role key)
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Lightweight client for verifying access token (no service key)
const publicClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // You must have this in your .env
);

export async function GET() {
  try {
    console.log('Handling GET /api/list-users');

    const headersList = headers();
    const authHeader = headersList.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Validate user token with anon key client
    const {
      data: { user },
      error: sessionError
    } = await publicClient.auth.getUser(token);

    if (sessionError || !user) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Now safely fetch users with admin client
    const { data, error: adminError } = await adminClient.auth.admin.listUsers();

    if (adminError) {
      console.error('Admin fetch error:', adminError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    const sanitizedUsers = data.users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      user_metadata: u.user_metadata,
      last_sign_in_at: u.last_sign_in_at
    }));

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
