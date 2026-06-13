"use client";

import React, { useState } from "react";
import { Pencil, X, Save, Loader2, User, Building2, BookOpen, DollarSign, Monitor, Image, Calendar } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MODES = ["Online", "Offline", "Both"];

const Edit = ({ teacher, onUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [form, setForm]     = useState({});

  const openModal = () => {
    setForm({
      tutorName:    teacher.tutorName    || "",
      institution:  teacher.institution  || "",
      subject:      teacher.subject      || "",
      hourlyFee:    teacher.hourlyFee    || "",
      teachingMode: teacher.teachingMode || "Online",
      photoUrl:     teacher.photoUrl     || "",
      selectedDays: teacher.selectedDays || [],
    });
    setError("");
    setIsOpen(true);
  };

  const closeModal = () => { if (!saving) setIsOpen(false); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleSave = async () => {
    if (!form.tutorName.trim())         return setError("Name is required.");
    if (!form.subject.trim())           return setError("Subject is required.");
    if (!form.hourlyFee)                return setError("Hourly fee is required.");
    if (form.selectedDays.length === 0) return setError("Select at least one day.");

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/teachers/${teacher._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      onUpdated && onUpdated({ ...teacher, ...form });
      setIsOpen(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={openModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-sm transition-all duration-200 border border-blue-200 hover:border-blue-300"
      >
        <Pencil size={13} />
        Edit
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(6px)" }}
          onClick={closeModal}
        >
          {/* Modal */}
          <div
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1a2f4e 50%, #0f1e30 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-white font-bold text-lg tracking-tight">Edit Tutor Profile</h2>
                <p className="text-blue-300 text-xs mt-0.5">Update {teacher.tutorName}&apos;s information</p>
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-widest">
                  <User size={11} /> Full Name
                </label>
                <input
                  name="tutorName"
                  value={form.tutorName}
                  onChange={handleChange}
                  placeholder="e.g. John Smith"
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>

              {/* Institution */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-widest">
                  <Building2 size={11} /> Institution
                </label>
                <input
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="e.g. Oxford University"
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-widest">
                  <BookOpen size={11} /> Subject
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>

              {/* Fee + Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-widest">
                    <DollarSign size={11} /> Hourly Fee
                  </label>
                  <input
                    name="hourlyFee"
                    type="number"
                    min="0"
                    value={form.hourlyFee}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                    onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-widest">
                    <Monitor size={11} /> Mode
                  </label>
                  <select
                    name="teachingMode"
                    value={form.teachingMode}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    {MODES.map((m) => (
                      <option key={m} value={m} style={{ background: "#1e3a5f" }}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo URL */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-widest">
                  <Image size={11} /> Photo URL <span className="text-white/30 normal-case font-normal">(optional)</span>
                </label>
                <input
                  name="photoUrl"
                  value={form.photoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>

              {/* Days */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-widest">
                  <Calendar size={11} /> Available Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const active = form.selectedDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                        style={{
                          background: active ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.07)",
                          border: active ? "1px solid rgba(96,165,250,0.6)" : "1px solid rgba(255,255,255,0.12)",
                          color: active ? "#93c5fd" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-300"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-white/10">
              <button
                onClick={closeModal}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
                onMouseOver={(e) => !saving && (e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)")}
                onMouseOut={(e) => !saving && (e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)")}
              >
                {saving
                  ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  : <><Save size={14} /> Save Changes</>
                }
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Edit;