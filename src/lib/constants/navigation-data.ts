// src/lib/constants/navigation-data.ts

export const mainNavItems = [
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Help", href: "/help" },
];

// Definisikan link untuk pengguna yang sudah login
export const getUserNavItems = (userType: "user" | "tenant") => [
  { name: "Profile", href: userType === "tenant" ? "/tenant/dashboard" : "/profile" },
];

// Definisikan link untuk tamu (belum login)
export const guestNavItems = [
  { name: "Login", href: "/auth/login" },
  { name: "Sign Up", href: "/auth/register", isPrimary: true }, // Tambahkan flag untuk styling khusus
];