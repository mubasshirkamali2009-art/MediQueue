"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

const TeacherPage = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/teachers")
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500 text-lg">No tutors found.</p>
      </div>
    );
  }

  return (
    <div>
        <Navbar></Navbar>
        <section className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Tutors</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
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
              <Link href={`/teachers/${tutor._id}`} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200">
                Book Now</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Footer></Footer>
    </div>
    
  );
};

export default TeacherPage;