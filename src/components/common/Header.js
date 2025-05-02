"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sun, Moon, MoreVertical } from "lucide-react";
import useUserStore from "@/app/stores/useUserStore";
import useModalStore from "@/app/stores/useModalStore";
import Image from "next/image";

export default function Header({ titleSuffix = "", blogOwnerId }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isAdmin = useUserStore((state) => state.isAdmin);
  const darkMode = useUserStore((state) => state.darkMode);
  const setDarkMode = useUserStore((state) => state.setDarkMode);
  const logout = useUserStore((state) => state.logout);
  const openProfileModal = useModalStore((state) => state.openProfileModal);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`border-b transition ${
        darkMode ? "bg-[#111] border-[#333]" : "bg-[#FAFAFA] border-[#E5E5E5]"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center py-4">
        <div className="flex items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span
              className={`text-2xl font-extrabold tracking-wide ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              WeLog
            </span>
          </div>

          {titleSuffix && blogOwnerId && (
            <span
              className={`text-2xl font-semibold tracking-wide cursor-pointer ${
                darkMode ? "text-white" : "text-black"
              } hover:text-gray-500`}
              onClick={() => router.push(`/blog/${blogOwnerId}`)}
            >
              .{titleSuffix}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Search
            className={`w-5 h-5 cursor-pointer ${
              darkMode ? "text-white" : "text-gray-700"
            }`}
            onClick={() => router.push("/search")}
          />

          {darkMode ? (
            <Sun
              className="w-5 h-5 cursor-pointer text-white"
              onClick={() => setDarkMode(false)}
            />
          ) : (
            <Moon
              className="w-5 h-5 cursor-pointer text-gray-700"
              onClick={() => setDarkMode(true)}
            />
          )}

          {user ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Image
                  src={user?.profile_url || "/userbasicimg.png"}
                  alt="내 프로필"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <MoreVertical
                  className={`w-4 h-4 ${
                    darkMode ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>

              {menuOpen && (
                <ul className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-sm text-sm z-50 border border-gray-200 text-black">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/blog/${user.id}`)}
                  >
                    내 블로그
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setMenuOpen(false);
                      openProfileModal();
                    }}
                  >
                    내 프로필
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push("/post/write")}
                  >
                    글쓰기
                  </li>
                  {isAdmin && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => router.push("/admin")}
                    >
                      관리자
                    </li>
                  )}
                  <li
                    className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    onClick={async () => {
                      await logout();
                      setMenuOpen(false);
                      router.push("/");
                    }}
                  >
                    로그아웃
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <button
              className={`text-sm ${darkMode ? "text-white" : "text-gray-700"}`}
              onClick={() => router.push("/login")}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
