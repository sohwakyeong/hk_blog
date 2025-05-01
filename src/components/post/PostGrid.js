"use client";

import PostCard from "./PostCard";
import { FileText } from "lucide-react";

export default function PostGrid({ posts, darkMode, user, onClickPost }) {
  if (!posts || posts.length === 0) {
    return (
      <div
        className={`flex justify-center items-center min-h-[50vh] sm:min-h-[70vh] ${
          darkMode ? "bg-[#111] text-gray-300" : "bg-[#FAFAFA] text-gray-600"
        }`}
      >
        <div className="flex flex-col justify-center items-center text-center">
          <FileText size={36} className="mb-3 opacity-40" />
          <p className="text-lg font-semibold mb-1">
            {user?.nickname || "사용자"}님
          </p>
          <p className="text-lg font-semibold mb-1">아직 작성한 글이 없어요</p>
          <p className="text-sm text-gray-400">첫 글을 게시해보세요 ✍️</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          darkMode={darkMode}
          onClick={() => onClickPost(post.id)}
        />
      ))}
    </div>
  );
}
