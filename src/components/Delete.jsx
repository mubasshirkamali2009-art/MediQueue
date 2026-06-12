"use client";
import { useState } from "react";
import { TriangleAlert, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function Delete({ tutorId }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
const handleDeleteBtn = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/teachers/${tutorId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Delete failed");

      setOpen(false);
      router.push("/teachers");
    } catch (err) {
      console.error("Delete failed:", err);
      setOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl font-semibold text-sm bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200 shrink-0"
      >
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <TriangleAlert size={18} className="text-red-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-base">Delete teacher?</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-5 pb-5">
              <p className="text-sm text-gray-500 mb-5">
                This action cannot be undone. All data will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Keep Teacher
                </button>
                <button
                  onClick={handleDeleteBtn}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleting
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting…</>
                    : "Delete Forever"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}