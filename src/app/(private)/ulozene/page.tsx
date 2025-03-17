'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, ImageList, ImageListItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import { fetchSavedPostsByUserId } from '@/app/actions/posts';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Post, User, Like, Comment } from '@prisma/client';

type PostWithDetails = Post & {
  user: User;
  likes: (Like & { user: User })[];
  comments: (Comment & { user: User })[];
};

export default function SavedPosts() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadSavedPosts = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          setError(null);
          const savedPosts = await fetchSavedPostsByUserId(session.user.id) as PostWithDetails[];
          setPosts(savedPosts);
        } catch (error) {
          console.error('Error fetching saved posts:', error);
          setError('Failed to load saved posts. Please try refreshing the page.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadSavedPosts();
  }, [session?.user?.id]);

  const handlePostClick = (postId: string) => {
    router.push(`/prispevok/${postId}`);
  };

  if (!session) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>Please sign in to view saved posts.</Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Uložené príspevky
      </Typography>
      {posts.length > 0 ? (
        <ImageList cols={3} gap={2} sx={{ m: 0 }}>
          {posts.map((post) => (
            <ImageListItem 
              key={post.id} 
              onClick={() => handlePostClick(post.id)}
              sx={{ 
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  '& .overlay': {
                    opacity: 1
                  }
                }
              }}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption || 'Post image'}
                width={300}
                height={300}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <Typography variant="caption" color="white">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Typography>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>Nemáte žiadne uložené príspevky</Typography>
        </Box>
      )}
    </Container>
  );
}
