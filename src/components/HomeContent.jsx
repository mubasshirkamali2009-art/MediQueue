"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, CalendarDays, GraduationCap, Users, BookOpen, Star,
  Sun, Moon, FlaskConical, Zap, Dna,
  Code2, CircleDollarSign, PenLine, Map, ArrowRight, Inbox
} from "lucide-react";

const STATS = [
  { value: "1,200+", label: "Active Tutors",     icon: Users },
  { value: "38K+",   label: "Sessions Booked",   icon: CalendarDays },
  { value: "94%",    label: "Satisfaction Rate",  icon: Star },
  { value: "60+",    label: "Subjects Covered",   icon: BookOpen },
];

const STEPS = [
  { icon: Search,        step: "01", title: "Browse Tutors",  desc: "Filter by subject, availability, teaching mode, and fee to find your ideal match." },
  { icon: CalendarDays,  step: "02", title: "Book a Session", desc: "Pick a slot that fits your schedule. Online or offline — your choice." },
  { icon: GraduationCap, step: "03", title: "Start Learning", desc: "Join your session and track progress. Rebook with the same tutor anytime." },
];

const TESTIMONIALS = [
  { name: "Ariana K.",  subject: "A-Level Mathematics", initials: "AK", text: "My grades went from a C to an A* in one semester. The tutor explained things in a way my school teacher never did." },
  { name: "Rafiq H.",   subject: "O-Level Physics",     initials: "RH", text: "Booking was dead simple. Three clicks and I had a session the next morning. Completely changed how I approach problem sets." },
  { name: "Simone T.",  subject: "Computer Science",    initials: "ST", text: "I was failing my data structures course. After four sessions I was helping classmates. Worth every penny." },
  { name: "Mei L.",     subject: "English Literature",  initials: "ML", text: "My tutor helped me build a writing structure I had never had before. My essays finally have an argument." },
];

const CATEGORIES = [
  { icon: BookOpen,         label: "Mathematics" },
  { icon: FlaskConical,     label: "Chemistry" },
  { icon: Zap,              label: "Physics" },
  { icon: Dna,              label: "Biology" },
  { icon: Code2,            label: "Computer Science" },
  { icon: CircleDollarSign, label: "Economics" },
  { icon: PenLine,          label: "English" },
  { icon: Map,              label: "Geography" },
];

function SkeletonCard() {
  return (
    <div className="card bg-base-200 shadow-sm animate-pulse">
      <div className="h-52 bg-base-300 rounded-t-2xl" />
      <div className="card-body gap-3">
        <div className="h-4 bg-base-300 rounded w-3/5" />
        <div className="h-3 bg-base-300 rounded w-2/5" />
        <div className="h-10 bg-base-300 rounded-xl mt-2" />
      </div>
    </div>
  );
}

