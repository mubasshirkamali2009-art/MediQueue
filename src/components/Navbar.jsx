"use client";
import React, { useState } from 'react';
import {
  Button,
  Link,
} from "@heroui/react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm relative z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <span className="font-bold text-lg text-indigo-600">MediQueue</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <Link href="/" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">Home</Link>
          <Link href="/tutors" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">Tutors</Link>
          <Link href="/add-tutor" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">Add Tutor</Link>
          <Link href="/my-tutors" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">My Tutors</Link>
          <Link href="/booked-sessions" className="text-sm text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">My Booked Sessions</Link>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button as={Link} href="/login" size="sm" className="bg-indigo-600 text-white font-semibold rounded-xl px-5 hover:bg-indigo-700 transition-colors">
            Sign in
          </Button>
          <Button as={Link} href="/register" size="sm" variant="bordered" className="border-indigo-600 text-indigo-600 font-semibold rounded-xl px-5 hover:bg-indigo-50 transition-colors">
            Register
          </Button>
        </div>

        <div className="hidden md:flex lg:hidden items-center gap-3">
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

        <div className="flex md:hidden items-center gap-3">
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

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-1">
          <Link href="/" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">Home</Link>
          <Link href="/tutors" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">Tutors</Link>
          <Link href="/add-tutor" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">Add Tutor</Link>
          <Link href="/my-tutors" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">My Tutors</Link>
          <Link href="/booked-sessions" className="text-base text-gray-700 hover:text-indigo-600 py-2.5 font-medium border-b border-gray-100 block">My Booked Sessions</Link>
          <Button as={Link} href="/login" fullWidth className="mt-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">Sign in</Button>
          <Button as={Link} href="/register" fullWidth variant="bordered" className="mt-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">Register</Button>
        </div>
      )}

    </nav>
  );
};

export default Navbar;