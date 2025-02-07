import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

export const metadata = { title: 'Podmienky používania | ZoskaWeb' };

export default function Podmienky() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f3e5f5, #fff)',
        pb: '60px', // Extra bottom padding set to 60px to ensure content is not hidden under the navbar
      }}
    >
      {/* Hero Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          align="center"
          sx={{ fontWeight: 'bold', mb: 4, color: 'primary.main' }}
        >
          Podmienky používania
        </Typography>
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 6, color: 'text.secondary' }}
        >
          Prečítajte si naše podmienky používania predtým, než začnete využívať naše služby.
        </Typography>
      </Container>

      {/* Terms Section */}
      <Container sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Úvod */}
          <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
            Úvod
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tieto podmienky používania (ďalej len &quot;Podmienky&quot;) upravujú prístup a používanie webovej stránky ZoskaWeb. Používaním našich služieb súhlasíte s týmito Podmienkami.
          </Typography>

          {/* Prístup a registrácia */}
          <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
            Prístup a registrácia
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Pre prístup k niektorým častiam našej webovej stránky môže byť vyžadovaná registrácia. Po registrácii ste povinní poskytovať pravdivé a aktuálne informácie. ZoskaWeb si vyhradzuje právo obmedziť alebo zablokovať prístup v prípade porušenia týchto Podmienok.
          </Typography>

          {/* Duševné vlastníctvo */}
          <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
            Duševné vlastníctvo
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Všetok obsah, vrátane textov, obrázkov, log a ďalších materiálov na tejto webovej stránke, je chránený autorskými právami. Nepovolené kopírovanie, reprodukcia alebo distribúcia obsahu bez nášho výslovného súhlasu je zakázané.
          </Typography>

          {/* Obmedzenie zodpovednosti */}
          <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
            Obmedzenie zodpovednosti
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ZoskaWeb nezodpovedá za žiadne škody vyplývajúce z používania alebo nemožnosti používania našich služieb. Používanie našich služieb je na vlastné riziko.
          </Typography>

          {/* Zmeny podmienok */}
          <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
            Zmeny podmienok
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ZoskaWeb si vyhradzuje právo kedykoľvek zmeniť tieto Podmienky. Aktuálna verzia Podmienok bude vždy zverejnená na našej webovej stránke. Pokračovaním v používaní našich služieb vyjadrujete súhlas so všetkými zmenami.
          </Typography>

          {/* Kontakt */}
          <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
            Kontakt
          </Typography>
          <Typography variant="body1">
            Ak máte akékoľvek otázky alebo pripomienky týkajúce sa týchto Podmienok, kontaktujte nás na adrese{' '}
            <a href="mailto:podpora@zoskaweb.com">podpora@zoskaweb.com</a>.
          </Typography>
        </Paper>
      </Container>

      {/* Footer Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 4 }}>
        <Container>
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} ZoskaWeb. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
