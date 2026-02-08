import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Burning Star Journal",
    description: "Your personal food journal and recipe manager",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh">
            <body className="min-h-screen bg-bg-main text-text-main pb-20">{children}</body>
        </html>
    );
}
