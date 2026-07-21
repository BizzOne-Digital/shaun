import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Same-origin proxy for Spacial widget chunks (avoids flaky cross-origin module loads).
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
