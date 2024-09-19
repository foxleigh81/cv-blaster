
import { getServerSession } from 'next-auth';
import LoginBox from '@/components/local/login-box';

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
    {session?.user?.name ? (
      <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
        Welcome, {session.user.name}!
      </div>
      ) : (
        <LoginBox />
      )
  }
  </>
  );
}
