import type { Metadata, Viewport } from "next";
import "./globals.css";
import WelcomeWrapper from "@/components/WelcomeWrapper";

export const metadata: Metadata = {
    title: "Burning Star Journal",
    description: "Your personal food journal and recipe manager",
    manifest: "/manifest.webmanifest",
    themeColor: "#fda4af",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "燃星日志",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh">
            {/* Added select-none to prevent text selection like a native app */}
            <body className="min-h-screen bg-bg-main text-text-main pb-20 select-none touch-none-action">
                <WelcomeWrapper>
                    {children}
                </WelcomeWrapper>
            </body>
        </html>
    );
}
