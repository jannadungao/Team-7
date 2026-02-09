import type { NextConfig } from "next";
import os from "os";

const isWSL = os.platform() === "linux" && os.release().toLowerCase().includes("microsoft");

const nextConfig = {
  /* config options here */
  webpackDevMiddleware: (config: any) => {
    if (isWSL) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000, // Enable polling with a 1-second interval
      };
    }
    return config;
  },
};

export default nextConfig;
