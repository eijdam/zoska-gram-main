'use client';

import { useEffect, useState } from 'react';
import { 
  Container, Typography, Avatar, Box, Card, CardContent, CircularProgress, 
  Chip, ImageList, ImageListItem, IconButton, Divider, Tab, Tabs,
  Grid, Button, LinearProgress, Paper, Collapse, Alert, Dialog
} from '@mui/material';
import { 
  fetchProfileByUserId, 
  updateProfile, 
  createProfileIfNotExists, 
  toggleFollow, 
  getFollowCounts,
  isFollowing,
  getFollowersWithDetails,
  getFollowingWithDetails
} from '@/app/actions/profiles';
import { fetchPostsByUserId, fetchSavedPostsByUserId } from '@/app/actions/posts';
import { Profile, User, Post } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import MoodIcon from '@mui/icons-material/Mood';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditProfileDialog from '@/components/EditProfileDialog';
import FollowersDialog from '@/components/FollowersDialog';
import FollowingDialog from '@/components/FollowingDialog';
import { formatDistanceToNow } from 'date-fns';
import Stories from '@/components/Stories';
import { getStories } from '@/app/actions/stories';

type ProfileWithUser = Profile & {
  user: User;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const [profile, setProfile] = useState<ProfileWithUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showMoodBoard, setShowMoodBoard] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
  const [followers, setFollowers] = useState<(User & { profile: Profile | null })[]>([]);
  const [following, setFollowing] = useState<(User & { profile: Profile | null })[]>([]);
  const [hasStory, setHasStory] = useState(false);
  const [viewStoryDialogOpen, setViewStoryDialogOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Custom theme colors
  const themeColors = {
    neon: {
      purple: '#B026FF',
      blue: '#00E5FF',
      pink: '#FF3366',
      green: '#39FF14',
      yellow: '#FFE135'
    }
  };

  // Dummy data for demonstration
  const recentActivity = [
    { type: 'like', user: 'John Doe', time: '2 hours ago' },
    { type: 'comment', user: 'Jane Smith', time: '5 hours ago' },
  ];

  // Updated mood board data with new colors
  const moodData = {
    currentMood: 'Creative & Inspired',
    moodColors: [themeColors.neon.purple, themeColors.neon.pink, themeColors.neon.blue],
    recentMoods: ['Energetic', 'Thoughtful', 'Adventurous'],
    moodStats: {
      creative: 75,
      energetic: 60,
      peaceful: 85,
      adventurous: 70
    }
  };

  // AI Personality Insights (this would ideally be generated from user data)
  const personalityInsights = {
    dominantTraits: ['Creative Explorer', 'Tech Enthusiast', 'Social Connector'],
    contentStyle: 'Your content reflects a unique blend of technical expertise and artistic expression',
    postingPatterns: 'Most active during evening hours, with a focus on sharing knowledge and experiences',
    interactionStyle: 'Engages meaningfully with community, often initiating thoughtful discussions',
    recommendedConnections: ['Tech Innovators', 'Creative Professionals', 'Community Builders']
  };

  const isOwnProfile = session?.user?.id === params.userId;

  useEffect(() => {
    const loadProfileAndPosts = async () => {
      if (!params.userId) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // First ensure profile exists if it's the current user
        if (session?.user?.id === params.userId) {
          await createProfileIfNotExists(params.userId);
        }

        // Then fetch profile and posts
        const [profileData, postsData, savedPostsData] = await Promise.all([
          fetchProfileByUserId(params.userId),
          fetchPostsByUserId(params.userId),
          session?.user?.id === params.userId ? fetchSavedPostsByUserId(params.userId) : []
        ]);

        if (!profileData) {
          throw new Error('Profile not found');
        }

        setProfile(profileData);
        setPosts(postsData || []);
        setSavedPosts(savedPostsData || []);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    const checkStories = async () => {
      const result = await getStories();
      if (result.success && result.storyGroups) {
        const userHasStory = result.storyGroups.some(group => (group as any).userId === params.userId);
        setHasStory(userHasStory);
      }
    };

    loadProfileAndPosts();
    checkStories();
  }, [params.userId, session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id && params.userId) {
      checkFollowStatus();
      loadFollowCounts();
      loadFollowLists();
    }
  }, [session?.user?.id, params.userId]);

  const loadFollowCounts = async () => {
    try {
      const counts = await getFollowCounts(params.userId);
      setFollowCounts(counts);
    } catch (err) {
      console.error('Error loading follow counts:', err);
    }
  };

  const checkFollowStatus = async () => {
    if (!session?.user?.id || isOwnProfile) return;
    try {
      const following = await isFollowing(session.user.id, params.userId);
      setIsFollowingUser(following);
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const loadFollowLists = async () => {
    try {
      const [followersData, followingData] = await Promise.all([
        getFollowersWithDetails(params.userId),
        getFollowingWithDetails(params.userId)
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (err) {
      console.error('Error loading follow lists:', err);
    }
  };

  const handleFollowToggle = async () => {
    if (!session?.user?.id) {
      router.push('/auth/prihlasenie');
      return;
    }

    try {
      setIsLoadingFollow(true);
      setError(null); // Clear any previous errors
      
      console.log('Follow toggle initiated:', {
        currentUserId: session.user.id,
        targetUserId: params.userId
      });

      const isNowFollowing = await toggleFollow(session.user.id, params.userId);
      
      console.log('Follow toggle result:', { isNowFollowing });
      
      setIsFollowingUser(isNowFollowing);
      // Update follower count
      setFollowCounts(prev => ({
        ...prev,
        followers: prev.followers + (isNowFollowing ? 1 : -1)
      }));
    } catch (err) {
      console.error('Error in handleFollowToggle:', err);
      setError(err instanceof Error ? err.message : 'Failed to update follow status');
      // Reset the following state to its previous value
      await checkFollowStatus();
      // Reset the follower count
      await loadFollowCounts();
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleFollowersClick = () => {
    setIsFollowersDialogOpen(true);
  };

  const handleFollowingClick = () => {
    setIsFollowingDialogOpen(true);
  };

  const handleUnfollow = (userId: string) => {
    // Update the following list immediately in the UI
    setFollowing(prev => prev.filter(user => user.id !== userId));
    // Update the follow counts
    setFollowCounts(prev => ({
      ...prev,
      following: prev.following - 1
    }));
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Profile not found</Alert>
      </Container>
    );
  }

  const handlePostClick = (postId: string) => {
    router.push(`/prispevok/${postId}`);
  };

  const handleBackClick = () => {
    router.push('/hladanie');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProfile = async (data: { name?: string; bio?: string; location?: string }) => {
    if (!profile || !session?.user?.id) return;

    try {
      const updatedProfile = await updateProfile(session.user.id, data);
      setProfile(updatedProfile);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const CollapsibleSection = ({ 
    title, 
    icon, 
    isOpen, 
    onToggle, 
    children,
    gradientColors 
  }: { 
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    gradientColors: string[];
  }) => (
    <Paper
      sx={{
        mt: 4,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${gradientColors[0]}11 0%, ${gradientColors[1]}11 100%)`,
        border: 1,
        borderColor: `${gradientColors[0]}22`,
        borderRadius: 3,
        transition: 'all 0.3s ease'
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': {
            background: `linear-gradient(135deg, ${gradientColors[0]}22 0%, ${gradientColors[1]}22 100%)`,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {icon}
          <Typography variant="h6" sx={{ 
            background: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold'
          }}>
            {title}
          </Typography>
        </Box>
        <IconButton size="small">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isOpen}>
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );

  const handleAvatarClick = () => {
    if (hasStory) {
      setViewStoryDialogOpen(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ overflow: 'hidden' }}>
        {/* Header with back button and settings */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <IconButton onClick={handleBackClick} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>{profile.user.name}</Typography>
          {isOwnProfile && (
            <IconButton 
              sx={{ marginLeft: 'auto' }}
              onClick={() => setIsEditDialogOpen(true)}
            >
              <SettingsIcon />
            </IconButton>
          )}
        </Box>

        {/* Profile Info Section */}
        <CardContent>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={4}>
            <Box
              onClick={handleAvatarClick}
              sx={hasStory ? {
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
                padding: '2px',
                borderRadius: '50%',
                cursor: 'pointer'
              } : {}}
            >
              <Avatar
                src={profile.user.image || undefined}
                alt={profile.user.name || 'User'}
                sx={{ 
                  width: 150, 
                  height: 150,
                  ...(hasStory && { border: '3px solid white' })
                }}
                data-has-story={hasStory}
              />
            </Box>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h5">
                  {profile.user.name}
                </Typography>
                {isOwnProfile ? (
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleFollowToggle}
                    disabled={isLoadingFollow}
                  >
                    {isLoadingFollow ? (
                      <CircularProgress size={20} />
                    ) : (
                      isFollowingUser ? 'Unfollow' : 'Follow'
                    )}
                  </Button>
                )}
              </Box>
              
              <Box display="flex" gap={4} mb={3}>
                <Box textAlign="center">
                  <Typography variant="h6"><strong>{posts.length}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">posts</Typography>
                </Box>
                <Box 
                  textAlign="center" 
                  onClick={handleFollowersClick}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  <Typography variant="h6"><strong>{followCounts.followers}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">followers</Typography>
                </Box>
                <Box 
                  textAlign="center"
                  onClick={handleFollowingClick}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  <Typography variant="h6"><strong>{followCounts.following}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">following</Typography>
                </Box>
              </Box>

              {profile.bio && (
                <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                  {profile.bio}
                </Typography>
              )}
              
              {profile.location && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  📍 {profile.location}
                </Typography>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {profile.interests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest}
                      sx={{ mr: 1, mb: 1 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box sx={{ mt: 3, px: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Nedávna aktivita
            </Typography>
            {followers.slice(0, 5).map((follower) => (
              <Typography key={follower.id} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                <strong>{follower.name}</strong> vás začal sledovať • {formatDistanceToNow(new Date())} ago
              </Typography>
            ))}
            {followers.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Žiadna nedávna aktivita
              </Typography>
            )}
          </Box>

          {/* Collapsible Mood Board */}
          <CollapsibleSection
            title="Mood Board"
            icon={<MoodIcon sx={{ color: themeColors.neon.purple }} />}
            isOpen={showMoodBoard}
            onToggle={() => setShowMoodBoard(!showMoodBoard)}
            gradientColors={[themeColors.neon.purple, themeColors.neon.pink]}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Typography variant="body1">Current Mood: <strong>{moodData.currentMood}</strong></Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {moodData.moodColors.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: color,
                      boxShadow: `0 0 10px ${color}66`,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)', opacity: 1 },
                        '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                        '100%': { transform: 'scale(1)', opacity: 1 },
                      },
                      animationDelay: `${index * 0.3}s`
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              {Object.entries(moodData.moodStats).map(([mood, value]) => (
                <Box key={mood} sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ 
                    textTransform: 'capitalize',
                    mb: 0.5,
                    color: themeColors.neon.purple
                  }}>
                    {mood}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${themeColors.neon.purple}, ${themeColors.neon.pink})`,
                        boxShadow: `0 0 10px ${themeColors.neon.purple}66`
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CollapsibleSection>

          {/* Collapsible AI Insights */}
          <CollapsibleSection
            title="AI Personality Insights"
            icon={<PsychologyIcon sx={{ color: themeColors.neon.blue }} />}
            isOpen={showInsights}
            onToggle={() => setShowInsights(!showInsights)}
            gradientColors={[themeColors.neon.blue, themeColors.neon.green]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ 
                  p: 2,
                  background: `linear-gradient(135deg, ${themeColors.neon.blue}11 0%, ${themeColors.neon.green}11 100%)`,
                  borderRadius: 2,
                  border: 1,
                  borderColor: `${themeColors.neon.blue}22`
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.neon.blue }}>
                    Dominant Traits
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {personalityInsights.dominantTraits.map((trait, index) => (
                      <Chip
                        key={index}
                        label={trait}
                        sx={{
                          background: `linear-gradient(45deg, ${themeColors.neon.blue}, ${themeColors.neon.green})`,
                          color: 'white',
                          '&:hover': {
                            background: `linear-gradient(45deg, ${themeColors.neon.green}, ${themeColors.neon.blue})`
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ 
                  p: 2,
                  background: `linear-gradient(135deg, ${themeColors.neon.blue}11 0%, ${themeColors.neon.green}11 100%)`,
                  borderRadius: 2,
                  border: 1,
                  borderColor: `${themeColors.neon.green}22`
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.neon.green }}>
                    Content Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {personalityInsights.contentStyle}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ 
                  p: 2,
                  background: `linear-gradient(135deg, ${themeColors.neon.blue}11 0%, ${themeColors.neon.green}11 100%)`,
                  borderRadius: 2,
                  border: 1,
                  borderColor: `${themeColors.neon.green}22`
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.neon.green }}>
                    Posting Patterns
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {personalityInsights.postingPatterns}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ 
                  p: 2,
                  background: `linear-gradient(135deg, ${themeColors.neon.blue}11 0%, ${themeColors.neon.green}11 100%)`,
                  borderRadius: 2,
                  border: 1,
                  borderColor: `${themeColors.neon.green}22`
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.neon.green }}>
                    Interaction Style
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {personalityInsights.interactionStyle}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CollapsibleSection>
        </CardContent>

        <Divider />

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<GridOnIcon />} label="POSTS" />
          <Tab icon={<BookmarkBorderIcon />} label="SAVED" />
          <Tab icon={<AccountBoxIcon />} label="TAGGED" />
          <Tab icon={<MoodIcon />} label="MOODS" />
        </Tabs>

        {/* Posts Grid Section */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {isOwnProfile ? (
            savedPosts.length > 0 ? (
              <ImageList cols={3} gap={2} sx={{ m: 0 }}>
                {savedPosts.map((post) => (
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
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No saved posts yet
                </Typography>
              </Box>
            )
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Saved posts are only visible to you
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No tagged posts yet
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Mood History</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {moodData.recentMoods.map((mood, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: moodData.moodColors[index % moodData.moodColors.length],
                    color: 'white',
                    textAlign: 'center',
                    flex: '1 1 calc(33% - 16px)',
                    minWidth: 120
                  }}
                >
                  <Typography variant="h6">{mood}</Typography>
                  <Typography variant="caption">
                    {formatDistanceToNow(new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000))} ago
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </TabPanel>

        {isOwnProfile && profile && (
          <EditProfileDialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            profile={profile}
            onSave={handleEditProfile}
          />
        )}

        {/* Followers/Following Dialog */}
        <FollowersDialog
          open={isFollowersDialogOpen}
          onClose={() => setIsFollowersDialogOpen(false)}
          followers={followers}
          isOwnProfile={isOwnProfile}
        />

        <FollowingDialog
          open={isFollowingDialogOpen}
          onClose={() => setIsFollowingDialogOpen(false)}
          following={following}
          currentUserId={session?.user?.id || ''}
          isOwnProfile={isOwnProfile}
          onUnfollow={handleUnfollow}
        />

        {/* Story Viewing Dialog */}
        {hasStory && (
          <Stories
            initialUserId={params.userId}
            open={viewStoryDialogOpen}
            onClose={() => setViewStoryDialogOpen(false)}
          />
        )}
      </Card>
    </Container>
  );
} 