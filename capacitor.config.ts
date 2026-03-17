import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dev.next01",
  appName: "Dev_Next01",
  webDir: ".next",
  server: {
    url: process.env.NEXT_PUBLIC_APP_URL,
    cleartext: false,
  },
};

export default config;
