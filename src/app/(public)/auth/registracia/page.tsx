'use client';

import { Box, Container, Typography, Paper, Button } from '@mui/material';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

export default function RegistrationPage() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!agreed) {
      setError('Musíte súhlasiť s podmienkami používania.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('google', {
        redirect: true,
        callbackUrl: '/'
      });

      if (result?.error) {
        setError('Chyba pri registrácii. Skúste znovu.');
      }
    } catch (err) {
      setError('Chyba pri registrácii. Skúste znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            <Image 
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
            Vytvorte si účet
          </Typography>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Nested square for Google button and GDPR */}
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
              onClick={handleSignUp}
              disabled={isLoading || !agreed}
              sx={{ 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                backgroundColor: agreed ? 'primary.main' : 'grey.300',
                color: agreed ? 'white' : 'grey.800',
                '&:hover': {
                  backgroundColor: agreed ? 'primary.dark' : 'grey.400'
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color={agreed ? "primary" : "inherit"} />
              ) : (
                'Registrácia cez Google'
              )}
            </Button>

            {/* GDPR agreement */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  sx={{
                    color: 'grey.500',
                    '&.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Súhlasím s{' '}
                  <Link href="/gdpr" passHref>
                    <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                      podmienkami používania
                    </Typography>
                  </Link>
                  .
                </Typography>
              }
            />
          </Paper>

          {/* Sign in prompt */}
          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
            Už máte účet?{' '}
            <Button 
              component={Link}
              href="/auth/prihlasenie"
              variant="text" 
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Prihláste sa
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
