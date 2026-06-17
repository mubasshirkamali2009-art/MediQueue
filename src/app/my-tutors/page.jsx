"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";

const MyTutors = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/singin");
    }
  }, [isPending, session, router]);

  // Fetch tutors created by this user (uses existing GET /teachers?email= filter)
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/teachers?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        setTutors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch my tutors:", err);
        setLoading(false);
      });
  }, [user?.email]);

  // Called by Edit component after a successful PUT — updates the row in place, no reload
  const handleUpdated = (updatedTutor) => {
    setTutors((prev) =>
      prev.map((t) => (t._id === updatedTutor._id ? updatedTutor : t))
    );
  };

  // Called by Delete component after a successful DELETE — removes the row, no reload
  const handleDeleted = (deletedId) => {
    setTutors((prev) => prev.filter((t) => t._id !== deletedId));
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
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tutors</h2>

      {tutors.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <p className="text-gray-500 text-lg font-medium">
            You haven&apos;t added any tutors yet.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Tutors you create will show up here for you to manage.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Slots</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tutors.map((tutor) => (
                <tr key={tutor._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {tutor.tutorName}
                  </td>
                  <td className="px-4 py-3 text-blue-600">{tutor.subject}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        tutor.teachingMode === "Online"
                          ? "bg-green-100 text-green-700"
                          : tutor.teachingMode === "Offline"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {tutor.teachingMode}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">৳{tutor.hourlyFee}/hr</td>
                  <td className="px-4 py-3">{tutor.totalSlots}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">
                    {tutor.selectedDays?.join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Edit teacher={tutor} onUpdated={handleUpdated} />
                      <Delete
                        tutorId={tutor._id}
                        tutorName={tutor.tutorName}
                        onDeleted={handleDeleted}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyTutors;