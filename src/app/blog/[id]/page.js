'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ useParams 추가
import { supabase } from "@/lib/supabaseClient";
import useUserStore from "@/app/stores/useUserStore";
import useModalStore from "@/app/stores/useModalStore";
import Header from "@/components/common/Header";
import PostGrid from "@/components/post/PostGrid";

export default function MyBlogPage() {
  const { id } = useParams(); // ✅ 여기에서 URL의 blog 주인 id 가져오기
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const darkMode = useUserStore((state) => state.darkMode);
  const openProfileModal = useModalStore((state) => state.openProfileModal);

  const [posts, setPosts] = useState([]);
  const [blogOwner, setBlogOwner] = useState(null); // 🔥 블로그 주인 정보 저장

  useEffect(() => {
    const fetchUserPosts = async () => {
      const { data: userPosts } = await supabase
        .from("posts")
        .select("id, title, summary, thumbnail_url, created_at")
        .eq("author_id", id)
        .order("created_at", { ascending: false });

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, nickname, blog_name, profile_url")
        .eq("id", id)
        .single();

      const enriched =
        userPosts?.map((p) => ({
          ...p,
          nickname: profile?.nickname || "익명",
          profile_url: profile?.profile_url || "/userbasicimg.png",
        })) || [];

      setBlogOwner(profile);
      setPosts(enriched);
    };

    if (id) fetchUserPosts();
  }, [id]);

  return (
    <div
      className={`${
        darkMode ? "bg-[#111] text-[#F5F5F5]" : "bg-[#FAFAFA] text-[#111]"
      } min-h-screen transition-colors duration-300`}
    >
      <Header
        titleSuffix={blogOwner?.blog_name || blogOwner?.nickname || "블로그"}
        blogOwnerId={id}
        onOpenProfileModal={openProfileModal}
      />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <PostGrid
          posts={posts}
          darkMode={darkMode}
          user={user}
          onClickPost={(postId) => router.push(`/post/${postId}`)}
        />
      </div>
    </div>
  );
}
