import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingChatbotButton } from "@/components/chatbot-panel"
import { getRoutes } from "@/lib/routes"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Junkjet - Sustainable Waste Management",
  description: "Transform waste into opportunity with our innovative three-phase sustainable management system",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const routes = await getRoutes()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar routes={routes} />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Suspense fallback={<div>Loading...</div>}>
                <Footer />
              </Suspense>
              
              {/* Floating Chatbot */}
              <FloatingChatbotButton />
            </div>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
