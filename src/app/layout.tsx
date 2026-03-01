import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GoogleAdSense from "@/components/analytics/GoogleAdSense";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { UserProvider } from "@/lib/user-context";

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
        title: 'CodelithLabs - Free Online Tools Platform',
        description: '100+ free developer and productivity tools with client-side processing',
        images: ['https://codelithlabs.in/og-image.png'],
    },
    // Uncomment and add real tokens when ready:
    // verification: {
    //     google: 'your-google-token',
    //     yandex: 'your-yandex-token',
    //     other: { 'msvalidate.01': 'your-bing-token' },
    // },
    alternates: {
        canonical: 'https://codelithlabs.in',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                                "https://github.com/codelithlabs"
                            ]
                        })
                    }}
                />

                {/* LocalBusiness Schema for GEO Optimization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "CodelithLabs",
                            "image": "https://codelithlabs.in/icon.png",
                            "url": "https://codelithlabs.in",
                            "priceRange": "Free",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Kokrajhar",
                                "addressLocality": "Kokrajhar",
                                "addressRegion": "Assam",
                                "postalCode": "783370",
                                "addressCountry": "IN"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": 26.4008,
                                "longitude": 90.2717
                            },
                            "openingHoursSpecification": {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday"
                                ],
                                "opens": "00:00",
                                "closes": "23:59"
                            },
                            "sameAs": [
                                "https://github.com/codelithlabs"
                            ]
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
                <GoogleAdSense />
                </UserProvider>
                </AuthProvider>
            </body>
        </html>
    );
}