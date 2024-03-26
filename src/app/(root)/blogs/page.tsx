import { Metadata } from "next";
import React from "react";

const pageTitle = "Blogs";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const BlogsPage = () => {
  return <div>BlogsPage</div>;
};

export default BlogsPage;
