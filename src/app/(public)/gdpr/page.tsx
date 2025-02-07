'use client'; // Mark the component as a Client Component

import React from 'react';
import '@fontsource/poppins'; // Načítanie písma Poppins
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Head from 'next/head'; // Import Head component for dynamic metadata

export default function GDPR() {
  const router = useRouter(); // Initialize the router from next/navigation

  const handleGoBack = () => {
    router.back(); // This method takes the user to the previous page
  };

  return (
    <>
      <Head>
        <title>GDPR | ZoskaWeb</title>
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #f3e5f5, #fff)',
          fontFamily: 'Poppins, sans-serif', // Aplikovanie vlastného písma globálne
          pb: '60px', // Nastavenie dolného okraja, aby sa zabezpečilo, že obsah nebude skrytý pod navigáciou
        }}
      >
        {/* Back Button Section */}
        <Container sx={{ py: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoBack}
            sx={{
              display: 'block',
              margin: '0 auto',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '10px 20px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            Späť
          </Button>
        </Container>

        {/* Úvodná sekcia */}
        <Container sx={{ py: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{ fontWeight: 'bold', mb: 4, color: 'primary.main' }}
          >
            GDPR súlad a politika ochrany osobných údajov
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: 'text.secondary' }}
          >
            V ZoskaGram sa zaviazali chrániť vaše osobné údaje a zabezpečiť transparentnosť v našich praktikách správy údajov.
          </Typography>
        </Container>

        {/* Sekcia informácií o GDPR */}
        <Container sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
              Naša zodpovednosť voči vašej ochrane súkromia
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ZoskaWeb rešpektuje vaše súkromie a zaväzuje sa chrániť vaše osobné údaje v súlade s nariadením EÚ o ochrane osobných údajov (GDPR).
              Implementovali sme opatrenia na ochranu vašich údajov a poskytovanie transparentnosti o ich zbieraní a používaní.
            </Typography>

            <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
              Zbieranie a používanie údajov
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Zbierame osobné údaje len na špecifické účely a spracovávame ich zákonným, spravodlivým a transparentným spôsobom.
              Môže to zahŕňať údaje ako vaše meno, e-mailová adresa a správanie pri prehliadaní našich stránok. Tieto údaje používame na zlepšenie našich služieb,
              komunikáciu s vami a zabezpečenie najlepšej používateľskej skúsenosti.
            </Typography>

            <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
              Vaše práva podľa GDPR
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Podľa GDPR máte právo na prístup, opravu alebo vymazanie vašich osobných údajov.
              Taktiež máte právo obmedziť alebo namietať proti ich spracovaniu. Ak máte akékoľvek otázky alebo chcete uplatniť svoje práva, prosím kontaktujte nášho
              poverenca na ochranu údajov na <a href="mailto:dpo@zoskaweb.com">dpo@zoskaweb.com</a>.
            </Typography>

            <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
              Politika používania cookies
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Naša stránka používa cookies na zlepšenie používateľskej skúsenosti, analýzu návštevnosti a poskytovanie personalizovaného obsahu.
              Používaním našich stránok súhlasíte s používaním cookies v súlade s našou politikou používania cookies.
            </Typography>

            <Typography variant="h4" sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
              Kontaktujte nás
            </Typography>
            <Typography variant="body1">
              Ak máte akékoľvek otázky alebo obavy týkajúce sa našich praktík GDPR, neváhajte nás kontaktovať na <a href="mailto:privacy@zoskaweb.com">privacy@zoskaweb.com</a>.
            </Typography>
          </Paper>
        </Container>

        {/* Sekcia päty */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 4 }}>
          <Container>
            <Typography variant="body1" align="center">
              © {new Date().getFullYear()} ZoskaWeb. Všetky práva vyhradené.
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
}
