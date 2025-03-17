import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Box,
  Tab,
  Tabs,
  Typography,
  InputBase,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { User, Profile } from '@prisma/client';
import { toggleFollow } from '@/app/actions/profiles';
import { useRouter } from 'next/navigation';

interface FollowDialogProps {
  open: boolean;
  onClose: () => void;
  followers: (User & { profile: Profile | null })[];
  following: (User & { profile: Profile | null })[];
  currentUserId: string;
  initialTab?: 'followers' | 'following';
}

export default function FollowDialog({
  open,
  onClose,
  followers,
  following,
  currentUserId,
  initialTab = 'followers'
}: FollowDialogProps) {
  const [tab, setTab] = useState<'followers' | 'following'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'followers' | 'following') => {
    setTab(newValue);
  };

  const handleUnfollow = async (userId: string) => {
    await toggleFollow(currentUserId, userId);
    router.refresh();
  };

  const filteredUsers = (tab === 'followers' ? followers : following).filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Sledovatelia</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab 
            label={`Sledovatelia (${followers.length})`} 
            value="followers"
          />
          <Tab 
            label={`Sledovaní (${following.length})`} 
            value="following"
          />
        </Tabs>
      </Box>

      <DialogContent>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <SearchIcon sx={{ p: '10px' }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Hľadať"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Paper>

        <List>
          {filteredUsers.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                tab === 'following' && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    Odstrániť
                  </Button>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={user.image || undefined} alt={user.name || 'User'} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name || 'Unnamed User'}
                secondary={user.email}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  style: { fontWeight: 600 }
                }}
              />
            </ListItem>
          ))}
          {filteredUsers.length === 0 && (
            <Box textAlign="center" py={3}>
              <Typography color="text.secondary">
                {searchTerm ? 'No results found' : 'No users found'}
              </Typography>
            </Box>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
} 