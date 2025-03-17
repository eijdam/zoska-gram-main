// robertweb/src/app/profil/page.tsx

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Container, Typography } from '@mui/material';

export default function ProfileRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      router.replace(`/profil/${session.user.id}`);
    } else if (status === 'unauthenticated') {
      router.replace('/auth/prihlasenie');
    }
  }, [session, status, router]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Loading your profile...
        </Typography>
      </Box>
    </Container>
  );
}