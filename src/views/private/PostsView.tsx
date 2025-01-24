"use client"; // Client component directive

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchPosts } from '@/app/actions/posts';
import { Post, User } from '@prisma/client';
import { Card, CardContent, CardMedia, Typography, Container, CircularProgress, Alert } from '@mui/material';

type PostWithUser = Post & { user: User };

const PostsView: React.FC = () => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
        setError(null);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (isLoading) return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', // Align items vertically
          gap: '16px', 
          paddingBottom: '16px', 
          justifyContent: 'flex-start' 
        }}
      >
        {posts.map((post) => (
          <Card 
            key={post.id} 
            sx={{ 
              width: '100%', 
              height: 'auto', 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            {post.imageUrl && (
              <CardMedia sx={{ height: 300 }}>
                <Image
                  src={post.imageUrl}
                  alt={post.caption || 'Post image'}
                  width={300}
                  height={300}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </CardMedia>
            )}
            <CardContent>
              <Typography variant="h6">
                {post.user?.name || 'Anonymous User'}
              </Typography>
              <Typography variant="body2">
                {post.caption || 'No caption provided'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default PostsView;
