import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar"; // Import the new component
import { Footer } from "@/components/layout/Footer"; // Import the new component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Codelithlabs | Digital Infrastructure & R&D",
        template: "%s | Codelithlabs"
    },
    description: "A research and development collective focused on high-performance backend systems, game engine technologies, and scalable web infrastructure.",
    keywords: ["Software Engineering", "C++", "Next.js", "Backend", "Game Development", "Kokrajhar", "India"],
    authors: [{ name: "Codelithlabs Team" }],
    creator: "Codelithlabs",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://codelithlabs.in",
        title: "Codelithlabs | Architecting the Future",
        description: "Research. Development. Deployment.",
        siteName: "Codelithlabs",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} antialiased selection:bg-blue-500/30 bg-[#0a0a0a]`}>
                <Navbar />
                <div className="pt-16"> {/* Add padding so content doesn't hide behind Navbar */}
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}