'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [recoverySession, setRecoverySession] = useState(false);

  useEffect(() => {
    const { hash } = window.location;
    if (hash.includes('type=recovery')) {
      setRecoverySession(true);
    }
  }, []);

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully. Redirecting to login...');
      setTimeout(() => router.push('/signin'), 2000);
    }
  };

  if (!recoverySession) {
    return (
      <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold">Invalid recovery link.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <input
        type="password"
        className="border rounded p-2"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handlePasswordReset}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Update Password
      </button>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
}
