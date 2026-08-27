import { User } from "./auth.interface";

export interface IReview {
  _id: string;
  name: string;
  role: string;
  content: string;
  isPublished: boolean;
  videoUrl: string;
  videoId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}
