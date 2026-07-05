import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/auth/login', permanent: true },
      { source: '/users', destination: '/auth/login', permanent: true },
      { source: '/admins', destination: '/auth/login', permanent: true }
    ];
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://localhost:3333/api/:path*' },
      { source: '/socket.io', destination: 'http://localhost:3333/socket.io/' },
      { source: '/socket.io/:path*', destination: 'http://localhost:3333/socket.io/:path*' }
    ];
  }
};

export default withNextIntl(nextConfig);
