import { cookies } from 'next/headers';
import './globals.css';
import { cn } from '@src/lib/utils';
import { NextIntlClientProvider } from 'next-intl';
import AuthProvider from '@src/@shared/providers/auth/auth.provider';
import ReactQueryProvider from '@src/@shared/providers/react-query.provider';
import { SocketNotificationProvider } from '@src/@shared/providers/socket-notification.provider';
import { Toaster } from '@src/components/@shared/components/ui/toaster';
import { Metadata } from 'next';
import { ThemeProvider } from '@src/components/theme-provider';

export const metadata: Metadata = {
  title: 'Rhotta Fleet Management',
  description: 'Manage fleets and vehicles efficiently'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || '';

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased font-sans', theme)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var match = document.cookie.match(new RegExp('(^| )theme=([^;]+)'));
                  var theme = match ? match[2] : null;
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.cookie = 'theme=' + theme + '; path=/; max-age=31536000';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `
          }}
        />
      </head>
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider defaultTheme={theme || 'system'}>
              <NextIntlClientProvider>
                <SocketNotificationProvider>{children}</SocketNotificationProvider>
              </NextIntlClientProvider>
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
