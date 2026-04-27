'use client';

import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockKeyholeIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';

/**
 * LoginPage — Auth card matching login.png design.
 *
 * Glass card: semi-transparent dark surface, subtle ring.
 * V3-X italic heading (Playfair Display) + "PRECISION ENGINEERING" mono label.
 * Email field with mail icon, Password with toggle visibility.
 * Gold "Sign In" CTA button + outlined Google button.
 *
 * This is a Client Component — owns form state (email, password, showPassword, loading).
 * In production, the submit handler would call POST /auth/login via src/services/auth.ts.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // TODO: replace with real API call via src/services/auth.ts
    // const result = await signIn('credentials', { email, password, redirect: false });
    // if (result?.error) setError('Invalid email or password.');
    // else router.push('/');

    // Simulate async for demo
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
  };

  return (
    // Glass card — semi-transparent surface with backdrop blur + subtle ring
    <div
      className={cn(
        'flex flex-col items-center gap-7 rounded-2xl p-8',
        'border border-surface-container-high bg-surface-container/80 backdrop-blur-xl',
        'ring-1 ring-white/5',
        'shadow-[0_32px_64px_rgba(0,0,0,0.5)]',
      )}
    >
      {/* ── Brand ── */}
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="font-heading text-5xl font-bold italic tracking-tight text-primary">V 3 - X</h1>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-on-surface-variant">
          Precision Engineering
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant"
          >
            Email Address
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline-brand" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="font-mono text-[10px] text-primary transition-opacity hover:opacity-75"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <LockKeyholeIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline-brand" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-10"
              autoComplete="current-password"
              required
            />
            {/* Toggle visibility button */}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-brand transition-colors hover:text-on-surface-variant"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p role="alert" className="font-mono text-[11px] text-destructive">
            {error}
          </p>
        )}

        {/* Sign In CTA */}
        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full font-mono text-sm uppercase tracking-widest"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
          {!isLoading && <ArrowRightIcon className="ml-1 size-4" />}
        </Button>
      </form>

      {/* ── Divider ── */}
      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-surface-container-high" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-outline-variant">or</span>
        <div className="h-px flex-1 bg-surface-container-high" />
      </div>

      {/* ── Google OAuth ── */}
      <button
        type="button"
        onClick={() => {
          // TODO: signIn('google') from next-auth
        }}
        className={cn(
          'flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-2.5',
          'border-surface-container-high bg-transparent',
          'font-sans text-sm text-on-surface',
          'transition-colors duration-200 hover:bg-surface-container-high',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        )}
      >
        {/* Google logo SVG — inline to avoid external asset dependency */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58Z"
          />
        </svg>
        Continue with Google
      </button>

      {/* ── Register link ── */}
      <p className="font-sans text-sm text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-primary transition-opacity hover:opacity-75">
          Create one
        </Link>
      </p>
    </div>
  );
}
