import { inter } from "@/app/ui/fonts";
import "@/styles/global.scss";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Next.js Advanced Todo",
  description: "A feature-rich todo app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {children}
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
