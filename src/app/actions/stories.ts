'use server';

import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { prisma } from '@/lib/prisma';

export async function createStory(formData: FormData) {
  try {
    console.log('Starting story creation...');
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      console.error('Missing required fields:', { file: !!file, userId: !!userId });
      throw new Error('Missing required fields');
    }

    console.log('Creating story for user:', userId);

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('Upload directory created/verified:', uploadDir);
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const path = join(uploadDir, filename);
    
    console.log('Saving file:', path);
    
    // Save file
    await writeFile(path, buffer);
    const imageUrl = `/uploads/${filename}`;

    console.log('File saved successfully:', imageUrl);

    // Calculate expiration (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Verify user exists before creating story
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Save to database
    console.log('Creating database entry...');
    const story = await prisma.story.create({
      data: {
        imageUrl,
        caption,
        userId,
        expiresAt
      },
      include: {
        user: true
      }
    });

    console.log('Story created successfully:', story);

    revalidatePath('/');
    return { success: true, story };
  } catch (error) {
    console.error('Error creating story:', error);
    return { success: false, error: 'Failed to create story', details: error instanceof Error ? error.message : String(error) };
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