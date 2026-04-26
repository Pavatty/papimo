import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "papimo",
    short_name: "papimo",
    description: "L'immobilier entre particuliers",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ec",
    theme_color: "#1E5A96",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
