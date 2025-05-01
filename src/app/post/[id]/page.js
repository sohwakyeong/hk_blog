"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/lib/toast";
import PostHeader from "@/components/post/PostHeader";
import PostContent from "@/components/post/PostContent";
import PostFooter from "@/components/post/PostFooter";
import Header from "@/components/common/Header";
import useUserStore from "@/app/stores/useUserStore";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const darkMode = useUserStore((state) => state.darkMode);

  const [post, setPost] = useState(null);
  const [authorId, setAuthorId] = useState(null);
  const [authorNickname, setAuthorNickname] = useState(null);
  const [authorBlogName, setAuthorBlogName] = useState(null);

  useEffect(() => {
    async function fetchPostAndAuthor() {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (postError || !postData) {
        showError("게시글을 불러오지 못했습니다.");
        return;
      }

      setPost(postData);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, nickname, blog_name")
        .eq("id", postData.author_id)
        .single();

      if (profileError || !profile) {
        console.error("작성자 정보 불러오기 실패");
        return;
      }

      setAuthorId(profile.id);
      setAuthorNickname(profile.nickname);
      setAuthorBlogName(profile.blog_name || profile.nickname);
    }

    fetchPostAndAuthor();
  }, [id]);

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin dark:border-gray-600 dark:border-t-transparent" />
      </div>
    );
  }

  const createdDate = new Date(post.created_at).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleDelete() {
    const confirmDelete = window.confirm("정말 이 글을 삭제할까요?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      showError("글 삭제에 실패했습니다.");
      return;
    }

    showSuccess("글이 삭제되었습니다!");
    router.push("/");
  }

  function handleEdit() {
    router.push(`/post/${id}/edit`);
  }

  return (
    <div
      className={`${
        darkMode ? "bg-[#111] text-[#eee]" : "bg-[#FAFAFA] text-[#111]"
      }`}
    >
      {authorId && (
        <Header titleSuffix={authorBlogName} blogOwnerId={authorId} />
      )}
      <div className="flex flex-col max-w-4xl mx-auto min-h-screen py-12 px-4">
        <PostHeader
          title={post.title}
          author={authorNickname}
          createdDate={createdDate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          darkMode={darkMode}
        />
        <PostContent content={post.content} />
        <PostFooter author={authorNickname} />
      </div>
    </div>
  );
}
