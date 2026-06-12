"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Edit from "@/components/Edit";
import { Delete } from "@/components/Delete";
import {
  School,
  MapPin,
  Clock,
  CalendarDays,
  Banknote,
  CalendarCheck,
  Armchair,
  Ban,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API = "http://localhost:5000";

export default function TeacherDetailPage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const currentUser = { email: "student@example.com" };

  useEffect(() => {
    fetch(`${API}/teachers/${id}`)
      .then((r) => r.json())
      .then((data) => { setTutor(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessionDate = tutor ? new Date(tutor.startDate) : null;
  if (sessionDate) sessionDate.setHours(0, 0, 0, 0);

  const noSlots = tutor && Number(tutor.totalSlots) === 0;
  const notYet  = tutor && sessionDate && today < sessionDate;
  const bookingBlocked = noSlots || notYet;

  async function handleBook(e) {
    e.preventDefault();
    setSubmitting(true);
    setBookingResult(null);
    try {
      const freshRes = await fetch(`${API}/teachers/${id}`);
      const fresh = await freshRes.json();
      if (Number(fresh.totalSlots) === 0) {
        setBookingResult({ success: false, message: "This session is fully booked. You can't join at the moment." });
        setSubmitting(false);
        return;
      }
      const bookRes = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: tutor._id,
          tutorName: tutor.tutorName,
          studentEmail: currentUser.email,
          studentName,
          phone,
          subject: tutor.subject,
          bookStatus: "Pending",
          bookedAt: new Date().toISOString(),
        }),
      });
      if (!bookRes.ok) throw new Error();
      await fetch(`${API}/teachers/${id}/decrease-slot`, { method: "PATCH" });
      setTutor((p) => ({ ...p, totalSlots: String(Number(p.totalSlots) - 1) }));
      setBookingResult({ success: true, message: "Booking confirmed! You'll hear from the tutor soon." });
      setStudentName("");
      setPhone("");
    } catch {
      setBookingResult({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <Footer />
    </div>
  );

  if (!tutor) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">Tutor not found.</div>
      <Footer />
    </div>
  );

  const modeColor = {
    Online:  "bg-green-100 text-green-700",
    Offline: "bg-orange-100 text-orange-700",
    Both:    "bg-blue-100 text-blue-700",
  }[tutor.teachingMode] ?? "bg-gray-100 text-gray-700";

  const initials = tutor?.tutorName
    ? tutor.tutorName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 sm:px-8 pt-6">

            {/* Profile header */}
            <div className="flex items-center gap-4 mb-6 justify-between">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-blue-100 flex items-center justify-center shrink-0">
                {tutor.photoUrl
                  ? <img src={tutor.photoUrl} alt={tutor.tutorName} className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-blue-600">{initials}</span>
                }
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{tutor.tutorName}</h1>
                <p className="text-blue-600 font-semibold text-sm mt-0.5">{tutor.subject}</p>
                <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${modeColor}`}>
                  {tutor.teachingMode}
                </span>
              </div>

              <Edit
                teacher={tutor}
                onUpdated={(updated) => setTutor(updated)}
              />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
              <InfoCard icon={<School size={16} />}        label="Institution"   value={tutor.institution} />
              <InfoCard icon={<MapPin size={16} />}        label="Location"      value={tutor.location} />
              <InfoCard icon={<Clock size={16} />}         label="Hours"         value={`${tutor.timeFrom} – ${tutor.timeTo}`} />
              <InfoCard icon={<CalendarDays size={16} />}  label="Days"          value={tutor.selectedDays?.join(", ")} />
              <InfoCard icon={<Banknote size={16} />}      label="Hourly Fee"    value={`BDT ${tutor.hourlyFee} / hr`} />
              <InfoCard icon={<CalendarCheck size={16} />} label="Session Start" value={tutor.startDate} />

              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 sm:col-span-2 lg:col-span-1">
                <span className="mt-0.5 shrink-0 text-gray-500"><Armchair size={16} /></span>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Available Slots</p>
                  <p className={`text-sm font-bold mt-0.5 ${Number(tutor.totalSlots) === 0 ? "text-red-500" : "text-green-600"}`}>
                    {tutor.totalSlots} {Number(tutor.totalSlots) === 0 ? "— Fully Booked" : "slots left"}
                  </p>
                </div>
              </div>
            </div>

            {/* Alert banners */}
            {noSlots && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                <Ban size={16} className="shrink-0" /> No available slots left.
              </div>
            )}
            {!noSlots && notYet && (
              <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-3 rounded-xl">
                <Lock size={16} className="shrink-0" /> Booking opens on <strong>{tutor.startDate}</strong>.
              </div>
            )}

            {/* Book button */}
            <div className="mb-6">
              <button
                onClick={() => { setBookingResult(null); setModalOpen(true); }}
                disabled={bookingBlocked}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  bookingBlocked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md"
                }`}
              >
                {noSlots ? "Fully Booked" : notYet ? "Not Available Yet" : "Book Session"}
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 pt-5 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">Book a Session</h2>
                <p className="text-blue-100 text-xs mt-0.5">with {tutor.tutorName} · {tutor.subject}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/70 hover:text-white text-3xl leading-none"
                aria-label="Close"
              >×</button>
            </div>

            <div className="px-5 py-5 max-h-[80vh] overflow-y-auto">

              {bookingResult && (
                <div className={`mb-4 flex items-start gap-2 text-sm font-medium px-4 py-3 rounded-xl border ${
                  bookingResult.success
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {bookingResult.success
                    ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    : <XCircle size={16} className="shrink-0 mt-0.5" />}
                  {bookingResult.message}
                </div>
              )}

              {bookingResult?.success ? (
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Done
                </button>
              ) : (
                <form onSubmit={handleBook} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tutor ID</label>
                      <input readOnly value={tutor._id}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-400 cursor-not-allowed truncate" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tutor Name</label>
                      <input readOnly value={tutor.tutorName}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Email</label>
                    <input readOnly value={currentUser.email}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                      Student Name <span className="text-red-400">*</span>
                    </label>
                    <input required value={studentName} onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                  </div>

                  <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking Status</span>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">Pending</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {submitting
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Confirming…</>
                        : "Confirm Booking"}
                    </button>
                    <Delete />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
      <span className="mt-0.5 shrink-0 text-gray-500">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-800 font-medium mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}