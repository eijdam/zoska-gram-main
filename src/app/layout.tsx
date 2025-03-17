// src/app/layout.tsx

import { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import AuthProvider from "../components/AuthProvider";
import ThemeProvider from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "SnapZoška",
  description: "Created by me"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '48px' }}>
              <main style={{ flexGrow: 1 }}>
                {children}
              </main>
              <NavBar />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}