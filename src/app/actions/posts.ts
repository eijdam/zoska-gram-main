// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadToBlob } from '@/lib/blob';

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        likes: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        savedPosts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Fetch posts by user ID
export const fetchPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        likes: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        savedPosts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post
export async function createPost(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      throw new Error('Missing required fields');
    }

    // Upload to Vercel Blob
    const filename = `posts/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const imageUrl = await uploadToBlob(file, filename);

    // Create post in database with blob URL
    const post = await prisma.post.create({
      data: {
        imageUrl,
        caption,
        userId
      },
      include: {
        user: true,
        likes: {
          include: {
            user: true
          }
        },
        comments: {
          include: {
            user: true
          }
        }
      }
    });

    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

// Toggle like on a post
export const toggleLike = async (postId: string, userId: string) => {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      return false; // Post is now unliked
    } else {
      // Like
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      return true; // Post is now liked
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Could not toggle like");
  }
};

// Add comment to a post
export const addComment = async (postId: string, userId: string, content: string) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: true,
      },
    });

    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Could not add comment");
  }
};

// Delete comment
export const deleteComment = async (commentId: string, userId: string) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== userId) {
      throw new Error("Not authorized to delete this comment");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Could not delete comment");
  }
};

// Edit comment
export const editComment = async (commentId: string, userId: string, content: string) => {
  'use server';
  
  console.log('Server: Starting edit comment...', { commentId, userId }); // Debug log
  
  if (!commentId || !userId || !content) {
    console.error('Server: Missing required parameters', { commentId, userId, content });
    throw new Error("Missing required parameters for editing comment");
  }

  try {
    // First check if the comment exists and belongs to the user
    console.log('Server: Checking comment existence...'); // Debug log
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true }
    });

    console.log('Server: Found existing comment:', existingComment); // Debug log

    if (!existingComment) {
      console.error('Server: Comment not found', { commentId });
      throw new Error("Comment not found");
    }

    if (existingComment.userId !== userId) {
      console.error('Server: Unauthorized edit attempt', { commentId, userId, ownerId: existingComment.userId });
      throw new Error("Not authorized to edit this comment");
    }

    // Update the comment
    console.log('Server: Updating comment...'); // Debug log
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { 
        content,
        updatedAt: new Date() 
      },
      include: {
        user: true,
      },
    });

    console.log('Server: Comment updated successfully:', updatedComment); // Debug log
    return updatedComment;
  } catch (error) {
    console.error("Server: Error editing comment:", error);
    if (error instanceof Error) {
      throw new Error(`Could not edit comment: ${error.message}`);
    }
    throw new Error("Could not edit comment: Unknown error");
  }
};

// Fetch post with likes and comments
export const fetchPostWithDetails = async (postId: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        likes: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        savedPosts: true,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
};

export async function fetchFollowedPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: userId
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        likes: {
          include: {
            user: true
          }
        },
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        savedPosts: true
      }
    });
    return posts;
  } catch (error) {
    console.error('Error fetching followed posts:', error);
    throw new Error('Failed to fetch followed posts');
  }
}

export async function deletePost(postId: string, userId: string) {
  try {
    // First check if the post belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, imageUrl: true }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.userId !== userId) {
      throw new Error('Not authorized to delete this post');
    }

    // Delete the post and all related data (likes, comments)
    await prisma.post.delete({
      where: { id: postId }
    });

    // Delete the image file from uploads directory
    const imagePath = join(process.cwd(), 'public', post.imageUrl);
    try {
      await unlink(imagePath);
    } catch (error) {
      console.error('Error deleting image file:', error);
      // Continue even if file deletion fails
    }

    revalidatePath('/');
    revalidatePath('/prispevok');
    revalidatePath(`/profil/${userId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}

// Toggle save on a post
export const toggleSave = async (postId: string, userId: string) => {
  try {
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await prisma.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      return false; // Post is now unsaved
    } else {
      // Save
      await prisma.savedPost.create({
        data: {
          postId,
          userId,
        },
      });
      return true; // Post is now saved
    }
  } catch (error) {
    console.error("Error toggling save:", error);
    throw new Error("Could not toggle save");
  }
};

// Fetch saved posts by user ID
export const fetchSavedPostsByUserId = async (userId: string) => {
  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            user: true,
            likes: {
              include: {
                user: true,
              },
            },
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            savedPosts: true
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    return savedPosts.map(savedPost => savedPost.post);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw new Error("Could not fetch saved posts");
  }
};