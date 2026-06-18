"use client";
import React, { useState, useEffect } from 'react';
import { Button, Link, Switch } from "@heroui/react";
import { authClient } from '@/lib/auth-client';
import { Avatar } from "@heroui/react";
import { useTheme } from "next-themes";
import {
  BellFill,
  BellSlash,
  Check,
  Microphone,
  MicrophoneSlash,
  Moon,
  Power,
  Sun,
  VolumeFill,
  VolumeSlashFill,
} from "@gravity-ui/icons";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // লিন্টার ওয়ার্নিং এবং হাইড্রেশন এরর দূর করার জন্য অ্যাসিনক্রোনাস মাউন্ট
  useEffect(() => {
    let animationFrameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleSignout = async () => {
    await authClient.signOut();
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">MediQueue</span>
        </Link>

        {/* Nav Links - lg only */}
        <div className="hidden lg:flex items-center gap-1">
          <Link href="/" className="text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors font-medium">Home</Link>
          <Link href="/teachers" className="text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors font-medium">Tutors</Link>
          <Link href="/add-tutor" className="text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors font-medium">Add Tutor</Link>
          <Link href="/my-tutors" className="text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors font-medium">My Tutors</Link>
          <Link href="/my-bookings" className="text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors font-medium">My Booked Sessions</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Switch
            isSelected={mounted ? resolvedTheme === "dark" : false}
            onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {({ isSelected }) => (
              <>
                <Switch.Control
                  className={`h-[31px] w-[51px] bg-blue-500 ${isSelected ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" : ""}`}
                >
                  <Switch.Thumb
                    className={`size-[27px] bg-white shadow-sm ${isSelected ? "ms-[22px] shadow-lg" : ""}`}
                  >
                    <Switch.Icon>
                      {!mounted ? (
                        <Sun className="size-4 text-blue-600" />
                      ) : isSelected ? (
                        <Moon className="size-4 text-cyan-600" />
                      ) : (
                        <Sun className="size-4 text-blue-600" />
                      )}
                    </Switch.Icon>
                  </Switch.Thumb>
                </Switch.Control>
              </>
            )}
          </Switch>

          {user && (
            <>
              
                <Avatar>
                  <Avatar.Image referrerPolicy='no-referrer' alt="user image" src={user?.image} />
                  <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                </Avatar>
              
              <button
                onClick={handleSignout}
                className="hidden lg:block px-4 py-2 text-sm font-semibold text-white bg-indigo-600 dark:bg-indigo-500 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                Logout
              </button>
            </>
          )}

          {/* Sign in / Sign up */}
          {!user && (
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/singin" className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">Sign in</Link>
              <Link href="/singup" className="px-4 py-2 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">Sign up</Link>
            </div>
          )}

          {/* Hamburger - below lg */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col gap-1.5 p-1"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-4 pt-2 flex flex-col gap-1">
          <Link href="/" className="text-base text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 font-medium border-b border-gray-100 dark:border-gray-800 block">Home</Link>
          <Link href="/teachers" className="text-base text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 font-medium border-b border-gray-100 dark:border-gray-800 block">Tutors</Link>
          <Link href="/add-tutor" className="text-base text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 font-medium border-b border-gray-100 dark:border-gray-800 block">Add Tutor</Link>
          <Link href="/my-tutors" className="text-base text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 font-medium border-b border-gray-100 dark:border-gray-800 block">My Tutors</Link>
          <Link href="/my-bookings" className="text-base text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 font-medium border-b border-gray-100 dark:border-gray-800 block">My Booked Sessions</Link>
          {user ? (
            <button
              onClick={handleSignout}
              className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/singin" className="mt-3 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">Sign in</Link>
              <Link href="/singup" className="mt-2 px-4 py-2 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;