"use client";

import React, { useState } from "react";
import { Pencil, X, Save, Loader2 } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MODES = ["Online", "Offline", "Both"];

const Edit = ({ teacher, onUpdated }) => {
  const [isOpen, setIsOpen]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({});

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

  const closeModal = () => {
    if (!saving) setIsOpen(false);
  };

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

      if (!res.ok) throw new Error("Update failed");

      onUpdated && onUpdated({ ...teacher, ...form });
      setIsOpen(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-outline btn-primary rounded-xl gap-1"
        onClick={openModal}
      >
        <Pencil size={13} />
        Edit
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={closeModal}
        >
          <div
            className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-base-300">
              <h2 className="text-lg font-bold">Edit Tutor</h2>
              <button
                className="btn btn-circle btn-ghost btn-sm"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">

              <div className="form-control gap-1">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Full Name</label>
                <input
                  name="tutorName"
                  value={form.tutorName}
                  onChange={handleChange}
                  className="input input-bordered rounded-xl w-full"
                  placeholder="e.g. John Smith"
                />
              </div>

              <div className="form-control gap-1">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Institution</label>
                <input
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  className="input input-bordered rounded-xl w-full"
                  placeholder="e.g. Oxford University"
                />
              </div>

              <div className="form-control gap-1">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="input input-bordered rounded-xl w-full"
                  placeholder="e.g. Mathematics"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control gap-1">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Hourly Fee ($)</label>
                  <input
                    name="hourlyFee"
                    type="number"
                    min="0"
                    value={form.hourlyFee}
                    onChange={handleChange}
                    className="input input-bordered rounded-xl w-full"
                    placeholder="e.g. 30"
                  />
                </div>

                <div className="form-control gap-1">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Teaching Mode</label>
                  <select
                    name="teachingMode"
                    value={form.teachingMode}
                    onChange={handleChange}
                    className="select select-bordered rounded-xl w-full"
                  >
                    {MODES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control gap-1">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Photo URL (optional)</label>
                <input
                  name="photoUrl"
                  value={form.photoUrl}
                  onChange={handleChange}
                  className="input input-bordered rounded-xl w-full"
                  placeholder="https://..."
                />
              </div>

              <div className="form-control gap-2">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`btn btn-sm rounded-xl ${form.selectedDays?.includes(day) ? "btn-primary" : "btn-outline"}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="alert alert-error rounded-xl py-3 text-sm">{error}</div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-base-300 flex justify-end gap-3">
              <button className="btn btn-ghost rounded-xl" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary rounded-xl gap-2" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={15} /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Edit;