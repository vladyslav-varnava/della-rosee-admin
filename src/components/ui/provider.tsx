'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

import { system } from '@/lib/theme';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';

export function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <QueryProvider>{props.children}</QueryProvider>
        <Toaster />
      </ThemeProvider>
    </ChakraProvider>
  );
}
