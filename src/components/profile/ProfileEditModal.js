"use client";

import { useEffect, useRef } from "react";
import EditProfileForm from "./EditProfileForm";

export default function ProfileEditModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-white/60 flex items-center justify-center z-50"
    >
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-6 text-black">프로필 수정</h2>
        <EditProfileForm onClose={onClose} />
      </div>
    </div>
  );
}
