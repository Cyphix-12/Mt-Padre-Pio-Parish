import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const ALLOWED_METHODS = ['GET', 'POST'];

const rateLimit = new Map<string, { count: number; timestamp: number }>()
const MAX_REQUESTS = 5
const WINDOW_MS = 60000 // 1 minute

// Validate request method
function validateMethod(method: string): boolean {
  return ALLOWED_METHODS.includes(method);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (!record) {
    rateLimit.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (now - record.timestamp > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (record.count >= MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  // Validate request method
  if (!validateMethod(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const supabase = createRouteHandlerClient({ cookies });

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.json({ 
      error: 'Unauthorized',
      message: 'No valid session found'
    }, { 
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer error="invalid_token"'
      }
    });
  }

  // Fetch user's role
  const { data: roleData, error: roleError } = await supabase
    .from('public.user_with_role')
    .select('role_name, role_permissions')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (roleError) {
    console.error('Error fetching user role:', roleError);
    return NextResponse.json({ 
      error: 'Server Error',
      message: 'Failed to fetch user role'
    }, { 
      status: 500 
    });
  }

  return NextResponse.json({ 
    userId: session.user.id,
    email: session.user.email,
    role: roleData?.role_name || null,
    permissions: roleData?.role_permissions || null,
    expiresAt: session.expires_at
  });
}

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  
  // Validate request method
  if (!validateMethod(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  // Validate Content-Type header
  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 415 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch user's role
  const { data: roleData, error: roleError } = await supabase
    .from('public.user_with_role')
    .select('role_name')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (roleError) {
    console.error('Error fetching user role:', roleError);
    return NextResponse.json({ error: 'Error fetching user role' }, { status: 500 });
  }

  return NextResponse.json({ 
    data: {
      userId: session.user.id,
      email: session.user.email,
      role: roleData?.role_name || null
    }
  });
}