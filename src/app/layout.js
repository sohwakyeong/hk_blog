import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { createClientForServer } from '@/lib/server'

export default async function RootLayout({ children }) {
  const supabase = await createClientForServer()
  const { data } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
      <UserProvider initialUser={data?.user || null}>{children}</UserProvider>
      </body>
    </html>
  );
}
