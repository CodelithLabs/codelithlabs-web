import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "CodelithLabs - Free Online Tools Platform | 40+ Developer & Productivity Tools",
        template: "%s | CodelithLabs"
    },
    description: "CodelithLabs offers 40+ free online tools for developers, designers, and content creators. JSON formatter, image compressor, password generator, and more. 100% client-side processing for maximum privacy.",
    keywords: [
        "free online tools",
        "developer tools",
        "json formatter",
        "image compressor",
        "password generator",
        "base64 encoder",
        "text tools",
        "productivity tools",
        "codelithlabs",
        "clients-side tools",
        "privacy-first",
        "web utilities"
    ],
    authors: [{ name: "CodelithLabs Team" }],
    creator: "CodelithLabs",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://codelithlabs.in",
        title: "CodelithLabs - Free Online Tools Platform",
        description: "40+ free online tools with client-side processing. JSON formatter, image compressor, password generator, and more.",
        siteName: "CodelithLabs",
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

                {/* Organization Schema Markup for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "CodelithLabs",
                            "url": "https://codelithlabs.in",
                            "logo": "https://codelithlabs.in/icon.png",
                            "description": "Free online tools platform with 50+ utilities for developers, designers, and content creators",
                            "founders": [
                                {
                                    "@type": "Person",
                                    "name": "Prasanta Ray",
                                    "jobTitle": "Founder & CEO"
                                },
                                {
                                    "@type": "Person",
                                    "name": "Donbil Mwshary",
                                    "jobTitle": "Co-Founder & CTO"
                                }
                            ],
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Kokrajhar",
                                "addressRegion": "Assam",
                                "addressCountry": "IN"
                            },
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "email": "contact@codelithlabs.in",
                                "contactType": "Customer Service"
                            },
                            "sameAs": [
                                "https://github.com/codelithlabs"
                            ]
                        })
                    }}
                />

                <Navbar />
                <div className="pt-16"> {/* Add padding so content doesn't hide behind Navbar */}
                    {children}
                </div>
                <Footer />
                <CookieBanner />
            </body>
        </html>
    );
}