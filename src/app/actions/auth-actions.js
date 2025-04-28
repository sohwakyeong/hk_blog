"use server";

import { createClientForServer } from "@/lib/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google OAuth Error:", error.message);
    throw new Error("OAuth 로그인 실패");
  }

  redirect(data.url);
}
