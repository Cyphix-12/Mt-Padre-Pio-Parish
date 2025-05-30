import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Admin client with service role key
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Get the CSRF token from headers
    const csrfToken = req.headers.get('x-csrf-token');
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ') || !csrfToken) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token matches CSRF token
    if (token.slice(-8) !== csrfToken) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: 'Please sign in to continue' }, { status: 401 });
    }

    // Verify admin role using user_with_role view
    const { data: roleData, error: roleError } = await supabase
      .from('user_with_role') 
      .select('role_name, role_permissions')
      .eq('user_id', session.user.id)
      .single();

    if (roleError) {
      console.error('Error fetching role:', roleError);
      return NextResponse.json({ error: 'Error verifying permissions' }, { status: 500 });
    }

    const isAdmin = roleData?.role_name === 'Admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 }); 
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { error } = await adminClient.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}