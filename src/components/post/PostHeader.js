"use client";

export default function PostHeader({
  title,
  author,
  createdDate,
  onEdit,
  onDelete,
  darkMode,
}) {
  const hoverEditClass = darkMode
    ? "hover:text-gray-300"
    : "hover:text-black";
  const hoverDeleteClass = darkMode
    ? "hover:text-red-400"
    : "hover:text-black";

  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold mb-3 leading-snug">{title}</h1>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex gap-2 items-center">
          <span className="font-semibold">{author || "작성자 없음"}</span>
          <span>·</span>
          <span>{createdDate}</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onEdit} className={`${hoverEditClass} transition-colors`}>
            수정
          </button>
          <button onClick={onDelete} className={`${hoverDeleteClass} transition-colors`}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
