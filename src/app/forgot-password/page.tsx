'use client';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    const res = await fetch('/api/send-reset-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setMessage('Reset link sent! Check your inbox.');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Error sending email');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        className="border rounded p-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset} className="bg-blue-600 text-white p-2 rounded">
        Send Reset Link
      </button>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
}
