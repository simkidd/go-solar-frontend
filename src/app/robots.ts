import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base_url = process.env.BASE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/product", "/blog"],
        disallow: ["/admin"],
      },
    ],
    sitemap: `${base_url}/sitemap.xml`,
  };
}
