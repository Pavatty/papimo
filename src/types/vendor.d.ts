declare module "next-pwa" {
  import type { NextConfig } from "next";

  function pwa(
    options?: Record<string, unknown>,
  ): (config: NextConfig) => NextConfig;
  export default pwa;
}
