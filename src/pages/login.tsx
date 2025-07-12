// app/login/page.tsx
'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = username.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(data.token ? `로그인 성공!` : '로그인 실패');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border border-red-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-red-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
        />

        <button
          disabled={!isFormValid}
          onClick={handleLogin}
          className={`rounded py-2 px-4 transition text-white
            ${isFormValid ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          로그인
        </button>
        <div className="mt-4 flex gap-4 text-sm text-gray-600 underline justify-center">
          <a href="#" className="hover:text-red-600">회원가입</a>
        </div>
      </div>
      
    </div>
  );
}
