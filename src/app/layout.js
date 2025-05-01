import "./globals.css";
import { Toaster } from "react-hot-toast";
import InitUserProvider from "@/components/common/InitUserProvider";
import GlobalModalLayer from "@/components/common/GlobalModal";

export const metadata = {
  metadataBase: new URL("http://localhost:3000/"),
  description: "블로그 서비스",
  openGraph: {
    title: "WeLog",
    description: "블로그 서비스",
    images: [
      {
        url: "/weLog.png",
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
