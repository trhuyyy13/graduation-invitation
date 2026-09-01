import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond, Alex_Brush } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  style: ["italic", "normal"],
  variable: "--font-cormorant",
  display: "swap",
});

const scriptFont = Alex_Brush({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lễ Tốt Nghiệp Huy Trần — HUST 2026",
  description:
    "Thân mời bạn đến tham dự lễ tốt nghiệp của Huy Trần, Đại học Bách khoa Hà Nội, 26.09.2026.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8B1E1E",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} ${scriptFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
