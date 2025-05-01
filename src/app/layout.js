import "./globals.css";
import { Toaster } from "react-hot-toast";
import InitUserProvider from "@/components/common/InitUserProvider";
import GlobalModalLayer from "@/components/common/GlobalModal";
import Head from "next/head";

export const metadata = {
  metadataBase: new URL("https://hk-blog-l4lu.vercel.app"),
  description: "블로그 서비스",
  openGraph: {
    title: "WeLog",
    description: "블로그 서비스",
    images: [
      {
        url: "https://hk-blog-l4lu.vercel.app/weLog.png",
        width: 1200,
        height: 630,
        alt: "WeLog 대표 이미지",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <Head>
        <title>WeLog</title>
        <meta property="og:title" content="WeLog" />
        <meta property="og:description" content="블로그 서비스" />
        <meta property="og:image" content="https://hk-blog-l4lu.vercel.app/weLog.png" />
        <meta property="og:url" content="https://hk-blog-l4lu.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
