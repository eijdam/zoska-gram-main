'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { Card, CardContent, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function SignUpView() {
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
      
      // Note: This code won't run if redirect is true
      if (result?.error) {
        setError('Nepodarilo sa prihlásiť cez Google. Skúste to prosím znova.');
      }
    } catch (err) {
      console.error('Sign-up error:', err);
      setError('Nastala neočakávaná chyba. Skúste to prosím znova.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            color="text.primary"
          >
            Registrácia
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) {
                    setError(null);
                  }
                }}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Súhlasím s{' '}
                <Link href="/gdpr" passHref>
                  <Typography
                    component="span"
                    color="primary"
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    GDPR
                  </Typography>
                </Link>{' '}
                a{' '}
                <Link href="/podmienky" passHref>
                  <Typography
                    component="span"
                    color="primary"
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Podmienkami používania
                  </Typography>
                </Link>
              </Typography>
            }
            sx={{ marginBottom: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ marginTop: 2, marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSignUp}
            disabled={!agreed || isLoading}
            sx={{
              marginTop: 3,
              width: '100%',
              padding: '12px',
              fontWeight: 'bold',
              backgroundColor: agreed ? '#1976d2' : '#B0BEC5',
              '&:hover': {
                backgroundColor: agreed ? '#1565c0' : '#B0BEC5',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Registrovať sa cez Google'
            )}
          </Button>

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ marginTop: 3 }}
          >
            Máte už účet?{' '}
            <Link href="/auth/prihlasenie" passHref>
              <Typography
                component="span"
                color="primary"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                Prihláste sa
              </Typography>
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
