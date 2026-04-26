import type { NextConfig } from "next";
import os from "os";

const isWSL = os.platform() === "linux" && os.release().toLowerCase().includes("microsoft");

const nextConfig = {
  /* config options here */
};

export default nextConfig;
