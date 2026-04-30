'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type * as React from 'react';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      // next-themes injects a script to prevent flash; in Next.js 16 this must
      // be deferred to avoid "script tag in React component" console error.
      scriptProps={{ 'data-cfasync': 'false' }}
    >
      {children}
    </NextThemesProvider>
  );
}
