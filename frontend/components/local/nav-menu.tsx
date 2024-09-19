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
              <Link className="hover:underline underline-offset-8" href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button className="hover:underline underline-offset-8" onClick={() => signOut()}>Sign out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button className="hover:underline underline-offset-8" onClick={() => signIn()}>Sign in</button>
            </li>
            <li>
              <Link className="hover:underline underline-offset-8" href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}