"use client"
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import Link from 'next/link';

const SingUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');  // ← new

  const validatePassword = (password) => {  // ← new
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const error = validatePassword(user.password);  // ← new
    if (error) {                                     // ← new
      setPasswordError(error);                       // ← new
      return;                                        // ← blocks sign up
    }
    setPasswordError('');

    const { data, error: signUpError } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.firstName,
      image: user.imageUrl,
      callbackURL: "/"
    });
    console.log({ data, signUpError });
  };

  const handleGoogleSignin = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl px-8 py-10 shadow-sm">

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="text-[17px] font-medium text-gray-900 tracking-tight">Meddique</span>
        </div>

        <h1 className="text-[22px] font-medium text-gray-900 tracking-tight leading-tight mb-1.5">Sign up</h1>
        <p className="text-sm text-gray-500 mb-7">Join thousands of teams already using Meddique.</p>

        {/* Google Button */}
        <button onClick={handleGoogleSignin} type="button" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors mb-6">
          <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <form onSubmit={onSubmit} noValidate>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or continue with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="first-name" className="block text-[13px] font-medium text-gray-500 mb-1.5">First name</label>
            <input id="first-name" name="firstName" type="text" placeholder="Jane"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-[13px] font-medium text-gray-500 mb-1.5">Email address</label>
            <div className="relative">
              <input id="email" name="email" type="email" placeholder="jane@company.com"
                className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all" />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          </div>

          {/* Profile Image URL */}
          <div className="mb-4">
            <label htmlFor="img-url" className="block text-[13px] font-medium text-gray-500 mb-1.5">Profile image URL</label>
            <div className="relative">
              <input id="img-url" name="imageUrl" type="url" placeholder="https://example.com/photo.jpg"
                className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all" />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">  {/* ← changed mb-6 to mb-2 to make room for error */}
            <label htmlFor="password" className="block text-[13px] font-medium text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                onChange={() => setPasswordError('')} 
                className={`w-full h-10 pl-3 pr-9 rounded-lg border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 transition-all
                  ${passwordError
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
                    : 'border-gray-200 focus:border-violet-500 focus:ring-violet-500/10'
                  }`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Password Error ← new */}
          {passwordError && (
            <p className="text-xs text-red-500 mb-4 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {passwordError}
            </p>
          )}

          {/* Submit */}
          <button type="submit" className="w-full h-[42px] flex items-center justify-center gap-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 active:scale-[0.98] text-white text-sm font-medium transition-all">
            Sign up
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Sign in link */}
          <p className="text-center mt-5 text-[13px] text-gray-500">
            Already have an account?{' '}
            <Link href="/singin" className="text-violet-500 font-medium hover:underline">Sign in</Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default SingUpPage;