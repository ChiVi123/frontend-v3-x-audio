import { MainFooter } from '~/components/layouts/main-footer';
import { MainHeader } from '~/components/layouts/main-header';

/**
 * PresentationLayout — wrapper for all customer-facing pages.
 * Provides sticky header + main content area + footer.
 * Server Component — no 'use client'.
 */
export default function PresentationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <MainFooter />
    </>
  );
}
