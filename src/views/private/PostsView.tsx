"use client"; // Client component directive

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchPosts, fetchFollowedPosts, toggleLike, addComment, deleteComment, editComment, deletePost } from '@/app/actions/posts';
import { Post, User, Like, Comment } from '@prisma/client';
import { 
  Card, CardContent, CardMedia, Typography, Container, CircularProgress, 
  Alert, Avatar, Box, IconButton, TextField, Button, Menu, MenuItem, Grid, Paper,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Stories from '@/components/Stories';

type PostWithDetails = Post & { 
  user: User;
  likes: (Like & { user: User })[];
  comments: (Comment & { user: User })[];
};

export default function PostsView({ initialPosts }: { initialPosts?: PostWithDetails[] }) {
  const [posts, setPosts] = useState<PostWithDetails[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<{ id: string; postId: string } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewStoryDialogOpen, setViewStoryDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPosts) {
      loadPosts();
    }
  }, [initialPosts]);

  useEffect(() => {
    // Clear error when session becomes available
    if (status === 'authenticated' && error?.includes('must be logged in')) {
      setError(null);
    }
  }, [status, error]);

    const loadPosts = async () => {
      try {
        setIsLoading(true);
      if (activeTab === 0) {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } else if (activeTab === 1 && session?.user?.id) {
        const followedPosts = await fetchFollowedPosts(session.user.id);
        setPosts(followedPosts);
      }
      } catch (err) {
      console.error('Error loading posts:', err);
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    loadPosts();
  }, [activeTab, session?.user?.id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLike = async (postId: string) => {
    if (status === 'loading') {
      return;
    }
    
    if (status === 'unauthenticated') {
      router.push('/auth/prihlasenie');
      return;
    }

    if (!session?.user?.id) {
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [`like-${postId}`]: true }));
      const isLiked = await toggleLike(postId, session.user.id);
      
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post.id === postId) {
            if (isLiked) {
              return {
                ...post,
                likes: [...post.likes, { 
                  id: Date.now().toString(),
                  userId: session.user.id!,
                  postId,
                  user: session.user,
                  createdAt: new Date()
                } as Like & { user: User }]
              };
            } else {
              return {
                ...post,
                likes: post.likes.filter(like => like.userId !== session.user.id)
              };
            }
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`like-${postId}`]: false }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (status === 'loading') {
      return;
    }
    
    if (status === 'unauthenticated') {
      router.push('/auth/prihlasenie');
      return;
    }

    if (!session?.user?.id) {
      return;
    }

    const commentText = commentTexts[postId]?.trim();
    if (!commentText) return;

    try {
      setLoadingStates(prev => ({ ...prev, [`comment-${postId}`]: true }));
      const newComment = await addComment(postId, session.user.id, commentText);
      
      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                {
                  ...newComment,
                  user: session.user
                } as Comment & { user: User },
                ...post.comments
              ]
            };
          }
          return post;
        })
      );
      
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`comment-${postId}`]: false }));
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!session?.user?.id) return;

    try {
      await deleteComment(commentId, session.user.id);
      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  const handleCommentMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: string, postId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedComment({ id: commentId, postId });
  };

  const handleCommentMenuClose = () => {
    if (!editingComment) {
      setSelectedComment(null);
    }
    setMenuAnchorEl(null);
  };

  const startEditingComment = (comment: Comment & { user: User }, postId: string) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.content);
    setSelectedComment({ id: comment.id, postId });
    handleCommentMenuClose();
  };

  const handleEditComment = async () => {
    console.log('Starting edit comment...'); // Debug log
    
    if (!editingComment) {
      console.error('No comment being edited');
      setError('No comment being edited');
      return;
    }
    
    if (!session?.user?.id) {
      console.error('No user session');
      setError('You must be logged in to edit comments');
      return;
    }

    // Find the post and comment being edited
    let foundPost: PostWithDetails | undefined;
    let foundComment: (Comment & { user: User }) | undefined;

    for (const post of posts) {
      const comment = post.comments.find(c => c.id === editingComment);
      if (comment) {
        foundPost = post;
        foundComment = comment;
        break;
      }
    }
    
    if (!foundComment || !foundPost) {
      console.error('Comment or post not found', { editingComment, posts });
      setError('Comment not found');
      return;
    }

    const trimmedComment = editCommentText.trim();
    console.log('Editing comment:', { 
      commentId: editingComment, 
      postId: foundPost.id,
      newContent: trimmedComment 
    }); // Debug log
    
    // If comment is empty, delete it
    if (!trimmedComment) {
      await handleDeleteComment(editingComment, foundPost.id);
      setEditingComment(null);
      setEditCommentText("");
      setSelectedComment(null);
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [`edit-${editingComment}`]: true }));
      console.log('Setting loading state...'); // Debug log
      
      // Call the server action to update the comment
      console.log('Calling editComment with:', {
        commentId: editingComment,
        userId: session.user.id,
        content: trimmedComment
      }); // Debug log
      
      const updatedComment = await editComment(editingComment, session.user.id, trimmedComment);
      console.log('Received updated comment:', updatedComment); // Debug log
      
      if (!updatedComment) {
        throw new Error("Failed to update comment - no response from server");
      }

      // Update the UI with the new comment data
      setPosts(currentPosts =>
        currentPosts.map(p => {
          if (p.id === foundPost!.id) {
            return {
              ...p,
              comments: p.comments.map(c =>
                c.id === editingComment
                  ? { ...c, content: trimmedComment, updatedAt: new Date() }
                  : c
              )
            };
          }
          return p;
        })
      );
      console.log('Updated posts state'); // Debug log
      
      // Reset the editing state
      setEditingComment(null);
      setEditCommentText("");
      setSelectedComment(null);
    } catch (err) {
      console.error('Error editing comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to edit comment');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`edit-${editingComment}`]: false }));
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!session?.user?.id) return;

    try {
      await deletePost(postId, session.user.id);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete || !session?.user?.id) return;

    try {
      await deletePost(postToDelete, session.user.id);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postToDelete));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleViewUserStory = (userId: string) => {
    setSelectedUserId(userId);
    setViewStoryDialogOpen(true);
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          borderBottom: 1,
          borderColor: 'divider',
          mb: 2
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'text.primary',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#0095f6',
              height: '5%'
            },
          }}
        >
          <Tab label="Pre vás" />
          <Tab label="Sledované" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Stories 
          open={viewStoryDialogOpen}
          initialUserId={selectedUserId || undefined}
          onClose={() => {
            setViewStoryDialogOpen(false);
            setSelectedUserId(null);
          }}
          onStoryClick={(userId) => {
            setSelectedUserId(userId);
            setViewStoryDialogOpen(true);
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {activeTab === 0 ? 'Zatiaľ nie sú žiadne príspevky.' : 'Žiadne príspevky od sledovaných používateľov.'}
        </Alert>
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 2, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ pb: 1, px: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={post.user.image || undefined}
                  alt={post.user.name || 'User'}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
              <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {post.user.name}
                </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                </Typography>
                </Box>
                {session?.user?.id === post.userId && (
                  <IconButton
                    onClick={() => handleDeleteClick(post.id)}
                    sx={{ ml: 1 }}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </CardContent>

            <CardMedia
              component="div"
              sx={{ position: 'relative', pt: '100%' }}
            >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || 'Post image'}
                fill
                style={{ objectFit: 'cover' }}
              />
            </CardMedia>

            <CardContent sx={{ pt: 2, px: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                  onClick={() => handleLike(post.id)}
                  disabled={loadingStates[`like-${post.id}`]}
                  color={post.likes.some(like => like.userId === session?.user?.id) ? 'error' : 'default'}
                  sx={{ p: 1, mr: 1 }}
                >
                  {post.likes.some(like => like.userId === session?.user?.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton sx={{ p: 1 }}>
                  <CommentIcon />
                </IconButton>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </Typography>

              {post.caption && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
                    {post.user.name}
                  </Box>
                  {post.caption}
                </Typography>
              )}

              {post.comments.map((comment) => (
                <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <Avatar
                    src={comment.user.image || undefined}
                    alt={comment.user.name || 'User'}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Box flex={1}>
                    {editingComment === comment.id ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          size="small"
                          fullWidth
                          multiline
                          maxRows={4}
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleEditComment();
                            }
                          }}
                          disabled={loadingStates[`edit-${comment.id}`]}
                          error={editCommentText.trim().length === 0}
                          helperText={editCommentText.trim().length === 0 ? "Comment cannot be empty" : ""}
                          autoFocus
                        />
                        <Button 
                          variant="contained"
                          size="small" 
                          onClick={handleEditComment}
                          disabled={loadingStates[`edit-${comment.id}`] || editCommentText.trim().length === 0}
                        >
                          {loadingStates[`edit-${comment.id}`] ? (
                            <CircularProgress size={20} />
                          ) : (
                            'Save'
                          )}
                        </Button>
                        <Button 
                          size="small" 
                          onClick={() => {
                            setEditingComment(null);
                            setEditCommentText("");
                            setSelectedComment(null);
                          }}
                          disabled={loadingStates[`edit-${comment.id}`]}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body2">
                          <strong>{comment.user.name}</strong> {comment.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                          {comment.updatedAt && comment.updatedAt !== comment.createdAt && ' • edited'}
                        </Typography>
                      </>
                    )}
                  </Box>
                  {comment.userId === session?.user?.id && !editingComment && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleCommentMenuOpen(e, comment.id, post.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Add a comment..."
                  value={commentTexts[post.id] || ''}
                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(post.id);
                    }
                  }}
                />
                <IconButton
                  onClick={() => handleAddComment(post.id)}
                  disabled={loadingStates[`comment-${post.id}`] || !commentTexts[post.id]?.trim()}
                >
                  {loadingStates[`comment-${post.id}`] ? (
                    <CircularProgress size={24} />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Vymazať príspevok?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Ste si istý, že chcete vymazať tento príspevok? Táto akcia sa nedá vrátiť späť.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>
            Zrušiť
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Vymazať
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCommentMenuClose}
      >
        <MenuItem onClick={() => {
          const post = posts.find(p => p.id === selectedComment?.postId);
          const comment = post?.comments.find(c => c.id === selectedComment?.id);
          if (comment && post) {
            startEditingComment(comment, post.id);
          }
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedComment) {
            handleDeleteComment(selectedComment.id, selectedComment.postId);
          }
          handleCommentMenuClose();
        }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
}
