// src/sections/SignUpView.tsx

'use client'; // This makes the component a Client Component

import { signIn } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function SignUpView() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <Typography variant="h4" gutterBottom>
        Registrácia
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please sign up using your Google account.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => signIn('google')} // Trigger Google sign-in
        style={{ marginTop: '20px' }}
      >
        Register with Google
      </Button>
    </div>
  );
}