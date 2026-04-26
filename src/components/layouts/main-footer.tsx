import Link from 'next/link';

/**
 * MainFooter — Customer-facing footer
 *
 * Matches home.png and catalog.png:
 * - Top: Logo + tagline | 3 link columns (Support, Legal, Company)
 * - Bottom: copyright + link row
 */
export function MainFooter() {
  return (
    <footer className="mt-auto border-t border-surface-container-high bg-background">
      <div className="container mx-auto px-6 py-14">
        {/* Top section — 4 cols */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3 lg:col-span-1">
            <Link href="/" className="w-fit font-heading text-xl font-bold text-primary">
              V3-X Audio
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-on-surface-variant">
              Precision Engineering for the Purist. Designing acoustic perfection in the silence between the notes.
            </p>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface">
              Support
            </span>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Contact Us', href: '/#' },
                { label: 'Shipping & Returns', href: '/#' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-on-surface-variant transition-colors duration-200 hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface">
              Legal
            </span>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Privacy Policy', href: '/#' },
                { label: 'Terms of Service', href: '/#' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-on-surface-variant transition-colors duration-200 hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface">
              Company
            </span>
            <nav className="flex flex-col gap-3">
              {[{ label: 'Sustainability', href: '/#' }].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-on-surface-variant transition-colors duration-200 hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-container-high pt-6 sm:flex-row">
          <p className="font-mono text-[10px] text-on-surface-variant">
            © 2026 V3-X Audio. Precision Engineering for the Purist.
          </p>
        </div>
      </div>
    </footer>
  );
}
