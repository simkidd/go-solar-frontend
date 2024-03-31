export interface Post {
  id: number;
  title: string;
  // slug: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
}