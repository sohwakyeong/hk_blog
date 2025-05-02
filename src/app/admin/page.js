"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/common/Header";
import useUserStore from "@/app/stores/useUserStore";
import { showError, showSuccess } from "@/lib/toast";
import { FileText } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const darkMode = useUserStore((state) => state.darkMode);
  const isAdmin = useUserStore((state) => state.isAdmin);
  const user = useUserStore((state) => state.user);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  
    if (user === null) {
      showError("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      showError("접근 권한이 없습니다.");
      router.push("/");
    }
  }, [user, isAdmin, router]);


  useEffect(() => {
    async function fetchAllPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, created_at, author_id")
        .order("created_at", { ascending: false });

      if (error) {
        showError("게시글을 불러오는 데 실패했습니다.");
        setIsLoading(false);
        return;
      }

      const enriched = await Promise.all(
        data.map(async (post) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("nickname")
            .eq("id", post.author_id)
            .single();
          return {
            ...post,
            nickname: profile?.nickname || "익명",
          };
        })
      );

      setPosts(enriched);
      setIsLoading(false);
    }

    fetchAllPosts();
  }, []);

  if (user === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin dark:border-gray-600 dark:border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-[#111] text-[#eee]" : "bg-[#FAFAFA] text-[#111]"} min-h-screen`}>
      <Header titleSuffix="관리자Log" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className={`flex items-center gap-2 mb-6 ${darkMode ? "text-white" : "text-[#111]"}`}>
          <FileText className={`w-6 h-6 ${darkMode ? "text-white" : "text-gray-800"}`} />
          <h1 className="text-xl font-bold">게시글 전체 관리</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin dark:border-gray-600 dark:border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-400">게시글이 없습니다.</p>
        ) : (
          <div className="border-t border-gray-300">
            {posts.map((post) => (
              <div key={post.id} className="flex justify-between items-center py-4 border-b border-gray-200">
                <div className="space-y-1">
                  <p
                    className="text-base font-semibold cursor-pointer hover:underline"
                    onClick={() => router.push(`/post/${post.id}`)}
                  >
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.nickname} ·{" "}
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/post/${post.id}/edit`)}
                    className={`text-sm px-3 py-1 rounded-md border ${
                      darkMode
                        ? "border-gray-600 text-white hover:bg-[#2a2a2a]"
                        : "border-gray-300 text-black hover:bg-gray-100"
                    } transition-colors`}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-500 hover:bg-red-100"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  async function handleDelete(id) {
    const confirmDelete = window.confirm("정말 이 글을 삭제할까요?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      if (error.message.includes("permission denied")) {
        showError("작성자 또는 관리자만 삭제할 수 있습니다.");
      } else {
        showError("삭제에 실패했습니다.");
      }
      return;
    }

    setPosts((prev) => prev.filter((post) => post.id !== id));
    showSuccess("삭제 완료");
  }
}