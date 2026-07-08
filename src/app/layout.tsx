import type { Metadata } from 'next';

import { Provider } from '@/components/ui/provider';

export const metadata: Metadata = {
  title: 'Della Rosee Admin',
  description: 'Admin panel for Della Rosee',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
