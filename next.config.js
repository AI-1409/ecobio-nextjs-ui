/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    '*': ['./node_modules/@swc/core-linux-x64-gnu'],
  },
};

export default nextConfig;
