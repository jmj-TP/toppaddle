import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    weight: ["400", "600", "700", "800"],
});

const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.toptabletennispaddle.com"),
    title: {
        default: "What Table Tennis Paddle is Best for You - Find Your Perfect Racket",
        template: "%s | TopTableTennisPaddle"
    },
    description: "Find your perfect table tennis racket with our guided quiz. Extensive experience helping players choose the right equipment for their playing style.",
    keywords: ["table tennis paddle", "ping pong racket", "table tennis equipment", "racket recommendation", "table tennis quiz", "paddle selector"],
    authors: [{ name: "TopTableTennisPaddle" }],
    robots: "index, follow",
    themeColor: "#0F172A",
    viewport: "width=device-width, initial-scale=1",
    icons: {
        icon: "/icon.png",
        apple: "/apple-icon.png",
        shortcut: "/icon.png",
    },
    openGraph: {
        type: "website",
        url: "https://www.toptabletennispaddle.com",
        title: "What Table Tennis Paddle is Best for You - Find Your Perfect Racket",
        description: "Find your perfect table tennis racket with our guided quiz. Extensive experience helping players choose the right equipment for their playing style.",
        siteName: "TopTableTennisPaddle",
        images: [
            {
                url: "/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "TopTableTennisPaddle — Find Your Perfect Racket",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "What Table Tennis Paddle is Best for You - Find Your Perfect Racket",
        description: "Find your perfect table tennis racket with our guided quiz. Extensive experience helping players choose the right equipment for their playing style.",
        images: ["/opengraph-image.png"],
    },
    alternates: {
        canonical: "/",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${montserrat.variable} ${openSans.variable} font-sans antialiased`}>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-W34SPQN7"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                </noscript>
                <Providers>{children}</Providers>
                {/* Google Tag Manager */}
                <Script id="gtm" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W34SPQN7');`}
                </Script>
                {/* Google tag (gtag.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-XC5MEXSNJP"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XC5MEXSNJP');
          `}
                </Script>
            </body>
        </html>
    );
}
