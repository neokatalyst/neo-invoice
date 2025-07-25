'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function Page() {
  const router = useRouter();
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
      setMessage('Password updated successfully. Redirecting...');
      setTimeout(() => router.push('/signin'), 2000);
    }
  };

  if (!recoverySession) {
    return (
      <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
        <p className="text-red-600 text-center">Invalid recovery link or session expired.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <input
        type="password"
        className="border rounded p-2"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset} className="bg-blue-600 text-white p-2 rounded">
        Update Password
      </button>
      {message && <p className="text-center text-green-600">{message}</p>}
    </div>
  );
}
