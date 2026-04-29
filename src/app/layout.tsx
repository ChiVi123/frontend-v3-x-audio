import type { Metadata } from 'next';
import { IBM_Plex_Mono, Manrope, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '~/components/shared/theme-provider';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

const notoSerif = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin', 'vietnamese'],
});

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = {
  title: 'V3-X Audio',
  description: 'Premium Audio Equipment',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${manrope.variable} ${notoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
