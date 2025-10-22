import { Providers } from '@/components/providers/providers';
import ServiceWorkerInit from '@/components/pwa/service-worker-init';
import { Toaster } from '@/components/ui/sonner';
import GoogleOneTap from '@/features/auth/google-one-tap';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Fairpoint - Tax & Accounting Platform',
  description: 'Professional tax and accounting software for modern businesses',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/manifest-icon-192.maskable.png" />
        <meta name="application-name" content="Fairpoint" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fairpoint" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link
          rel="apple-touch-startup-image"
          href="/manifest-icon-192.maskable.png"
        />
      </head>
      <body
        className={`${geistSans.className} antialiased bg-gradient-to-r from-background to-card`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <GoogleOneTap />
            <ServiceWorkerInit />
            <Analytics />
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
