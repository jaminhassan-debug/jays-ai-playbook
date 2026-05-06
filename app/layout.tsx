import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: {
    default: "Jay's AI Playbook - Master AI for Content & Monetization",
    template: "%s | Jay's AI Playbook"
  },
  description: "Discover powerful AI prompts, playbooks, and strategies to create viral content, automate your workflow, and monetize your skills. Join thousands mastering AI.",
  keywords: ["AI prompts", "AI playbook", "content creation", "AI automation", "monetization", "ChatGPT", "AI tools"],
  authors: [{ name: "Jay's AI Playbook" }],
  creator: "Jay's AI Playbook",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.jaysaiplaybook.blog",
    siteName: "Jay's AI Playbook",
    title: "Jay's AI Playbook - Master AI for Content & Monetization",
    description: "Discover powerful AI prompts, playbooks, and strategies to create viral content, automate your workflow, and monetize your skills.",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "Jay's AI Playbook Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jay's AI Playbook - Master AI for Content & Monetization",
    description: "Discover powerful AI prompts, playbooks, and strategies to create viral content.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0914",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
