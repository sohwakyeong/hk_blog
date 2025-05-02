"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { showError, showSuccess } from "@/lib/toast";
import useUserStore from "@/app/stores/useUserStore";

export default function CommentContent() {
  const { id: postId } = useParams();
  const user = useUserStore((state) => state.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(
          "id, author_id, content, created_at, profiles(id, nickname, profile_url)"
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        showError("댓글 불러오기 실패");
        return;
      }

      setComments(data);
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      showError("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        author_id: user.id,
        content: newComment.trim(),
      },
    ]);

    if (error) {
      showError("댓글 등록 실패");
      return;
    }

    setNewComment("");
    showSuccess("댓글이 등록되었습니다!");
    refreshComments();
  };

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm("정말 이 댓글을 삭제할까요?");
    if (!confirmDelete) return;

    const { error, count } = await supabase
      .from("comments")
      .delete({ count: "exact" })
      .eq("id", commentId);

    if (error || count === 0) {
      showError("댓글 삭제에 실패했거나 권한이 없습니다.");
      return;
    }

    showSuccess("댓글이 삭제되었습니다!");
    refreshComments();
  };

  const refreshComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(
        "id, author_id, content, created_at, profiles(id, nickname, profile_url)"
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!error) setComments(data);
  };

  return (
    <div className="bg-white text-[#111] border border-gray-200 rounded-md p-6">
      <h3 className="text-lg font-semibold mb-4">💬 댓글</h3>

      <div className="space-y-6 mb-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">아직 댓글이 없어요.</p>
        )}
        {comments.map((comment) => {
          const isMine =
            user?.id === comment.profiles?.id || user?.id === comment.author_id;
          return (
            <div key={comment.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3 mb-1">
                {comment.profiles?.profile_url ? (
                  <Image
                    src={comment.profiles.profile_url}
                    alt="profile"
                    width={32}
                    height={32}
                    className="w-8 h-8 aspect-square rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 aspect-square rounded-full bg-gray-200" />
                )}
                <span className="text-sm font-semibold">
                  {comment.profiles?.nickname || "익명"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {isMine && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="ml-auto text-xs text-red-500"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          );
        })}
      </div>

      {user ? (
        <div>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white text-black p-3 text-sm resize-none focus:outline-none"
            rows={3}
            placeholder="댓글을 입력해주세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="mt-2 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
            >
              작성하기
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          ✨ 댓글을 작성하려면 로그인해주세요!
        </p>
      )}
    </div>
  );
}
