import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * AuthLayout — Fullscreen dark layout for login/register pages.
 *
 * No MainHeader / MainFooter.
 * Background: blurred headphone photo with dark overlay + noise grain.
 * Centered glass card (backdrop-blur, border, subtle ring).
 *
 * The background image uses Unsplash (allowlisted in next.config.ts).
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0b0b]">
      {/* Background image — blurred headphone photo */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=60"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30 blur-sm"
          priority
          aria-hidden
        />
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-background/60 to-background/95" />
      </div>

      {/* Gold left accent line — matches design annotation */}
      <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-primary/60" aria-hidden />

      {/* Page content (glass card) */}
      <main className="relative z-10 w-full max-w-sm px-4">{children}</main>
    </div>
  );
}
