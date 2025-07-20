'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { hash } = window.location;
    if (hash.includes('type=recovery')) {
      supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
          if (event === 'PASSWORD_RECOVERY') {
            console.log('Recovery session detected:', session);
          }
        }
      );
    }
  }, [supabase]);

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated. Redirecting...');
      setTimeout(() => router.push('/signin'), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        className="border rounded p-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset} className="bg-blue-600 text-white p-2 rounded">
        Update Password
      </button>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
}
