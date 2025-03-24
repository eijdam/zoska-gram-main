'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Container, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Head from 'next/head';

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

      if (result?.error) {
        setError('Chyba pri prihlásení. Skúste znovu.');
      }
    } catch (err) {
      setError('Chyba pri prihlásení. Skúste znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Prihlásenie | ZochovaWeb</title>
        <meta name="description" content="Prihlásenie na ZochovaWeb" />
      </Head>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'background.paper',
            maxWidth: 400,
            width: '100%'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            {/* Logo */}
            <Box sx={{ mb: 3 }}>
              <img 
                src="/logo.png" 
                alt="ZoskaGram logo" 
                width={120} 
                height={120} 
                style={{ marginBottom: '16px' }}
              />
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                ZoskaGram
              </Typography>
            </Box>

            {/* Welcome text */}
            <Typography variant="h6" sx={{ mb: 4 }}>
              Vitajte späť!
            </Typography>

            {/* Error message */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Nested square for Google button */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: 'background.paper',
                mb: 3
              }}
            >
              {/* Google sign-in button */}
              <Button
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={handleSignIn}
                disabled={isLoading}
                sx={{ 
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Prihláste sa cez Google'
                )}
              </Button>
            </Paper>

            {/* Register prompt */}
            <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
              Nemáte účet?{' '}
              <Button 
                component={Link}
                href="/auth/registracia"
                variant="text" 
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Registrovať sa
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
