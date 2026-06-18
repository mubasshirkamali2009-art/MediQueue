"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { X, AlertTriangle, Loader2 } from "lucide-react";

const MyBookingPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirmation modal state for cancel
  const [cancelTarget, setCancelTarget] = useState(null); // booking object or null
  const [cancelling, setCancelling] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/singin");
    }
  }, [isPending, session, router]);

  // Fetch bookings for this user only
  // NOTE: this calls the new GET /bookings/user/:email route (see server-additions.js)
  useEffect(() => {
    if (!user?.email) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/user/${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch my bookings:", err);
        setLoading(false);
      });
  }, [user?.email]);

  const openCancelModal = (booking) => setCancelTarget(booking);
  const closeCancelModal = () => {
    if (cancelling) return;
    setCancelTarget(null);
  };

  // NOTE: this calls the new PATCH /bookings/:id/cancel route (see server-additions.js)
  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${cancelTarget._id}/cancel`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error();

      // Update in place, no reload
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelTarget._id ? { ...b, bookStatus: "cancelled" } : b
        )
      );
      setCancelTarget(null);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    } finally {
      setCancelling(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0b1623] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5ba3d9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0b1623] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5ba3d9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        My Booked Sessions
      </h2>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] text-center px-4">
          <p className="text-gray-500 text-base sm:text-lg font-medium">
            You haven&apos;t booked any sessions yet.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Sessions you book with a tutor will show up here.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile / small screens: card list (hidden on md and up) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {bookings.map((booking) => {
              const isCancelled = booking.bookStatus === "cancelled";
              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-gray-100 shadow-sm p-4 bg-white"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {booking.tutorName}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Student: {booking.studentName}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isCancelled
                          ? "bg-red-100 text-red-600"
                          : booking.bookStatus === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {booking.bookStatus}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs truncate mb-3">
                    {booking.userEmail}
                  </p>
                  <button
                    onClick={() => openCancelModal(booking)}
                    disabled={isCancelled}
                    className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCancelled ? "Cancelled" : "Cancel"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Tablet and up: table layout */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">Tutor Name</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => {
                  const isCancelled = booking.bookStatus === "cancelled";
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                        {booking.tutorName}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{booking.studentName}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                        {booking.userEmail}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            isCancelled
                              ? "bg-red-100 text-red-600"
                              : booking.bookStatus === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {booking.bookStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openCancelModal(booking)}
                          disabled={isCancelled}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {isCancelled ? "Cancelled" : "Cancel"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeCancelModal(); }}
        >
          <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Cancel Booking?
              </h2>
              <button
                onClick={closeCancelModal}
                disabled={cancelling}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-700">
                  You&apos;re about to cancel your session with{" "}
                  <span className="font-semibold">{cancelTarget.tutorName}</span>.
                  This cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeCancelModal}
                  disabled={cancelling}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {cancelling ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Cancelling…
                    </>
                  ) : (
                    "Yes, Cancel"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyBookingPage;