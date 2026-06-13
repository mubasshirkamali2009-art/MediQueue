"use client";

import { useRouter } from "next/navigation";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { PiBookOpenLight } from "react-icons/pi";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-8"
      style={{ background: "linear-gradient(160deg, #0f0c2e 0%, #2d2880 55%, #4f46e5 100%)" }}
    >
      {/* Orbs */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 300, height: 300, background: "#818cf8", opacity: 0.08, top: -80, right: -60 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 200, height: 200, background: "#f59e0b", opacity: 0.08, bottom: 20, left: -40 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 120, height: 120, background: "#a5b4fc", opacity: 0.08, bottom: 100, right: "10%" }} />

      {/* Floating icons */}
      {[
        { icon: "⚛", top: "18%", left: "8%",   delay: "0s",   size: 24 },
        { icon: "∑",  top: "30%", right: "10%", delay: "0.8s", size: 20 },
        { icon: "∞",  bottom: "30%", left: "12%", delay: "1.2s", size: 18 },
        { icon: "◎",  bottom: "22%", right: "14%", delay: "0.4s", size: 22 },
      ].map((item, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            opacity: 0.15,
            fontSize: item.size,
            color: "white",
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            animation: `float 4s ease-in-out ${item.delay} infinite`,
          }}
        >
          {item.icon}
        </span>
      ))}

      {/* Center content */}
      <div className="text-center z-10 max-w-lg w-full">

        {/* Animated book icon */}
        <div className="flex justify-center mb-5" style={{ animation: "float 3s ease-in-out infinite" }}>
          <div className="relative">
            <PiBookOpenLight size={64} color="rgba(255,255,255,0.75)" />
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#f59e0b", color: "#0f0c2e", fontSize: 11 }}
            >
              !
            </span>
          </div>
        </div>

        {/* Badge */}
        <span
          className="inline-block text-[11px] font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#a5b4fc",
          }}
        >
          Page not found
        </span>

        {/* 404 */}
        <div
          className="font-extrabold leading-none mb-2 select-none"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(80px, 18vw, 140px)",
            letterSpacing: -4,
            color: "white",
          }}
        >
          4<span style={{ color: "#f59e0b" }}>0</span>4
        </div>

        <h1
          className="font-bold text-white mb-3"
          style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(20px, 4vw, 28px)" }}
        >
          Looks like this page went missing
        </h1>

        <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
          The page you&apos;re looking for doesn&apos;t exist or was moved.
          <br />
          Let&apos;s get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: "#f59e0b", color: "#0f0c2e", border: "none" }}
          >
            <FiHome size={16} />
            Home
          </button>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
            }}
          >
            <FiArrowLeft size={16} />
            Go back
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}