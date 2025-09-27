import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Monastery360 - Sikkim Digital Heritage Platform",
  description:
    "Explore Sikkim's sacred monasteries through immersive virtual tours, interactive maps, digital archives, and cultural experiences.",
  generator: "Monastery360",
  manifest: "/manifest.json",
  keywords: ["Sikkim", "monasteries", "Buddhism", "heritage", "virtual tours", "culture"],
  authors: [{ name: "Monastery360 Team" }],
  creator: "Monastery360",
  publisher: "Monastery360",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://monastery360.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Monastery360 - Sikkim Digital Heritage Platform",
    description:
      "Explore Sikkim's sacred monasteries through immersive virtual tours, interactive maps, digital archives, and cultural experiences.",
    url: "https://monastery360.vercel.app",
    siteName: "Monastery360",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monastery360 - Sikkim Digital Heritage Platform",
    description:
      "Explore Sikkim's sacred monasteries through immersive virtual tours, interactive maps, digital archives, and cultural experiences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#164e63",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Monastery360" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#164e63" />
      </head>
              <body className="font-sans antialiased">
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <AuthProvider>
                    <Suspense fallback={null}>{children}</Suspense>
                  </AuthProvider>
                </ThemeProvider>
                <Toaster />
                <Analytics />
              </body>
    </html>
  )
}
