"use client";

import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem,
  Container,
  Typography,
  useTheme,
  Divider
} from '@mui/material';
import { 
  Home as HomeIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Bookmark as BookmarkIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useColorMode } from './ThemeProvider';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/prihlasenie' });
  };

  const handleProfileClick = () => {
    if (session?.user?.id) {
      router.push(`/profil/${session.user.id}`);
      handleClose();
    }
  };

  const handleSavedClick = () => {
    router.push('/ulozene');
    handleClose();
  };

  const handleThemeToggle = () => {
    toggleColorMode();
    handleClose();
  };

  const NavButton = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <IconButton color="inherit" size="medium" sx={{ p: 1 }}>
          {icon}
        </IconButton>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
          {label}
        </Typography>
      </Box>
    </Link>
  );

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={1}
      sx={{ 
        top: 'auto', 
        bottom: 0,
        backgroundColor: 'background.paper'
      }}
    >
      <Container maxWidth="sm">
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          gap: 1,
          py: 0.5, 
          minHeight: '56px',
          px: 1
        }}>
          <NavButton href="/" icon={<HomeIcon />} label="Domov" />
          {session ? (
            <>
              <NavButton href="/hladanie" icon={<SearchIcon />} label="Hľadať" />
              <NavButton href="/pridat" icon={<AddIcon />} label="Pridať" />
            </>
          ) : (
            <>
              <NavButton href="/o-mne" icon={<InfoIcon />} label="O nás" />
              <NavButton href="/auth/registracia" icon={<HowToRegIcon />} label="Registrácia" />
            </>
          )}
          {session ? (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  size="medium"
                  sx={{ p: 1 }}
                >
                  {session.user?.image ? (
                    <Avatar 
                      src={session.user.image}
                      alt={session.user.name || 'User avatar'}
                      sx={{ width: 24, height: 24 }}
                    />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
                  Profil
                </Typography>
              </Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfileClick}>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  Profil
                </MenuItem>
                <MenuItem onClick={handleSavedClick}>
                  <BookmarkIcon sx={{ mr: 1 }} />
                  Uložené
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleThemeToggle}>
                  {mode === 'dark' ? (
                    <>
                      <LightModeIcon sx={{ mr: 1 }} />
                      Svetlý režim
                    </>
                  ) : (
                    <>
                      <DarkModeIcon sx={{ mr: 1 }} />
                      Tmavý režim
                    </>
                  )}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Odhlásiť sa
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link href="/auth/prihlasenie" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <IconButton color="inherit" size="medium" sx={{ p: 1 }}>
                  <AccountCircleIcon />
                </IconButton>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
                  Prihlásiť
                </Typography>
              </Box>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
