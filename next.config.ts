import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Everything runs in the browser — there is no server, no database and no
  // account, which is also the privacy promise on the page. Static export keeps
  // that true and makes the site free to host.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
