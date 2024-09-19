'use client';

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavMenu() {
  const { data: session } = useSession();

  return (
    <nav className="justify-self-end">
      <ul className="flex gap-4">
        {session ? (
          <>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={() => signOut()}>Sign out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button onClick={() => signIn()}>Sign in</button>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}