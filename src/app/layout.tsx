import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";
import Script from 'next/script';
import { AuthProvider } from "@/components/providers/AuthProvider";
import { UserProvider } from "@/lib/user-context";
import crypto from 'crypto';
import { NonceProvider } from "@/app/nonce-context";
import { config as envConfig } from "@/lib/config"; // Validate env vars on startup

const inter = Inter({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "CodelithLabs - Free Online Tools Platform | 100+ Developer & Productivity Tools",
        template: "%s | CodelithLabs"
    },
    description: "CodelithLabs offers 100+ free online tools for developers, designers, and content creators. JSON formatter, image compressor, password generator, SEO tools, financial calculators & more. 100% client-side processing for maximum privacy.",
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
        "client-side tools",
        "privacy-first",
        "web utilities"
    ],
    authors: [{ name: "CodelithLabs Team" }],
    creator: "CodelithLabs",
    publisher: "CodelithLabs",
    robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://codelithlabs.in",
        title: "CodelithLabs - Free Online Tools Platform",
        description: "100+ free online tools with client-side processing. JSON formatter, image compressor, password generator, and more.",
        siteName: "CodelithLabs",
        images: [
            {
                url: 'https://codelithlabs.in/og-image.png',
                width: 1200,
                height: 630,
                alt: 'CodelithLabs Tools Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@codelithlabs',
        creator: '@codelithlabs',
        title: 'CodelithLabs - Free Online Tools Platform',
        description: '100+ free developer and productivity tools with client-side processing',
        images: ['https://codelithlabs.in/og-image.png'],
    },
    other: {
        'google-adsense-account': 'ca-pub-6839552407587904',
    },
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION || '',
        yandex: process.env.YANDEX_VERIFICATION || '',
        other: {
            'msvalidate.01': process.env.BING_VERIFICATION || '',
        },
    },
    alternates: {
        canonical: 'https://codelithlabs.in',
        types: {
            'application/rss+xml': 'https://codelithlabs.in/feed.xml/',
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Generate a cryptographically secure nonce for CSP inline scripts
    const nonce = crypto.randomBytes(16).toString('base64');

    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} ${jetbrainsMono.variable} antialiased selection:bg-blue-500/30 bg-[#0a0a0a]`}>
                {/* Skip to main content — accessibility */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]
                               focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg
                               focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Skip to main content
                </a>
                <NonceProvider nonce={nonce}>
                <AuthProvider>
                <UserProvider>

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
                            "description": "Free online tools platform with 100+ utilities for developers, designers, and content creators",
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
                                "https://github.com/codelithlabs",
                                "https://x.com/codelithlabs",
                                "https://linkedin.com/company/codelithlabs"
                            ]
                        })
                    }}
                />

                {/* WebSite Schema with SearchAction for Google Sitelinks Search Box */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "CodelithLabs",
                            "url": "https://codelithlabs.in",
                            "description": "Free online tools platform with 100+ utilities for developers, designers, and content creators",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": {
                                    "@type": "EntryPoint",
                                    "urlTemplate": "https://codelithlabs.in/tools/?q={search_term_string}"
                                },
                                "query-input": "required name=search_term_string"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "CodelithLabs",
                                "url": "https://codelithlabs.in"
                            }
                        })
                    }}
                />

                <Navbar />
                <main id="main-content" className="pt-16"> {/* Add padding so content doesn't hide behind Navbar */}
                    {children}
                </main>
                <Footer />
                <CookieBanner />
                <GoogleAnalytics />
                <MicrosoftClarity />
                {/* AdSense: lazyOnload reduces initial render blocking on mobile */}
                <Script
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6839552407587904"
                    strategy="lazyOnload"
                    crossOrigin="anonymous"
                />
                </UserProvider>
                </AuthProvider>
                </NonceProvider>
            </body>
        </html>
    );
}