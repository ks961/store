import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "@/contexts/ClientProviders";

const inter = Inter({
  weight: ["200", "400", "600", "800"],
  subsets: ["latin"]
})
export const metadata: Metadata = {
  title: "Store Rating App",
  description: "Created By Sudhanshu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} antialiased bg-background text-text h-full w-full overflow-y-hidden`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
