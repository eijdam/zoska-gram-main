'use server';

import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { uploadToBlob } from '@/lib/blob';

export async function createStory(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      throw new Error('Missing required fields');
    }

    // Upload to Vercel Blob
    const filename = `stories/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const imageUrl = await uploadToBlob(file, filename);

    // Create story in database with blob URL
    const story = await prisma.story.create({
      data: {
        imageUrl,
        caption,
        userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      },
      include: {
        user: true
      }
    });

    return { success: true, story };
  } catch (error) {
    console.error('Error creating story:', error);
    return { success: false, error: 'Failed to create story' };
  }
}

export async function getStories() {
  try {
    console.log('Fetching stories...');
    const now = new Date();
    
    // Get all non-expired stories
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: now
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found stories:', stories.length);

    // Group stories by user
    const storyGroups = stories.reduce((groups: any, story) => {
      const userId = story.user.id;
      if (!groups[userId]) {
        groups[userId] = {
          userId: story.user.id,
          username: story.user.name || '',
          userImage: story.user.image || '',
          stories: []
        };
      }
      groups[userId].stories.push({
        id: story.id,
        userId: story.user.id,
        username: story.user.name || '',
        userImage: story.user.image || '',
        hasStory: true,
        imageUrl: story.imageUrl,
        caption: story.caption,
        createdAt: story.createdAt
      });
      return groups;
    }, {});

    const groupsArray = Object.values(storyGroups);
    console.log('Story groups created:', groupsArray.length);

    return { success: true, storyGroups: groupsArray };
  } catch (error) {
    console.error('Error fetching stories:', error);
    return { success: false, error: 'Failed to fetch stories', details: error instanceof Error ? error.message : String(error) };
  }
}