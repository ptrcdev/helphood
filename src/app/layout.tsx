import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientQueryProvider from "@/components/ClientQueryProvider";
import { Toaster } from "@/components/ui/Toaster";
import { Toaster as Sonner } from "@/components/ui/Sonner";
import './globals.css';

import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { ProfileProvider } from "./context/ProfileContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HelpHood - Where Neighbors Help Neighbors",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientQueryProvider>
          <Toaster />
          <Sonner />
          <SessionProviderWrapper>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </SessionProviderWrapper>
        </ClientQueryProvider>
      </body>
    </html>
  );
}
