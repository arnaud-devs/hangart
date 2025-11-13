import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Ensure Next's output tracing root is set to this project directory so
  // generated .next type imports resolve correctly when there are lockfiles
  // in parent folders (common in Windows/OneDrive setups).
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
