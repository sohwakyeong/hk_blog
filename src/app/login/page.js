"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useUserStore from "@/app/stores/useUserStore";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUser = useUserStore((state) => state.fetchUser);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message =
        error.message === "Invalid login credentials"
          ? "아이디나 비밀번호를 다시 확인해주세요."
          : "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      setErrorMsg(message);
      return;
    }

    await fetchUser();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center text-[#111]">로그인</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#222] text-sm font-medium mb-1">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] text-[#111] text-sm rounded-md px-4 py-2 
                         outline-none focus:outline-none focus:ring-0 focus:border-[#F5F5F5]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#222] text-sm font-medium mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] text-[#111] text-sm rounded-md px-4 py-2 
                         outline-none focus:outline-none focus:ring-0 focus:border-[#F5F5F5]"
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white text-sm font-semibold py-2 rounded-md hover:bg-[#222] transition mb-6"
          >
            로그인
          </button>
        </form>

        <div className="text-center text-sm text-[#666]">
          아직 회원이 아니신가요?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-[#111] font-medium"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
