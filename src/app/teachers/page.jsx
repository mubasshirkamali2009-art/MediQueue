"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // <-- adjust this path to your project

const TeacherList = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  // 🔧 read ?subject=... from the URL (set when clicking a category card on home page)
  const subjectFilter = searchParams.get("subject");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/teachers`)
      .then((res) => res.json())
      .then((data) => {
        setTutors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tutors:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/singin");
    }
  }, [isPending, session, router]);

  // 🔧 filter tutors by subject (case-insensitive) if a subject param is present in the URL
  const filteredTutors = subjectFilter
    ? tutors.filter(
        (t) => t.subject?.toLowerCase() === subjectFilter.toLowerCase()
      )
    : tutors;

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
    <div>
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-800">
            {/* 🔧 heading reflects active filter */}
            {subjectFilter ? `${subjectFilter} Tutors` : "All Tutors"}
          </h2>

          {/* 🔧 simple "clear filter" link, only shows when a subject filter is active */}
          {subjectFilter && (
            <Link
              href="/teachers"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
            >
              Clear filter — show all tutors
            </Link>
          )}
        </div>

        {filteredTutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <p className="text-gray-500 text-lg font-medium">
              {subjectFilter
                ? `No tutors found for "${subjectFilter}".`
                : "No tutors found."}
            </p>
            {subjectFilter && (
              <Link href="/teachers" className="text-blue-600 text-sm mt-2 underline">
                View all tutors instead
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div
                key={tutor._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {/* Photo */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={tutor.photoUrl}
                    alt={tutor.tutorName}
                    className="w-full h-full object-cover"
                  />
                  {/* Teaching Mode Badge */}
                  <span
                    className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      tutor.teachingMode === "Online"
                        ? "bg-green-100 text-green-700"
                        : tutor.teachingMode === "Offline"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {tutor.teachingMode}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Name & Subject */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {tutor.tutorName}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      {tutor.subject}
                    </p>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-100" />

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span>🕐</span>
                      <span className="truncate">
                        {tutor.timeFrom} – {tutor.timeTo}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>📅</span>
                      <span>{tutor.selectedDays?.join(", ")}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>💰</span>
                      <span>৳{tutor.hourlyFee}/hr</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>🪑</span>
                      <span>{tutor.totalSlots} slots</span>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2">
                      <span>📍</span>
                      <span className="truncate">{tutor.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2">
                      <span>🏫</span>
                      <span className="truncate">{tutor.institution}</span>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2">
                      <span>📆</span>
                      <span>Start: {tutor.startDate}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/teachers/${tutor._id}`}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 block text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const TeacherPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <TeacherList />
    </Suspense>
  );
};

export default TeacherPage;