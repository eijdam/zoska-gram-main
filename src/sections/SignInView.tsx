// src/sections/SignInView.tsx

'use client'; // Ensure this is a client component

import { signIn } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function SignInView() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <Typography variant="h4" gutterBottom>
        Prihlásenie
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => signIn('google')} // Trigger Google sign-in
        style={{ marginTop: '20px' }}
      >
        Sign in with Google
      </Button>
    </div>
  );
}