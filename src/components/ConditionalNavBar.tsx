'use client';

import { usePathname } from 'next/navigation';
import { NavBar } from './NavBar';

export function ConditionalNavBar() {
  const pathname = usePathname();

  // Don't show NavBar on landing page, login page, or during workout logging
  const hideNavBarPaths = ['/', '/login', '/dashboard/log-workout'];
  const showNavBar = !hideNavBarPaths.includes(pathname);

  if (!showNavBar) return null;

  return <NavBar />;
}
