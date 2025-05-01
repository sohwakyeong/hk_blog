"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [blogName, setBlogName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

  function sanitizeFilename(name) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_.-]/g, "");
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      let message = "";
      switch (error.message) {
        case "User already registered":
          message = "이미 가입된 이메일입니다.";
          break;
        case "Signup requires a valid password":
          message = "유효한 비밀번호를 입력해주세요.";
          break;
        case "Password should be at least 6 characters":
          message = "비밀번호는 최소 6자 이상이어야 합니다.";
          break;
        default:
          message = "회원가입 중 문제가 발생하였습니다. 잠시 후 다시 시도해주세요.";
      }
      setErrorMsg(message);
      return;
    }

    const user = data.user;

    let imageUrl = "";
    if (profileImage && user) {
      const ext = profileImage.type.split("/")[1];
      const safeName = `${Date.now()}_${sanitizeFilename(
        profileImage.name || "profile"
      )}`;
      const filePath = `profiles/${user.id}/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, profileImage);

      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }

    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email,
          nickname,
          blog_name: blogName,
          profile_url: imageUrl,
        },
      ]);

      if (profileError) {
        setErrorMsg("프로필 등록 중 문제가 발생하였습니다.");
        return;
      }
    }

    router.push("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md flex flex-col items-center"
      >
        <div className="w-full flex justify-center mb-6">
          <h1 className="text-xl font-bold text-[#111]">회원가입</h1>
        </div>

        <div className="flex justify-center mb-6">
          <label htmlFor="profileImage" className="cursor-pointer">
            <Image
              src={previewUrl || "/userprofile.png"}
              alt="프로필 이미지"
              width={120}
              height={120}
              className="rounded-md object-cover"
            />
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="w-full">
          <div className="mb-4">
            <label className="block text-[#222] text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] text-sm rounded-md px-4 py-2 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#222] text-sm font-medium mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] text-sm rounded-md px-4 py-2 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#222] text-sm font-medium mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] text-sm rounded-md px-4 py-2 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#222] text-sm font-medium mb-1">블로그 이름</label>
            <input
              type="text"
              value={blogName}
              onChange={(e) => setBlogName(e.target.value)}
              required
              className="w-full bg-[#F5F5F5] text-sm rounded-md px-4 py-2 outline-none"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white text-sm font-semibold py-2 rounded-md hover:bg-[#222] transition"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}
