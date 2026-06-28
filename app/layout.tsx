import type { Metadata } from "next";
import { Gamja_Flower } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AppContextProvider from "@/context/AppContext";

const gamja = Gamja_Flower({
  weight: "400",
});


export const metadata: Metadata = {
  title: "Zoey's Times",
  description: "A simple multiplication app for better focus and practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{
  return (
    <html
      lang="en"
      className={`${gamja.className} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">
        <AppContextProvider>
          <Navbar />
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
