"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/lib/toast";
import TuiEditor from "@/components/common/TuiEditor";
import useUserStore from "@/app/stores/useUserStore";
import BackButton from "@/components/common/BackButton";

export default function PostWritePage() {
  const router = useRouter();
  const editorRef = useRef();
  const user = useUserStore((state) => state.user);
  const darkMode = useUserStore((state) => state.darkMode);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

  const categories = [
    "TravelLog",
    "StudyLog",
    "ReviewLog",
    "RecipeLog",
    "HealthLog",
    "EmotionLog",
  ];

  useEffect(() => {
    if (!user) {
      showError("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [user, router]);

  function sanitizeFilename(name) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_.-]/g, "");
  }

  async function handleSubmit() {
    if (!title.trim()) return showError("제목을 입력하세요.");
    if (!category) return showError("카테고리를 선택하세요.");
    const markdown = editorRef.current?.getInstance().getMarkdown();
    const html = editorRef.current?.getInstance().getHTML();
    if (!markdown.trim()) return showError("내용을 입력하세요.");

    const imgMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*>/);
    const firstImageUrl = imgMatch?.[1] || null;

    const tempEl = document.createElement("div");
    tempEl.innerHTML = html;
    let summary =
      tempEl.textContent?.replace(/\s+/g, " ").trim().slice(0, 100) ||
      "요약 내용이 없습니다.";

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title,
            content: markdown,
            summary,
            thumbnail_url: firstImageUrl,
            author_id: user.id,
            category,
          },
        ])
        .select();

      if (error) throw new Error("글 저장 실패!");
      showSuccess("글 작성 완료!");
      router.push(`/post/${data[0].id}`);
    } catch (err) {
      showError(err.message);
    }
  }

  return (
    <div
      className={`${
        darkMode ? "bg-[#111] text-[#eee]" : "bg-[#FAFAFA] text-[#111]"
      } min-h-screen`}
    >
      <div className="flex flex-col max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              darkMode
                ? "bg-white text-black hover:bg-[#ddd]"
                : "bg-black text-white hover:bg-[#333]"
            }`}
          >
            출간하기
          </button>
        </div>

        <input
          type="text"
          placeholder="제목을 입력하세요."
          className="w-full text-5xl font-bold mb-4 outline-none bg-transparent placeholder-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="relative w-[160px] mb-6 select-none">
          <div
            className={`text-sm font-semibold py-2 px-3 border border-gray-300 rounded cursor-pointer ${
              darkMode ? "bg-[#2a2a2a] text-white" : "bg-transparent text-black"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {category || "Select category"}
            <span
              className={`float-right transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>
          {isOpen && (
            <ul
              className={`absolute left-0 w-full mt-1 rounded-sm shadow-md z-50 border border-gray-200 ${
                darkMode ? "bg-[#2a2a2a] text-white" : "bg-white text-black"
              }`}
            >
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`px-3 py-2 text-sm cursor-pointer ${
                    darkMode ? "hover:bg-[#3a3a3a]" : "hover:bg-[#f5f5f5]"
                  } ${category === cat ? "font-semibold" : ""}`}
                  onClick={() => {
                    setCategory(cat);
                    setIsOpen(false);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow-sm mt-5">
          <TuiEditor
            ref={editorRef}
            initialValue="새로운 글을 작성해보세요."
            previewStyle="vertical"
            height="400px"
            initialEditType="markdown"
            hideModeSwitch={true}
            useCommandShortcut={true}
            hooks={{
              addImageBlobHook: async (blob, callback) => {
                const ext = blob.type.split("/")[1];
                const safeName = `${Date.now()}_${sanitizeFilename(
                  blob.name || "image"
                )}`;

                const { data, error } = await supabase.storage
                  .from(bucket)
                  .upload(safeName, blob);

                if (error) {
                  showError("에디터 이미지 업로드 실패");
                  return;
                }

                const url = supabase.storage.from(bucket).getPublicUrl(safeName)
                  .data.publicUrl;
                callback(url, safeName);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
