/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false,
    serverActions: true,
    proxyTimeout: 120_000, // 2 minutes
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "https://api-groupgpt.nicholasbay.me/api/:path*",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : "https://api-groupgpt.nicholasbay.me/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json"
            : "https://api-groupgpt.nicholasbay.me/openapi.json",
      },
    ];
  },
};

module.exports = nextConfig;
