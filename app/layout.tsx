import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://astronutcase.com")
  ),
  title: "Astro Nutcase | AI Art Evolution Gallery",
  description:
    "Exploring the evolution of AI-generated art from 2022 to 2025. From DALL-E to Qwen and Gemini 3 Pro - witness the incredible journey of AI image generation.",
  keywords: ["AI art", "DALL-E", "Qwen", "Gemini 3 Pro", "AI generated images", "digital art", "AI evolution"],
  authors: [{ name: "Astro Nutcase" }],
  openGraph: {
    title: "Astro Nutcase | AI Art Evolution Gallery",
    description: "Exploring the evolution of AI-generated art from 2022 to 2025",
    type: "website",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Astro Nutcase - AI Art Evolution Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astro Nutcase | AI Art Evolution Gallery",
    description: "Exploring the evolution of AI-generated art from 2022 to 2025",
    images: ["/og/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/logo/astronutcase.svg", type: "image/svg+xml" },
      { url: "/logo/astronutcase.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/logo/astronutcase.svg", type: "image/svg+xml" },
    ],
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
