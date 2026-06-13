"use client"
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const loadingToast = toast.loading('Signing you in...');

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });

    if (error) {
      toast.update(loadingToast, {
        render: error.message || 'Invalid email or password.',
        type: 'error',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
      });
    } else {
      toast.update(loadingToast, {
        render: 'Welcome back!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }

    console.log({ data, error });
  };

  return (
    <>
      <ToastContainer position="top-center" theme="colored" />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl px-8 py-10 shadow-sm">

          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="text-[17px] font-medium text-gray-900 tracking-tight">Meddique</span>
          </div>

          <form onSubmit={onSubmit} noValidate>

            {/* Heading */}
            <h1 className="text-[22px] font-medium text-gray-900 tracking-tight leading-tight mb-1.5">
              Sign in
            </h1>
            <p className="text-sm text-gray-500 mb-7">
              Welcome back to Meddique.
            </p>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-500 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                  className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[13px] font-medium text-gray-500">
                  Password
                </label>
                <a href="#" className="text-[13px] text-violet-500 font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-[42px] flex items-center justify-center gap-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 active:scale-[0.98] text-white text-sm font-medium transition-all"
            >
              Sign in
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* Sign up link */}
            <p className="text-center mt-5 text-[13px] text-gray-500">
              Dont have an account?{' '}
              <a href="#" className="text-violet-500 font-medium hover:underline">
                Sign up
              </a>
            </p>

          </form>

        </div>
      </div>
    </>
  );
};

export default SignInPage;