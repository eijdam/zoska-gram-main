'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Avatar, Typography, IconButton, Dialog } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSession } from 'next-auth/react';
import StoryUploadDialog from './StoryUploadDialog';
import Image from 'next/image';
import { createStory, getStories } from '@/app/actions/stories';

interface Story {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  hasStory: boolean;
  imageUrl?: string;
  caption?: string;
  createdAt: Date;
}

interface StoryGroup {
  userId: string;
  username: string;
  userImage: string;
  stories: Story[];
}
interface GetStoriesResult {
  success: boolean;
  storyGroups?: StoryGroup[];
  error?: string;
}
// Add this CSS at the top of the file
const storyBorderGradient = {
  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
  padding: '2px',
  borderRadius: '50%',
  cursor: 'pointer'
};

interface StoriesProps {
  initialUserId?: string;
  open?: boolean;
  onClose?: () => void;
  onStoryClick?: (userId: string) => void;
}

export default function Stories({ initialUserId, open, onClose, onStoryClick }: StoriesProps) {
  const { data: session } = useSession();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewStoryDialogOpen, setViewStoryDialogOpen] = useState(open || false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update viewStoryDialogOpen when open prop changes
  useEffect(() => {
    if (open !== undefined) {
      setViewStoryDialogOpen(open);
    }
  }, [open]);

  // Set initial story group when initialUserId is provided
  useEffect(() => {
    if (initialUserId && storyGroups.length > 0) {
      const group = storyGroups.find(g => g.userId === initialUserId);
      if (group) {
        setSelectedStoryGroup(group);
        setCurrentGroupIndex(storyGroups.findIndex(g => g.userId === initialUserId));
        setCurrentStoryIndex(0);
        setProgress(0);
      }
    }
  }, [initialUserId, storyGroups]);

  // Fetch stories on mount and periodically
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setError(null);
        const result = await getStories() as GetStoriesResult;
        if (result.success && result.storyGroups) {
          setStoryGroups(result.storyGroups);
        } else {
          setError(result.error || 'Failed to fetch stories');
        }
      } catch (err) {
        setError('Failed to fetch stories');
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
    // Refresh stories every minute to check for expirations
    const interval = setInterval(fetchStories, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddStory = () => {
    if (!session?.user?.id) {
      console.error('No user session found');
      return;
    }
    setUploadDialogOpen(true);
  };

  const handleUpload = async (file: File, caption: string) => {
    try {
      setError(null);
      if (!session?.user?.id) {
        throw new Error('No user session found');
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('userId', session.user.id);
  
      const result = await createStory(formData);
      if (result.success) {
        // Refresh stories after upload
        const storiesResult = await getStories() as GetStoriesResult;
        if (storiesResult.success && storiesResult.storyGroups) {
          setStoryGroups(storiesResult.storyGroups);
        } else {
          throw new Error(storiesResult.error);
        }
        setUploadDialogOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload story');
      console.error('Error uploading story:', err);
    }
  };

  const handleViewStory = (group: StoryGroup) => {
    if (!group || !group.stories.length) return;
    
    if (onStoryClick) {
      onStoryClick(group.userId);
    } else {
      setSelectedStoryGroup(group);
      setCurrentStoryIndex(0);
      setCurrentGroupIndex(storyGroups.findIndex(g => g.userId === group.userId));
      setProgress(0);
      setViewStoryDialogOpen(true);
    }
  };

  const handleCloseStory = () => {
    setViewStoryDialogOpen(false);
    setSelectedStoryGroup(null);
    setCurrentStoryIndex(0);
    setCurrentGroupIndex(0);
    setProgress(0);
    if (onClose) {
      onClose();
    }
  };

  const handlePrevStory = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedStoryGroup) return;

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentGroupIndex > 0) {
      const prevGroup = storyGroups[currentGroupIndex - 1];
      if (prevGroup && prevGroup.stories.length > 0) {
        setSelectedStoryGroup(prevGroup);
        setCurrentGroupIndex(prev => prev - 1);
        setCurrentStoryIndex(prevGroup.stories.length - 1);
        setProgress(0);
      }
    }
  }, [currentStoryIndex, currentGroupIndex, storyGroups, selectedStoryGroup]);

  const handleNextStory = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedStoryGroup) return;

    if (currentStoryIndex < selectedStoryGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      const nextGroup = storyGroups[currentGroupIndex + 1];
      if (nextGroup && nextGroup.stories.length > 0) {
        setSelectedStoryGroup(nextGroup);
        setCurrentGroupIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
        setProgress(0);
      } else {
        handleCloseStory();
      }
    } else {
      handleCloseStory();
    }
  }, [selectedStoryGroup, currentStoryIndex, currentGroupIndex, storyGroups]);

  useEffect(() => {
    if (viewStoryDialogOpen && selectedStoryGroup) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [viewStoryDialogOpen, selectedStoryGroup, handleNextStory]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevStory();
    } else if (e.key === 'ArrowRight') {
      handleNextStory();
    }
  }, [handlePrevStory, handleNextStory]);

  useEffect(() => {
    if (viewStoryDialogOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [viewStoryDialogOpen, handleKeyDown]);

  // Only render the story circles if no initialUserId is provided
  if (initialUserId) {
    return (
      <Dialog
        open={viewStoryDialogOpen}
        onClose={handleCloseStory}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'black',
            position: 'relative',
            aspectRatio: '9/16',
            maxHeight: '90vh',
            m: 1
          }
        }}
      >
        {selectedStoryGroup && selectedStoryGroup.stories.length > 0 && currentStoryIndex < selectedStoryGroup.stories.length && (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Progress Bars */}
            <Box sx={{ 
              position: 'absolute', 
              top: 16, 
              left: 16, 
              right: 16, 
              zIndex: 2,
              display: 'flex',
              gap: 1
            }}>
              {selectedStoryGroup.stories.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: 2,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      width: index === currentStoryIndex ? `${progress}%` : index < currentStoryIndex ? '100%' : '0%',
                      height: '100%',
                      bgcolor: 'white',
                      transition: 'width 0.1s linear'
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* User Info */}
            <Box sx={{ 
              position: 'absolute',
              top: 32,
              left: 16,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Avatar
                src={selectedStoryGroup.userImage}
                alt={selectedStoryGroup.username}
                sx={{ width: 32, height: 32 }}
              />
              <Typography color="white" variant="subtitle2">
                {selectedStoryGroup.username}
              </Typography>
            </Box>

            {/* Close Button */}
            <IconButton
              onClick={handleCloseStory}
              sx={{
                position: 'absolute',
                top: 32,
                right: 16,
                color: 'white',
                zIndex: 2
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Navigation Arrows */}
            <IconButton
              onClick={handlePrevStory}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                zIndex: 2,
                display: currentStoryIndex > 0 || currentGroupIndex > 0 ? 'flex' : 'none'
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <IconButton
              onClick={handleNextStory}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                zIndex: 2
              }}
            >
              <ChevronRightIcon />
            </IconButton>

            {/* Current Story */}
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={selectedStoryGroup.stories[currentStoryIndex]?.imageUrl || ''}
                alt={selectedStoryGroup.username}
                fill
                style={{ 
                  objectFit: 'contain',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              {selectedStoryGroup.stories[currentStoryIndex]?.caption && (
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '8px',
                    borderRadius: '4px'
                  }}
                >
                  {selectedStoryGroup.stories[currentStoryIndex].caption}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Dialog>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
          bgcolor: 'transparent',
          py: 2,
          mb: 2,
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          '& .MuiAvatar-img': {
            borderRadius: '50%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            px: 2,
            minWidth: 'min-content'
          }}
        >
          {/* Upload Story Button */}
          {session?.user?.id && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer'
              }}
              onClick={handleAddStory}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={session.user.image || ''}
                  alt="Add Story"
                  sx={{
                    width: 56,
                    height: 56,
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    bgcolor: 'background.paper',
                    border: '2px solid',
                    borderColor: 'background.paper',
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'background.paper'
                    }
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" color="primary" />
                </IconButton>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  width: 64,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                Pridať príbeh
              </Typography>
            </Box>
          )}

          {/* Story Groups */}
          {storyGroups.map((group) => (
            <Box
              key={group.userId}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer'
              }}
              onClick={() => handleViewStory(group)}
            >
              <Box sx={group.stories.length > 0 ? storyBorderGradient : {}}>
                <Avatar
                  src={group.userImage}
                  alt={group.username}
                  sx={{
                    width: 56,
                    height: 56,
                    ...(group.stories.length > 0 && { border: '2px solid white' }),
                    cursor: group.stories.length > 0 ? 'pointer' : 'default'
                  }}
                  data-has-story={group.stories.length > 0 ? "true" : "false"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (group.stories.length > 0) {
                      handleViewStory(group);
                    }
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  width: 64,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {group.userId === session?.user?.id ? 'Váš príbeh' : group.username.split(' ')[0]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <StoryUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
} 