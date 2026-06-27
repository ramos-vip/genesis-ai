import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Genesis AI",
    short_name:       "Genesis AI",
    description:      "Build your AI workforce in minutes. Deploy AI employees for Sales, Support, Content and Operations.",
    start_url:        "/",
    display:          "standalone",
    orientation:      "portrait",
    background_color: "#07070a",
    theme_color:      "#7c3aed",
    categories:       ["business", "productivity", "utilities"],
    lang:             "en",
    dir:              "ltr",
    icons: [
      {
        src:     "/favicon.ico",
        sizes:   "48x48",
        type:    "image/x-icon",
      },
      {
        src:     "/icon-192.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "maskable",
      },
      {
        src:     "/icon-512.png",
        sizes:   "512x512",
        type:    "image/png",
        purpose: "any",
      },
    ],
    screenshots: [],
  };
}