function TutorCard({ teacher }) {
  const modeColor = {
    Online:  "badge-success",
    Offline: "badge-warning",
    Both:    "badge-secondary",
  }[teacher.teachingMode] ?? "badge-secondary";

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.tutorName)}&background=1e3a5f&color=60a5fa&size=400`;

  return (
    <div className="card bg-base-200 border border-base-300 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 overflow-hidden group">
      <figure className="relative h-52 overflow-hidden">
        <img
          src={teacher.photoUrl || fallback}
          alt={teacher.tutorName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = fallback; }}
        />
        <span className="absolute bottom-3 left-3 badge badge-primary badge-sm font-semibold">{teacher.subject}</span>
        <span className={`absolute top-3 right-3 badge ${modeColor} badge-outline badge-sm font-semibold`}>{teacher.teachingMode}</span>
      </figure>
      <div className="card-body p-5 gap-2">
        <h3 className="card-title text-base">{teacher.tutorName}</h3>
        <p className="text-sm text-base-content/50 truncate">{teacher.institution}</p>
        {teacher.selectedDays?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {teacher.selectedDays.slice(0, 4).map((d) => (
              <span key={d} className="badge badge-ghost badge-xs font-medium">{d}</span>
            ))}
            {teacher.selectedDays.length > 4 && (
              <span className="text-xs text-base-content/40">+{teacher.selectedDays.length - 4}</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-extrabold text-primary">
            ${teacher.hourlyFee}
            <span className="text-xs font-normal text-base-content/40"> / hr</span>
          </span>
          {/* ✅ Link instead of router.push — avoids router init error */}
          <Link href={`/teachers/${teacher._id}`}>
            <button className="btn btn-primary btn-sm rounded-xl">Book Session</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const HomeContent = () => {
  const router = useRouter();
  const [isDark, setIsDark]                   = useState(true);
  const [teachers, setTeachers]               = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [testimonialIdx, setTestimonialIdx]   = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "night" : "corporate");
  }, [isDark]);

  useEffect(() => {
    fetch("http://localhost:5000/teachers")
      .then((r) => r.json())
      .then((data) => setTeachers([...data].sort(() => Math.random() - 0.5).slice(0, 6)))
      .catch(() => setTeachers([]))
      .finally(() => setLoadingTeachers(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>

      {/* ── Theme Toggle FAB ──────────────────────────────────────────── */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed bottom-6 right-6 z-50 btn btn-circle btn-primary shadow-xl"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "clamp(480px,70vh,700px)" }}>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80"
          alt="Hero banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 md:px-20 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-5 drop-shadow-lg">
              Study with tutors who actually know their subject.
            </h1>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Real experts. Flexible schedules. Results that speak for themselves.
            </p>
            {/* ✅ Link wrapping buttons — no router.push needed */}
            <div className="flex gap-3 flex-wrap">
              <Link href="/teachers">
                <button className="btn btn-primary rounded-xl px-7">Browse Tutors</button>
              </Link>
              <Link href="/add-tutor">
                <button className="btn rounded-xl px-7 bg-white/15 text-white border-white/30 hover:bg-white/25 backdrop-blur-sm">
                  Become a Tutor
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-content/20">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="px-4 py-7 text-center flex flex-col items-center gap-2">
                <Icon size={20} className="text-primary-content/70" />
                <div className="text-2xl md:text-3xl font-extrabold text-primary-content">{s.value}</div>
                <div className="text-xs text-primary-content/70 font-medium tracking-wide">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Subject Categories ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">What do you want to learn?</p>
          <h2 className="text-3xl md:text-4xl font-bold">Browse by Subject</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.label} href={`/tutors?subject=${c.label}`}>
                <div className="card bg-base-200 hover:bg-base-300 border border-base-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 p-4 text-center cursor-pointer">
                  <div className="flex justify-center mb-2 text-primary">
                    <Icon size={24} />
                  </div>
                  <div className="text-xs font-semibold leading-tight">{c.label}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Available Tutors ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Ready to teach</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Available Tutors</h2>
            <p className="text-base-content/50 text-sm">A fresh selection — reshuffled each visit.</p>
          </div>
          <Link href="/teachers">
            <button className="btn btn-outline btn-sm rounded-xl gap-1">
              View All <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        {loadingTeachers ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20 text-base-content/40 flex flex-col items-center gap-3">
            <Inbox size={48} />
            <p>No tutors found. Make sure the server is running.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((teacher) => (
              <TutorCard key={teacher._id} teacher={teacher} />
            ))}
          </div>
        )}
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="bg-base-200 border-y border-base-300">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold">Three steps to your first session</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="card bg-base-100 border border-base-300 shadow-sm p-8 relative">
                  <span className="absolute top-4 right-5 text-xs font-black text-primary/30 tracking-widest">{step.step}</span>
                  <div className="mb-5 text-primary">
                    <Icon size={36} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-base-content/50 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Student feedback</p>
          <h2 className="text-3xl md:text-4xl font-bold">What learners say</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-200 border border-base-300 shadow-md p-8 md:p-12 text-center min-h-[220px] flex flex-col justify-center">
            <p className="text-base md:text-lg leading-relaxed italic text-base-content/80 mb-8">
              &ldquo;{TESTIMONIALS[testimonialIdx].text}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-11">
                  <span className="text-sm font-bold">{TESTIMONIALS[testimonialIdx].initials}</span>
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">{TESTIMONIALS[testimonialIdx].name}</div>
                <div className="text-xs text-base-content/40">{TESTIMONIALS[testimonialIdx].subject}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 bg-primary ${
                  i === testimonialIdx ? "w-7 opacity-100" : "w-2 opacity-30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="bg-primary">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-content mb-5 leading-tight">
            Ready to close the gap?
          </h2>
          <p className="text-primary-content/75 text-base md:text-lg mb-10 leading-relaxed">
            Find a tutor who fits your schedule, your subject, and your budget — in under two minutes.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/tutors">
              <button className="btn bg-white text-primary hover:bg-white/90 border-none rounded-xl font-bold">
                Find a Tutor
              </button>
            </Link>
            <Link href="/add-tutor">
              <button className="btn rounded-xl font-bold bg-white/15 text-white border-white/30 hover:bg-white/25">
                Register as a Tutor
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeContent;