import Link from 'next/link';
import { Button } from '~/components/ui/button';

/**
 * NotFoundPage — Custom 404 page
 *
 * Matches 404_error.png:
 * - Dark background, centered layout
 * - Music note icon with strikethrough in a circle
 * - "Page Not Found" heading (serif)
 * - Audio-themed description
 * - "Return to Signal" (gold CTA) + "Diagnostics" (outline) buttons
 * - Minimal footer
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Main content — centered vertically */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        {/* Icon circle */}
        <div aria-hidden className="flex size-36 items-center justify-center rounded-full bg-surface-container">
          {/* Music note strikethrough icon — custom SVG matching mockup */}
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Music note */}
            <path
              d="M20 36V16l20-4v16"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="36" r="4" stroke="var(--color-primary)" strokeWidth="2.5" />
            <circle cx="36" cy="28" r="4" stroke="var(--color-primary)" strokeWidth="2.5" />
            {/* Strikethrough diagonal */}
            <line x1="8" y1="44" x2="44" y2="8" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-5xl font-normal text-on-surface sm:text-6xl">Page Not Found</h1>
          <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
            The frequency you are searching for is out of range. The signal may have been lost or the connection
            rerouted.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="gold" size="lg" className="font-mono text-[11px] uppercase tracking-widest">
            <Link href="/">Return to Signal</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-mono text-[11px] uppercase tracking-widest">
            <Link href="/catalog">Diagnostics</Link>
          </Button>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-surface-container-high px-8 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-on-surface-variant">© 2026 V3-X AUDIO. Precision Engineering.</p>
          <nav className="flex items-center gap-6">
            {['FAQ', 'Terms', 'Privacy', 'Instagram', 'Twitter'].map((item) => (
              <Link
                key={item}
                href="/#"
                className="font-mono text-[10px] text-on-surface-variant transition-colors duration-200 hover:text-primary"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
