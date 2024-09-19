'use client';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

const LoginBox = () => {
    const { data: session } = useSession();
    return <div className="grid grid-cols-2 gap-4 max-w-80">
      {
        session ? 
            <Button onClick={() => signOut()} className="bg-violet-800 text-white text-lg font-bold p-4 pt-8 pb-8 rounded-md hover:bg-violet-900 text-center">Logout</Button>
            :
            <Button onClick={() => signIn()} className="bg-violet-800 text-white text-lg font-bold p-4 pt-8 pb-8 rounded-md hover:bg-violet-900 text-center">Login</Button>
      }
      <Link href="/register" className="bg-violet-800 text-white text-lg font-bold p-4 rounded-md hover:bg-violet-900 text-center">Register</Link>
    </div>
  
};

export default LoginBox;