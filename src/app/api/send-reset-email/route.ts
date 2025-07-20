import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Password reset email sent' });
}
