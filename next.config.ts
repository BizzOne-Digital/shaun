import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rewrite kept for backwards-compat — Spacial script now loads directly from CDN.
  async rewrites() {
    return [
      {
        source: "/spacial-widgets/:path*",
        destination:
          "https://samcloudmedia.spacial.com/webwidgets/widget/v6/sam-widgets/:path*",
      },
    ];
  },
};

export default nextConfig;
