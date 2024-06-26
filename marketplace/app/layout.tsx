import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "./lib/config";
import Web3ModalProvider from "./context/Web3ModalProvider";
import Header from "./ui/Header";
import Footer from "./ui/Footer";

export const metadata: Metadata = {
  title: "Nero | Marketplace",
  description: "Marketplace UI for Nero",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className="bg-gradient-radial from-accent to-secondary text-primary-light">
        <Web3ModalProvider>
          <main className="flex-grow">
            <Header />
            {children}
          </main>
          <Footer />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
