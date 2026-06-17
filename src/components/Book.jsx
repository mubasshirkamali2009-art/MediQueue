import { authClient } from '@/lib/auth-client';
import { Calendar, X, Phone, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

const Book = ({ tutor }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [modalOpen, setModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const totalSlots = Number(tutor?.totalSlots ?? 0);
  const noSlots = totalSlots === 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessionDate = tutor?.startDate ? new Date(tutor.startDate) : null;
  if (sessionDate) sessionDate.setHours(0, 0, 0, 0);
  const notYetOpen = sessionDate && today < sessionDate;

  const bookingBlocked = noSlots || notYetOpen;

  const openModal = () => {
    if (!tutor || !user) return;
    setResult(null);
    setPhone('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setResult(null);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const freshRes = await fetch(`http://localhost:5000/teachers/${tutor._id}`);
      const fresh = await freshRes.json();

      if (Number(fresh.totalSlots) === 0) {
        setResult({ success: false, message: "This session is fully booked. You can't join at the moment." });
        setSubmitting(false);
        return;
      }

      const bookingData = {
        userId: user.id,
        userImage: user.image,
        userName: user.name,
        tutorId: tutor._id,
        tutorName: tutor.tutorName,
        tutorImage: tutor.photoUrl,
        userEmail: user.email,
        studentName: user.name,
        phone: phone.trim(),
        bookStatus: 'Pending',
        bookedAt: new Date().toISOString(),
      };

      const res = await fetch('http://localhost:5000/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error();
const slotRes = await fetch(`http://localhost:5000/teachers/${tutor._id}/decrease-slot`, {
  method: 'PATCH',
});
const slotData = await slotRes.json();
console.log("slot result:", slotData);

      setResult({ success: true, message: "Booking confirmed! You'll hear from the tutor soon." });
      setPhone('');
    } catch {
      setResult({ success: false, message: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        disabled={!tutor || !user}
        className="group w-full sm:w-auto md:w-full inline-flex items-center justify-center gap-2
          px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-2 md:text-lg md:font-semibold
          font-medium text-white bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-400
          hover:-translate-y-0.5 active:scale-95 rounded-lg md:rounded-xl transition-all duration-200
          cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-200" />
        Book Now
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Book a Session</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in your details to confirm</p>
              </div>
              <button
                onClick={closeModal}
                disabled={submitting}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5">

              {noSlots && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-600">No available slots left.</p>
                    <p className="text-xs text-red-400 mt-0.5">This session is currently full.</p>
                  </div>
                </div>
              )}

              {!noSlots && notYetOpen && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                  <XCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-600">Booking is not available yet for this tutor.</p>
                    <p className="text-xs text-amber-400 mt-0.5">
                      Session opens on {sessionDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
                    </p>
                  </div>
                </div>
              )}

              {result && (
                <div className={`flex items-start gap-3 rounded-xl p-4 mb-4 border ${
                  result.success ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                }`}>
                  {result.success
                    ? <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                    : <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  }
                  <p className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-600'}`}>
                    {result.message}
                  </p>
                </div>
              )}

              {!bookingBlocked && !result?.success && (
                <form onSubmit={handleBooking} className="space-y-4">

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tutor ID</label>
                      <input
                        readOnly
                        value={tutor._id}
                        className="w-full h-9 px-3 rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-400 outline-none truncate"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tutor Name</label>
                      <input
                        readOnly
                        value={tutor.tutorName}
                        className="w-full h-9 px-3 rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Student Name</label>
                    <input
                      readOnly
                      value={user?.name ?? ''}
                      className="w-full h-9 px-3 rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Your Email</label>
                    <input
                      readOnly
                      value={user?.email ?? ''}
                      className="w-full h-9 px-3 rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800
                          placeholder-gray-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                    <span>{totalSlots} slot{totalSlots !== 1 ? 's' : ''} available</span>
                    <span className="mx-1">·</span>
                    <span>Status will be set to <strong className="text-gray-600">Pending</strong></span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-purple-600
                      hover:bg-purple-700 active:scale-[0.98] text-white text-sm font-semibold
                      transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Confirming…
                      </>
                    ) : (
                      <>
                        <Calendar size={16} />
                        Confirm Booking
                      </>
                    )}
                  </button>

                </form>
              )}

              {result?.success && (
                <button
                  onClick={closeModal}
                  className="w-full h-11 mt-2 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Book;