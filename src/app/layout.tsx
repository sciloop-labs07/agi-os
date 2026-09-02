import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGI Research OS",
  description: "Structured intelligence platform for AI paradigm research, comparison, execution, and forecasting."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
