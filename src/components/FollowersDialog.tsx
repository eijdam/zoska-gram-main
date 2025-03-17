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
  Box,
  Typography,
  InputBase,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { User, Profile } from '@prisma/client';
import { useState } from 'react';

interface FollowersDialogProps {
  open: boolean;
  onClose: () => void;
  followers: (User & { profile: Profile | null })[];
  isOwnProfile: boolean;
}

export default function FollowersDialog({
  open,
  onClose,
  followers,
  isOwnProfile
}: FollowersDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = followers.filter(user =>
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
                {searchTerm ? 'Žiadne výsledky' : 'Žiadni sledovatelia'}
              </Typography>
            </Box>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
} 