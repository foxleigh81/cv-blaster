'use client';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const LoginBox = () => {
    const { data: session } = useSession();
    return <Card className="flex flex-col w-full sm:w-96 p-8 pt-5 pb-5 gap-4 shadow-lg">
    <p className="text-lg text-center">
      Start by creating an account or logging in
    </p>
    <div className="grid grid-cols-2 gap-4">
      {
        session ? 
            <Button onClick={() => signOut()} className="bg-violet-800 text-white text-lg font-bold p-4 pt-8 pb-8 rounded-md hover:bg-violet-900 text-center">Logout</Button>
            :
            <Button onClick={() => signIn()} className="bg-violet-800 text-white text-lg font-bold p-4 pt-8 pb-8 rounded-md hover:bg-violet-900 text-center">Login</Button>
      }
      <Link href="/register" className="bg-violet-800 text-white text-lg font-bold p-4 rounded-md hover:bg-violet-900 text-center">Register</Link>
    </div>
  </Card>
};

export default LoginBox;