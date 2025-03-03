'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Box, CircularProgress } from "@mui/material"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkAuth = () => {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        router.replace("/auth/prihlasenie");
        return;
      }

      setIsLoading(false);
    };

    // Initial check
    checkAuth();

    // Set up periodic checks
    timeoutId = setInterval(checkAuth, 1000);

    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
}