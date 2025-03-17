import { User } from "@prisma/client";

export interface PostWithDetails {
  id: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  likes: {
    user: User;
    userId: string;
    postId: string;
    createdAt: Date;
  }[];
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    postId: string;
    user: User;
  }[];
  savedBy: {
    userId: string;
    postId: string;
    createdAt: Date;
  }[];
}
