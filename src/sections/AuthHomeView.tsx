// src/sections/AuthHomeView.tsx

'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Typography from '@mui/material/Typography';

export default function AuthHomeView() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Typography variant="h5" align="center">Loading...</Typography>;
  }

  if (session) {
    redirect('/prispevok'); 
  }

  return (
    <Typography variant="h5" align="center">
      Redirecting...
    </Typography>
  

  );
}