// components/NavBar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SignInButton, SignOutButton } from './AuthButtons';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export const NavBar = async () => {
  const session = await getServerSession(authOptions);
  const profilePic = session?.user?.image ?? '/blank-avatar.jpg';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Activity', href: '/activities' },
    { name: 'Exercises', href: '/exercises' },
    { name: 'Workouts', href: '/workouts' },
  ] as const;

  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800 dark:bg-gray-800/50 dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-white/10"
    >
      <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Left: Logo + Desktop navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/" aria-label="Go to home">
                <Image
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop nav items */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="ml-3 flex items-center gap-3">
              {session ? (
                <>
                  <Link href="/dashboard" aria-label="Go to dashboard">
                    <Image
                      src={profilePic}
                      alt="Profile pic"
                      width={32}
                      height={32}
                      className="size-8 rounded-full bg-gray-800 object-cover outline -outline-offset-1 outline-white/10"
                      priority
                    />
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <SignInButton />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel: nav items collapse */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-2 pt-2 pb-3">
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                aria-label="Go to dashboard"
                className="flex items-center gap-2"
              >
                <Image
                  src={profilePic}
                  alt="Profile pic"
                  width={32}
                  height={32}
                  className="size-8 rounded-full bg-gray-800 object-cover outline -outline-offset-1 outline-white/10"
                  priority
                />
                <span className="text-sm text-gray-300">Dashboard</span>
              </Link>
            ) : (
              <span className="text-sm text-gray-300">Welcome</span>
            )}
          </div>
          <div>{session ? <SignOutButton /> : <SignInButton />}</div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};
