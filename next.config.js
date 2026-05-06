/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ecobio-nextjs-ui',
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    '*': ['./node_modules/@swc/core-linux-x64-gnu'],
  },
};

export default nextConfig;
