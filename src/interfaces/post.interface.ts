export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  image: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  tags: string[];
  author: string;
  image: string | File | Blob;
}

export interface UpdatePostInput {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  image: string | File;
}
