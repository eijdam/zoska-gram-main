// robertweb/src/app/hladanie/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { TextField, Typography, Container, Card, CardContent, Avatar, Box, CircularProgress, Dialog } from '@mui/material';
import { fetchProfiles, fetchAllProfiles } from '@/app/actions/profiles';
import { debounce } from 'lodash';
import { Profile, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { getStories } from '@/app/actions/stories';
import Stories from '@/components/Stories';

type ProfileWithUser = Profile & {
  user: User;
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<ProfileWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyGroups, setStoryGroups] = useState([]);
  const [viewStoryDialogOpen, setViewStoryDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const router = useRouter();

  // Load all profiles initially
  useEffect(() => {
    const loadInitialProfiles = async () => {
      try {
        setIsLoading(true);
        const allProfiles = await fetchAllProfiles();
        setProfiles(allProfiles);
        setError(null);
      } catch (err) {
        setError('Failed to fetch profiles');
        console.error('Error loading profiles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProfiles();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      const result = await getStories();
      if (result.success) {
        setStoryGroups(result.storyGroups);
      }
    };
    fetchStories();
  }, []);

  const handleSearch = debounce(async (term: string) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!term.trim()) {
        const allProfiles = await fetchAllProfiles();
        setProfiles(allProfiles);
      } else {
        const results = await fetchProfiles(term);
        setProfiles(results);
      }
    } catch (err) {
      setError('Failed to fetch profiles');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);
    handleSearch(newTerm);
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profil/${userId}`);
  };

  const handleAvatarClick = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Check if user has stories
    const userStoryGroup = storyGroups.find(group => group.userId === userId);
    if (userStoryGroup) {
      setSelectedUserId(userId);
      setViewStoryDialogOpen(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Vyhľadávanie používateľov
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Hľadať používateľov"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Začnite písať pre vyhľadávanie..."
        sx={{ mb: 4 }}
      />

      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {profiles.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {profiles.map((profile) => {
            const hasStory = storyGroups.some(group => group.userId === profile.userId);
            return (
              <Card 
                key={profile.id}
                onClick={() => handleProfileClick(profile.userId)}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    onClick={(e) => handleAvatarClick(profile.userId, e)}
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
                        width: 56, 
                        height: 56,
                        ...(hasStory && { border: '2px solid white' })
                      }}
                      data-has-story={hasStory}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6">{profile.user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.interests?.join(', ')}
                    </Typography>
                    {profile.bio && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {profile.bio}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          {searchTerm ? 'Neboli nájdení žiadni používatelia' : 'Žiadni používatelia nie sú k dispozícii'}
        </Typography>
      )}

      {/* Story Viewing Dialog */}
      {selectedUserId && (
        <Stories
          initialUserId={selectedUserId}
          open={viewStoryDialogOpen}
          onClose={() => {
            setViewStoryDialogOpen(false);
            setSelectedUserId(null);
          }}
        />
      )}
    </Container>
  );
}