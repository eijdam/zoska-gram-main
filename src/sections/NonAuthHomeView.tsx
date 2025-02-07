import React from 'react';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      textAlign: 'center',
      bgcolor: 'primary.light',
      borderRadius: 2,
      height: '100%',
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: 6
      }
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>{title}</Typography>
    <Typography color="text.secondary">{description}</Typography>
  </Paper>
);

const NonAuthHomeView = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f3e5f5, #fff)' }}>
      {/* Hero Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                Zdieľajte svoj príbeh so svetom
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                Spojte sa s priateľmi, zdieľajte momenty a objavujte úžasný obsah z celého sveta.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large" href="/auth/registracia">
                  Zaregistrujte sa teraz
                </Button>
                <Button variant="outlined" size="large" href="/o-mne">
                  Zistite viac
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ 
                    height: 200, 
                    bgcolor: 'primary.light', 
                    borderRadius: 2, 
                    mb: 2,
                    animation: 'pulse 2s infinite'
                  }} />
                  <Box sx={{ 
                    height: 280, 
                    bgcolor: 'primary.light', 
                    borderRadius: 2,
                    animation: 'pulse 2s infinite'
                  }} />
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    height: 280, 
                    bgcolor: 'primary.light', 
                    borderRadius: 2,
                    mb: 2,
                    animation: 'pulse 2s infinite'
                  }} />
                  <Box sx={{ 
                    height: 200, 
                    bgcolor: 'primary.light', 
                    borderRadius: 2,
                    animation: 'pulse 2s infinite'
                  }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'primary.main' }}>
            Prečo si vybrať našu platformu?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                }
                title="Zdieľajte fotografie a príbehy"
                description="Zdieľajte svoje najlepšie momenty s úžasnými filtrami a kreatívnymi nástrojmi."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                }
                title="Spojte sa s priateľmi"
                description="Nájdite a sledujte priateľov, rodinu a inšpiratívnych tvorcov."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                }
                title="Zúčastnite sa a interagujte"
                description="Lajkujte, komentujte a zdieľajte príspevky zo svojej siete."
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 4, color: 'primary.main' }}>
          Pripojte sa k miliónom šťastných používateľov
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>10M+</Typography>
            <Typography variant="h6" color="text.secondary">Aktívnych používateľov</Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>50M+</Typography>
            <Typography variant="h6" color="text.secondary">Zdieľaných fotografií</Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>100+</Typography>
            <Typography variant="h6" color="text.secondary">Krajín</Typography>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>Pripravený začať?</Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>Pripojte sa k našej komunite ešte dnes a začnite zdieľať svoje momenty.</Typography>
          <Button 
            variant="contained" 
            size="large"
            href="/auth/registracia"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Vytvorte si účet
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
 
export default NonAuthHomeView;
