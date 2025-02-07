"use client"

import * as React from "react"
import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import IconButton from "@mui/material/IconButton"
import HomeIcon from "@mui/icons-material/Home"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import LogoutIcon from "@mui/icons-material/Logout"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import LoginIcon from "@mui/icons-material/Login"
import InfoIcon from "@mui/icons-material/Info"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import PersonIcon from "@mui/icons-material/Person" // Import missing PersonIcon
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { useColorMode } from "@/components/ThemeProvider"

export default function BottomNavbar() {
  const [value, setValue] = React.useState(0)
  const { data: session } = useSession()
  const { toggleColorMode, mode } = useColorMode()

  const commonItems = [{ label: "Domov", icon: <HomeIcon />, href: "/" }]
  const authenticatedItems = [
    { label: "Hľadať", icon: <SearchIcon />, href: "/hladanie" },
    {
      label: "Profily",
      icon: session?.user?.image ? (
        <Image
          src={session.user.image || "/placeholder.svg"}
          alt="Profile"
          width={24}
          height={24}
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <PersonIcon />
      ), // Use PersonIcon here
      href: "/profil",
    },
    { label: "Pridať", icon: <AddIcon />, href: "/pridat" },
    { label: "Odhlásiť", icon: <LogoutIcon />, href: "/auth/odhlasenie" },
  ]

  const unauthenticatedItems = [
    { label: "O mne", icon: <InfoIcon />, href: "/o-mne" },
    { label: "Prihlásenie", icon: <LoginIcon />, href: "/auth/prihlasenie" },
    { label: "Registrácia", icon: <PersonAddIcon />, href: "/auth/registracia" },
  ]

  const navItems = [...commonItems, ...(session ? authenticatedItems : unauthenticatedItems)]

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
        sx={{
          backgroundColor: "background.paper",
          "& .MuiBottomNavigationAction-root": {
            color: mode === "dark" ? "pink.main" : "text.secondary",
            "&.Mui-selected": {
              color: mode === "dark" ? "pink.main" : "primary.main",
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            component={Link}
            href={item.href}
            sx={{
              minWidth: "auto",
              padding: "6px 12px",
              fontSize: "0.75rem",
            }}
          />
        ))}
        <IconButton
          onClick={toggleColorMode}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: mode === "dark" ? "pink.main" : "text.secondary",
          }}
          aria-label="toggle theme"
        >
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </BottomNavigation>
    </Box>
  )
}

