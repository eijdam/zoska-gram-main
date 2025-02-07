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
import { Card, CardContent } from '@mui/material';

export default function SignUpView() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(false);

  const handleSignUp = () => {
    if (!agreed) {
      setError(true);
      return;
    }
    signIn('google');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default" // Use theme background color
    >
      <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            color="text.primary" // Ensure this inherits the primary text color based on the theme
          >
            Registrácia
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setError(false);
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
            <Alert severity="error" sx={{ marginTop: 2 }}>
              Musíte súhlasiť s podmienkami používania.
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSignUp}
            disabled={!agreed}
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
            Register with Google
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
