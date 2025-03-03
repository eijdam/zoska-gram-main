'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Box, CircularProgress } from "@mui/material"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeoutId = setInterval(() => {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        router.replace("/auth/prihlasenie");
        return;
      }

      setIsLoading(false);
    }, 1000);

    return () => {
      clearInterval(timeoutId);
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