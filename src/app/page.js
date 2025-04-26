import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data,error } = await supabase.from("test").select("*");

  console.log("Supabase 데이터:", data);
  console.log("Supabase 에러:",error);

  return(
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">
        {error && <p className="text-red-500 mt-4">Supabase 연결 에러 발생</p>}
        {data && <p className="text-blue-500 mt-4">Supabase 연결 성공</p>}
      </h1>
    </main>
  )
}