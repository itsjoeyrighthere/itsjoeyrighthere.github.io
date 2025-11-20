import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "JOEY",
  description: "A minimalist blog inspired by Virgil Abloh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black" suppressHydrationWarning>
        <Header />
        <main className="pt-20 pb-20 min-h-screen flex flex-col items-center justify-center px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
