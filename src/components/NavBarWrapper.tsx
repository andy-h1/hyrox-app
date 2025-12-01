'use client';

import { usePathname } from 'next/navigation';
import { NavBar } from './NavBar';

export function NavBarWrapper() {
  const pathname = usePathname();

  // Don't show NavBar on landing page
  if (pathname === '/') {
    return null;
  }

  return <NavBar />;
}
