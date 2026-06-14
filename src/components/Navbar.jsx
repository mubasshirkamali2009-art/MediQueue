"use client";
import React, { useState } from 'react';
import { Button, Link } from "@heroui/react";
import { authClient } from '@/lib/auth-client';
import { Avatar } from "@heroui/react";

const Navbar = () => { 
  const { data: session } = authClient.useSession()
  const user = session?.user

  const handleSignout = async() => {
    await authClient.signOut();
  }

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm relative z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <span className="font-bold text-lg text-indigo-600">MediQueue</span>
        </Link>

        {/* Nav Links - lg only */}
        <div className="hidden lg:flex items-center gap-1">
          <Link href="/" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">Home</Link>
          <Link href="/teachers" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">Tutors</Link>
          <Link href="/add-tutor" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">Add Tutor</Link>
          <Link href="/my-tutors" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">My Tutors</Link>
          <Link href="/booked-sessions" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">My Booked Sessions</Link>
        </div>

        {/* Right side - everything together */}
        <div className="flex items-center gap-3">

          {/* Avatar + Logout when logged in */}
          {user && (
            <>
              <Link href="/profile">
                <Avatar >
                  <Avatar.Image referrerPolicy='no-referrer' alt="user image" src={user?.image} />
                  <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                </Avatar>
              </Link>
              <button
                onClick={handleSignout}
                className="hidden lg:block px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Logout
              </button>
            </>
          )}

          {/* Sign in / Sign up when not logged in - lg only */}
          {!user && (
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/singin" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">Sign in</Link>
              <Link href="/singup" className="px-4 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">Sign up</Link>
            </div>
          )}

          {/* Hamburger - below lg */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col gap-1.5 p-1"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-1">
          <Link href="/" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">Home</Link>
          <Link href="/teachers" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">Tutors</Link>
          <Link href="/add-tutor" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">Add Tutor</Link>
          <Link href="/my-tutors" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">My Tutors</Link>
          <Link href="/booked-sessions" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">My Booked Sessions</Link>
          {user ? (
            <button
              onClick={handleSignout}
              className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/singin" className="mt-3 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">Sign in</Link>
              <Link href="/singup" className="mt-2 px-4 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">Sign up</Link>
            </>
          )}
        </div>
      )}

    </nav>
  );
};

export default Navbar;