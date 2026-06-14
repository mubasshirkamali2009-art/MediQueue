"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Book from "@/components/Book";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete"; // ✅ FIX: default import (not named)
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
  const router = useRouter();
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
    <div className="min-h-screen flex flex-col ">

      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
     
    </div>
  );

  if (!tutor) return (
    <div className="min-h-screen flex flex-col">
     
      <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">Tutor not found.</div>
    
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
    <div className="min-h-screen flex flex-col bg-gray-50 ">
      

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ">
          <div className="px-5 sm:px-8 pt-6 ">

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

              {/* Edit stays top-right */}
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

            

            {/* Book + Delete buttons */}
            <div className="mb-6 flex gap-3">
             <Book/>

              {/* ✅ Delete component — tutorId, tutorName, redirect on delete */}
              <Delete
                tutorId={tutor._id}
                tutorName={tutor.tutorName}
                onDeleted={() => router.push("/tutors")}
              />
            </div>

          </div>
        </div>
      </main>

      

      
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