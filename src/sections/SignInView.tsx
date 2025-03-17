'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Head from 'next/head'; // Import Head component from Next.js

export default function SignInView() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('google', {
        redirect: true,
        callbackUrl: '/'
      });

      // Note: This code won't run if redirect is true
      if (result?.error) {
        setError('Nepodarilo sa prihlásiť cez Google. Skúste to prosím znova.');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Nastala neočakávaná chyba. Skúste to prosím znova.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Set the page title and optional meta tags */}
      <Head>
        <title>Prihlásenie | ZochovaWeb</title>
        <meta name="description" content="Prihlásenie na ZochovaWeb" />
      </Head>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="background.default"
      >
        <Box
          textAlign="center"
          padding="40px"
          boxShadow={3}
          borderRadius="16px"
          bgcolor="background.paper"
          width="100%"
          maxWidth="400px"
        >
          <Typography 
            variant="h4" 
            gutterBottom
            color="text.primary"
            sx={{ fontWeight: 'bold' }}
          >
            Prihlásenie
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ marginBottom: '20px' }}
          >
            Prihláste sa cez svoj účet Google
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSignIn}
            disabled={isLoading}
            sx={{
              width: '100%',
              padding: '12px',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Prihlásiť sa cez Google'
            )}
          </Button>

          <Typography 
            variant="body2" 
            color="text.primary"
            sx={{ marginTop: '20px', fontWeight: 'bold' }}
          >
            Nemáte účet?{' '}
            <Link href="/auth/registracia" passHref>
              <Typography 
                component="span" 
                color="primary"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                Registrujte sa
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
