import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Admin client with service role key
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, roleId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete existing roles first
    const { error: deleteError } = await adminClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing roles:', deleteError);
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      );
    }

    // Add new role if one is provided
    if (roleId) {
      const { error: insertError } = await adminClient
        .from('user_roles')
        .insert({ user_id: userId, role_id: roleId });

      if (insertError) {
        console.error('Error inserting new role:', insertError);
        return NextResponse.json(
          { error: 'Failed to assign new role' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}