import "./globals.css";
import { Toaster } from "react-hot-toast";
import InitUserProvider from "@/components/common/InitUserProvider";
import GlobalModalLayer from "@/components/common/GlobalModal";

export const metadata = {
  title: "WeLog",
  metadataBase: new URL("https://hk-blog-l4lu.vercel.app"),
  description: "블로그 서비스",
  openGraph: {
    title: "WeLog",
    description: "블로그 서비스",
    url: "https://hk-blog-l4lu.vercel.app",
    siteName: "WeLog",
    images: [
      {
        url: "https://hk-blog-l4lu.vercel.app/weLog.png",
        width: 1200,
        height: 630,
        alt: "WeLog 대표 이미지",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeLog",
    description: "블로그 서비스",
    images: ["https://hk-blog-l4lu.vercel.app/weLog.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <InitUserProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
          <GlobalModalLayer />
        </InitUserProvider>
      </body>
    </html>
  );
}
