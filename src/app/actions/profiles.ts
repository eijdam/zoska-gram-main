// src/app/actions/profiles.ts

"use server";

// Import Prisma client
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch all profiles
export const fetchAllProfiles = async () => {
  try {
    const profiles = await prisma.profile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return profiles;
  } catch (error) {
    console.error("Error fetching all profiles:", error);
    throw new Error("Could not fetch profiles");
  }
};

// Fetch profiles based on search term
export const fetchProfiles = async (searchTerm: string) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        OR: [
          { user: { name: { contains: searchTerm, mode: "insensitive" } } },
          { interests: { has: searchTerm } },
        ],
      },
      include: { user: true }, // Include user data
    });

    return profiles;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw new Error("Could not fetch profiles");
  }
};

// Update profile
export const updateProfile = async (userId: string, data: { name?: string; bio?: string; location?: string }) => {
  try {
    // Update user name
    if (data.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.name },
      });
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        bio: data.bio,
        location: data.location,
      },
      include: {
        user: true,
      },
    });

    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Could not update profile");
  }
};

// Fetch profile by user ID
export const fetchProfileByUserId = async (userId: string) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: true },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Could not fetch profile");
  }
};

// Create profile if it doesn't exist
export const createProfileIfNotExists = async (userId: string) => {
  try {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!existingProfile) {
      const newProfile = await prisma.profile.create({
        data: {
          userId,
          bio: "",
          location: "",
          interests: [],
        },
        include: {
          user: true,
        },
      });
      return newProfile;
    }

    return existingProfile;
  } catch (error) {
    console.error("Error creating/fetching profile:", error);
    throw new Error("Could not create/fetch profile");
  }
};

// Create profiles for all users who don't have one
export const createMissingProfiles = async () => {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });

    // Create profiles for users who don't have one
    const usersWithoutProfile = users.filter(user => !user.profile);
    
    for (const user of usersWithoutProfile) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          bio: "",
          location: "",
          interests: [],
          avatarUrl: user.image || null,
        },
      });
    }

    return { created: usersWithoutProfile.length };
  } catch (error) {
    console.error("Error creating missing profiles:", error);
    throw new Error("Could not create missing profiles");
  }
};

// Toggle follow status
export const toggleFollow = async (followerId: string, followingId: string) => {
  if (!followerId || !followingId) {
    throw new Error('Missing required IDs');
  }

  try {
    // First check if the follow relationship exists
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    let result;
    if (existingFollow) {
      // Unfollow
      result = await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      revalidatePath(`/profil/${followingId}`);
      return false; // Now unfollowed
    } else {
      // Follow
      result = await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });
      revalidatePath(`/profil/${followingId}`);
      return true; // Now following
    }
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    throw new Error(`Could not toggle follow status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get follow counts for a user
export const getFollowCounts = async (userId: string) => {
  try {
    const [followers, following] = await Promise.all([
      prisma.follows.count({
        where: { followingId: userId },
      }),
      prisma.follows.count({
        where: { followerId: userId },
      }),
    ]);

    return { followers, following };
  } catch (error) {
    console.error("Error getting follow counts:", error);
    throw new Error("Could not get follow counts");
  }
};

// Check if user is following another user
export const isFollowing = async (followerId: string, followingId: string) => {
  try {
    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    throw new Error("Could not check follow status");
  }
};

// Get followers with details
export const getFollowersWithDetails = async (userId: string) => {
  try {
    const followers = await prisma.follows.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          include: {
            profile: true
          }
        }
      }
    });

    return followers.map(f => f.follower);
  } catch (error) {
    console.error("Error getting followers:", error);
    throw new Error("Could not get followers");
  }
};

// Get following with details
export const getFollowingWithDetails = async (userId: string) => {
  try {
    const following = await prisma.follows.findMany({
      where: { followerId: userId },
      include: {
        following: {
          include: {
            profile: true
          }
        }
      }
    });

    return following.map(f => f.following);
  } catch (error) {
    console.error("Error getting following:", error);
    throw new Error("Could not get following");
  }
};