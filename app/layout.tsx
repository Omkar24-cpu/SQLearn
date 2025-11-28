// app/layout.tsx
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { ReactNode } from "react";


export const metadata = {
  title: "Speech → SQL — Final Project",
  description: "Speak or type natural queries; server maps to safe SQL and returns results from a seeded SQLite DB.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Navbar />
        
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-gray-900 text-white py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Speech → SQL Final Project. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}