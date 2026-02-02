import { withPayload } from "@payloadcms/next/withPayload";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "antree.com",
        port: "3000",
        pathname: "/api/media/**",
      },
      /*
      {
        protocol: 'https',
        hostname: 'antree.com',
        pathname: '/api/media/**',
      },
      */
    ],
  },
  async rewrites() {
    return [
      {
        source: "/((?!admin|api))/:path*",
        destination: "/:tenant/:path*",
        has: [
          {
            type: "host",
            value: "(?<tenant>.*)",
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
