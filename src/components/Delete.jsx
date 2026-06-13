"use client";

import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";

const Delete = ({ tutorId, tutorName, onDeleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/teachers/${tutorId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      toast.success(`${tutorName} has been removed.`);
      setIsOpen(false);
      onDeleted?.(tutorId); // notify parent to remove card from UI
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Delete Button ───────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-error btn-sm gap-2"
        aria-label={`Delete ${tutorName}`}
      >
        
        Delete
      </button>

      {/* ── Confirmation Modal ──────────────────────────────────────── */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-error/10 rounded-full p-4">
        <FaRegTrashAlt />
              </div>
            </div>

            {/* Text */}
            <h3 className="font-bold text-lg text-center">Delete Tutor?</h3>
            <p className="text-base-content/60 text-sm text-center mt-2 leading-relaxed">
              You are about to remove{" "}
              <span className="font-semibold text-base-content">{tutorName}</span>{" "}
              from the platform. This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="modal-action justify-center gap-3 mt-6">
              <button
                className="btn btn-ghost btn-sm min-w-24"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-sm min-w-24 gap-2"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <FaRegTrashAlt  className="text-base" />
                )}
                {loading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>

          </div>

          {/* Backdrop click to close */}
          <div className="modal-backdrop" onClick={() => !loading && setIsOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Delete;