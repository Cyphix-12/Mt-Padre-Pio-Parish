import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const ALLOWED_METHODS = ['GET', 'POST', 'OPTIONS'];

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
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  // Validate request method
  if (!validateMethod(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  
  // Initialize supabase client within request scope
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });

  // Rate limiting
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
    userId: session.user.id,
    email: session.user.email,
    role: roleData?.role_name || null
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

  // Initialize supabase client within request scope
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });

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