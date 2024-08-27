import "./globals.css";
import type { Metadata } from "next";
import { Roboto, Merriweather_Sans } from "next/font/google";
import 'leaflet/dist/leaflet.css';

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const merriweatherSans = Merriweather_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trekko",
  description: "Outdoor Acitivities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
