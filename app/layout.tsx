import type { Metadata } from "next";
import "./globals.css";

// Metadata para SEO
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fonte Inter do Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}


