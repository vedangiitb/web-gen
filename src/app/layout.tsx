import { AuthProvider } from "@/components/auth/AuthContext";
import type { Metadata } from "next";
import {
  Courier_Prime,
  Geist,
  Geist_Mono,
  Handlee,
  Inter,
  Libre_Baskerville,
  Lora,
  Montserrat,
  Nunito,
  Nunito_Sans,
  Open_Sans,
  Orbitron,
  Playfair_Display,
  Roboto,
  Roboto_Mono,
  Work_Sans,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const handlee = Handlee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handlee",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-courier-prime",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Web Gen",
  description: "Create Websites in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`
    ${geistSans.variable} 
    ${geistMono.variable} 
    ${inter.variable} 
    ${roboto.variable} 
    ${nunito.variable} 
    ${handlee.variable} 
    ${libreBaskerville.variable} 
    ${workSans.variable} 
    ${playfairDisplay.variable} 
    ${lora.variable} 
    ${nunitoSans.variable} 
    ${openSans.variable} 
    ${orbitron.variable} 
    ${robotoMono.variable} 
    ${courierPrime.variable} 
    ${montserrat.variable}
    antialiased
  `}
        >
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
