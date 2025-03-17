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
  Typography,
  InputBase,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { User, Profile } from '@prisma/client';
import { useState } from 'react';
import { toggleFollow } from '@/app/actions/profiles';
import { useRouter } from 'next/navigation';

interface FollowingDialogProps {
  open: boolean;
  onClose: () => void;
  following: (User & { profile: Profile | null })[];
  currentUserId: string;
  isOwnProfile: boolean;
  onUnfollow?: (userId: string) => void;
}

export default function FollowingDialog({
  open,
  onClose,
  following,
  currentUserId,
  isOwnProfile,
  onUnfollow
}: FollowingDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFollowing, setLocalFollowing] = useState(following);
  const router = useRouter();

  // Update local state when props change
  useState(() => {
    setLocalFollowing(following);
  }, [following]);

  const handleUnfollow = async (userId: string) => {
    try {
      await toggleFollow(currentUserId, userId);
      // Update local state
      setLocalFollowing(prev => prev.filter(user => user.id !== userId));
      // Call parent callback if provided
      if (onUnfollow) {
        onUnfollow(userId);
      }
      router.refresh();
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const filteredUsers = localFollowing.filter(user =>
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
          <Typography variant="h6">Sledovaní</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

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
                isOwnProfile && (
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
                {searchTerm ? 'Žiadne výsledky' : 'Žiadne sledovania'}
              </Typography>
            </Box>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
} 