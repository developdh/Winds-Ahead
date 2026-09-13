import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Winds Ahead · 연운경",
  description:
    "Explore Where Winds Meet cosmetics and evidence-based global release information. 연운 중국 서버 외관과 글로벌 출시 정보를 확인하세요.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
