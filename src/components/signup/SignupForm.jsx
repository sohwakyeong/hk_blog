"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [blogName, setBlogName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email,
          nickname,
          blog_name: blogName,
        },
      ]);

      if (profileError) {
        setErrorMsg(profileError.message);
        return;
      }
    }
    router.push("/login");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <form
      onSubmit={handleSignup}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">블로그 이름</label>
        <input
          type="text"
          value={blogName}
          onChange={(e) => setBlogName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 font-semibold text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        회원가입
      </button>
    </form>
    </div>
  );
}
