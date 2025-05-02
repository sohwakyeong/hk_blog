"use client";

import { Pencil, Trash2 } from "lucide-react";

export default function PostHeader({
  title,
  author,
  createdDate,
  category,
  onEdit,
  onDelete,
  darkMode,
  canEdit,
}) {
  const hoverEditClass = darkMode
    ? "hover:text-gray-300"
    : "hover:text-black";
  const hoverDeleteClass = darkMode
    ? "hover:text-red-400"
    : "hover:text-black";

  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold mb-3 leading-snug break-words">{title}</h1>

      <div className="flex justify-between items-center text-sm text-gray-500 flex-wrap gap-y-2">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="font-semibold">{author || "작성자 없음"}</span>
          <span>·</span>
          <span>{createdDate}</span>

          {category && (
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                darkMode
                  ? "bg-[#2a2a2a] text-white border border-gray-600"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
            >
              #{category}
            </span>
          )}
        </div>

        {canEdit && (
          <div className="flex gap-3 sm:gap-2 max-sm:gap-2 max-sm:mt-1 whitespace-nowrap">
            <button
              onClick={onEdit}
              className={`${hoverEditClass} transition-colors flex items-center gap-1`}
            >
              <span className="hidden sm:inline">수정</span>
              <Pencil size={18} className="sm:hidden" />
            </button>
            <button
              onClick={onDelete}
              className={`${hoverDeleteClass} transition-colors flex items-center gap-1`}
            >
              <span className="hidden sm:inline">삭제</span>
              <Trash2 size={18} className="sm:hidden" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
