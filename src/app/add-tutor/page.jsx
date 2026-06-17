"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast, Toaster } from "sonner";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "History", "Geography", "Computer Science",
  "Economics", "Accounting", "Art & Design", "Music", "Other",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
});

// Get today's date in LOCAL timezone (not UTC)
// toISOString() gives UTC date which blocks today in UTC+ timezones like Singapore
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AddTutorPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    tutorName: "",
    photoUrl: "",
    subject: "",
    selectedDays: [],
    timeFrom: "",
    timeTo: "",
    hourlyFee: "",
    totalSlots: "",
    startDate: "",
    institution: "",
    location: "",
    teachingMode: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleDay = (day) => {
    set(
      "selectedDays",
      form.selectedDays.includes(day)
        ? form.selectedDays.filter((d) => d !== day)
        : [...form.selectedDays, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.selectedDays.length === 0) {
      toast.error("Please select at least one available day.");
      return;
    }

    if (form.timeFrom === form.timeTo) {
      toast.error("Start time and end time cannot be the same.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userEmail: user.email }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      console.log("Success:", data);

      setSubmitted(true);
      toast.success("Tutor profile submitted successfully!");
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Failed to submit. Make sure the server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/singin");
    }
  }, [isPending, user, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0b1623] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5ba3d9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b1623] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5ba3d9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      

      {/* Sonner toast container — dark theme to match the page */}
      <Toaster theme="dark" position="top-right" richColors closeButton />

      <div className="min-h-screen bg-[#0b1623] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-[#5ba3d9] text-sm font-semibold uppercase tracking-widest mb-2">TutorFind</p>
            <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">Register as a Tutor</h1>
            <p className="text-gray-500 text-sm mt-2">Fill in your details to list your tutoring sessions on the platform.</p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="on" className="space-y-6">

            {/* Card: Basic Info */}
            <div className="bg-[#0f1e30] border border-[#1a2f48] rounded-2xl p-6 space-y-5">
              <h2 className="text-white text-xs font-semibold uppercase tracking-widest pb-3 border-b border-[#1a2f48]">
                Basic Information
              </h2>

              {/* Tutor Name */}
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                  Tutor Name <span className="text-[#5ba3d9]">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Dr. Sarah Ahmed"
                  value={form.tutorName}
                  onChange={(e) => set("tutorName", e.target.value)}
                  className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5ba3d9] transition-colors"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                  Photo URL <span className="text-[#5ba3d9]">*</span>
                </label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      required
                      autoComplete="url"
                      placeholder="Paste imgbb or postimage direct link…"
                      value={form.photoUrl}
                      onChange={(e) => {
                        set("photoUrl", e.target.value);
                        setPhotoPreview(e.target.value);
                      }}
                      className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5ba3d9] transition-colors"
                    />
                    <p className="text-xs text-gray-600 mt-1.5">
                      Upload to{" "}
                      <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-[#5ba3d9] hover:underline">imgbb.com</a>
                      {" "}or{" "}
                      <a href="https://postimages.org" target="_blank" rel="noreferrer" className="text-[#5ba3d9] hover:underline">postimages.org</a>
                      {" "}then paste the direct link.
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-xl border border-[#1a2f48] bg-[#0b1623] overflow-hidden flex items-center justify-center shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" onError={() => setPhotoPreview("")} />
                    ) : (
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Subject + Teaching Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                    Subject / Category <span className="text-[#5ba3d9]">*</span>
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5ba3d9] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select subject…</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                    Teaching Mode <span className="text-[#5ba3d9]">*</span>
                  </label>
                  <select
                    required
                    value={form.teachingMode}
                    onChange={(e) => set("teachingMode", e.target.value)}
                    className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5ba3d9] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select mode…</option>
                    {["Online", "Offline", "Both"].map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Card: Schedule */}
            <div className="bg-[#0f1e30] border border-[#1a2f48] rounded-2xl p-6 space-y-5">
              <h2 className="text-white text-xs font-semibold uppercase tracking-widest pb-3 border-b border-[#1a2f48]">
                Schedule &amp; Availability
              </h2>

              {/* Available Days */}
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">
                  Available Days <span className="text-[#5ba3d9]">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const active = form.selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          active
                            ? "bg-[#5ba3d9] border-[#5ba3d9] text-[#0b1623]"
                            : "bg-[#0b1623] border-[#1a2f48] text-gray-400 hover:border-[#5ba3d9] hover:text-[#5ba3d9]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                {form.selectedDays.length === 0 && (
                  <p className="text-xs text-gray-600 mt-2">Select at least one day.</p>
                )}
              </div>

              {/* Time From / To */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                    From <span className="text-[#5ba3d9]">*</span>
                  </label>
                  <select
                    required
                    value={form.timeFrom}
                    onChange={(e) => set("timeFrom", e.target.value)}
                    className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5ba3d9] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Start time</option>
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                    To <span className="text-[#5ba3d9]">*</span>
                  </label>
                  <select
                    required
                    value={form.timeTo}
                    onChange={(e) => set("timeTo", e.target.value)}
                    className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5ba3d9] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>End time</option>
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              {/* Session Start Date */}
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                  Session Start Date <span className="text-[#5ba3d9]">*</span>
                </label>
                <input
                  type="date"
                  required
                  autoComplete="off"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  min={getLocalDateString()}
                  className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5ba3d9] transition-colors cursor-pointer [color-scheme:dark]"
                />
              </div>

              {/* Hourly Fee + Total Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                    Hourly Fee (USD) <span className="text-[#5ba3d9]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      autoComplete="off"
                      placeholder="0"
                      value={form.hourlyFee}
                      onChange={(e) => set("hourlyFee", e.target.value)}
                      className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5ba3d9] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                    Total Slots <span className="text-[#5ba3d9]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    autoComplete="off"
                    placeholder="e.g. 20"
                    value={form.totalSlots}
                    onChange={(e) => set("totalSlots", e.target.value)}
                    className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5ba3d9] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Card: Background */}
            <div className="bg-[#0f1e30] border border-[#1a2f48] rounded-2xl p-6 space-y-5">
              <h2 className="text-white text-xs font-semibold uppercase tracking-widest pb-3 border-b border-[#1a2f48]">
                Background &amp; Location
              </h2>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                  Institution &amp; Experience <span className="text-[#5ba3d9]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  autoComplete="organization"
                  placeholder="e.g. MSc Mathematics, University of Dhaka · 5 years tutoring O-Level & A-Level students"
                  value={form.institution}
                  onChange={(e) => set("institution", e.target.value)}
                  className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5ba3d9] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wider">
                  Location (Area / City) <span className="text-[#5ba3d9]">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoComplete="address-level2"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full bg-[#0b1623] border border-[#1a2f48] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5ba3d9] transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || submitted}
              className="w-full bg-[#5ba3d9] hover:bg-[#4a8ec4] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-[#0b1623] font-semibold text-sm py-4 rounded-2xl transition-all tracking-wide uppercase"
            >
              {loading ? "Submitting…" : submitted ? "✓ Profile Submitted!" : "Submit Tutor Profile"}
            </button>

          </form>
        </div>
      </div>
      
    </div>
  );
};

export default AddTutorPage;