import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base_url = process.env.BASE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/blog"],
        disallow: ["/dashboard", "/admin"],
      },
    ],
    sitemap: `${base_url}/sitemap.xml`,
  };
}
