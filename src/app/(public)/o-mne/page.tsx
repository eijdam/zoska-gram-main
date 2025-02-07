import React from 'react';
import { Box, Container, Grid, Typography, Paper, Avatar } from '@mui/material';

const AboutView = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      {/* Hero Sekcia */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 12,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
                Budovanie spojení prostredníctvom vizuálnych príbehov
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Našou misiou je pomáhať ľuďom zdieľať svoje okamihy a spájať sa s ostatnými prostredníctvom sily vizuálneho rozprávania príbehov.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: '300px' }}>
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2,
                  width: '100%',
                  maxWidth: '400px'
                }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                    <Paper
                      key={item}
                      sx={{
                        aspectRatio: '1',
                        bgcolor: 'primary.light',
                        borderRadius: 2,
                        animation: `pulse ${item % 2 ? '2s' : '3s'} infinite`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Sekcia hodnôt */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, color: 'primary.main' }}>
          Naše hodnoty
        </Typography>
        <Grid container spacing={4}>
          <ValueCard
            title="Komunita na prvom mieste"
            description="Veríme v podporu významných spojení a budovanie podpory komunity, kde sa každý cíti vítaný."
          />
          <ValueCard
            title="Kreatívne vyjadrenie"
            description="Poskytujeme nástroje a platformu pre používateľov, aby sa mohli vyjadrovať kreatívne a autenticky."
          />
          <ValueCard
            title="Ochrana súkromia a bezpečnosť"
            description="Prioritizujeme ochranu súkromia používateľov a udržiavame bezpečné prostredie pre zdieľanie a spojenie."
          />
        </Grid>
      </Container>

      {/* Sekcia tímu */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'primary.main' }}>
            Spoznajte náš tím
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <TeamMember
              name="Alex Johnson"
              role="Zakladateľ a CEO"
              description="Záujem o spájanie ľudí prostredníctvom technológie a vizuálneho rozprávania príbehov."
            />
            <TeamMember
              name="Sarah Chen"
              role="Hlavná dizajnérka"
              description="Tvorí krásne a intuitívne zážitky pre našich používateľov."
            />
            <TeamMember
              name="Mike Roberts"
              role="Vedúci komunity"
              description="Buduje a stará sa o našu úžasnú komunitu tvorcov."
            />
          </Grid>
        </Container>
      </Box>

      {/* Sekcia vízie */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ color: 'primary.main', mb: 4 }}>
              Naša vízia pre budúcnosť
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Predstavujeme si svet, kde zdieľanie okamihov spája ľudí, kde každý príbeh nájde svoje publikum a kde kreativita nepozná hranice.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Prostredníctvom neustálej inovácií a spätnej väzby komunity budujeme platformu, ktorá posilňuje tvorcov, podporuje autentické spojenia a oslavuje rozmanitosť ľudskej skúsenosti.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ 
                height: 300,
                bgcolor: 'primary.light',
                borderRadius: 2,
                animation: 'pulse 2s infinite'
              }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

interface ValueCardProps {
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description }) => (
  <Grid item xs={12} md={4}>
    <Paper
      elevation={0}
      sx={{
        p: 4,
        height: '100%',
        bgcolor: 'primary.light',
        borderRadius: 2,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
        {title}
      </Typography>
      <Typography color="text.secondary">
        {description}
      </Typography>
    </Paper>
  </Grid>
);

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, description }) => (
  <Grid item xs={12} md={4}>
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        height: '100%',
        bgcolor: 'primary.light',
        borderRadius: 2,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <Avatar
        sx={{
          width: 100,
          height: 100,
          margin: '0 auto 20px',
          bgcolor: 'primary.main'
        }}
      />
      <Typography variant="h5" sx={{ mb: 1, color: 'primary.main' }}>
        {name}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
        {role}
      </Typography>
      <Typography color="text.secondary">
        {description}
      </Typography>
    </Paper>
  </Grid>
);

export default AboutView;
