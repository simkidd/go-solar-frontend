import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base_url = process.env.BASE_URL;
  const posts: Post[] = await getPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base_url}/blog/${post?.slug}`,
    // lastModified: new Date(post.updatedAt)
  }));

  return [
    {
      url: `${base_url}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${base_url}/about-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base_url}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${base_url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${base_url}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${base_url}/account/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...postEntries,
  ];
}
