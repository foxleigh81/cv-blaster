
import { getServerSession } from 'next-auth';
import { redirect } from "next/navigation";
import LoginBox from '@/components/local/login-box';

export default async function Home() {
  const session = await getServerSession();

  if (session && session.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className='font-extrabold text-4xl mb-3'>Well hello there!</h2>
      <p>
        Welcome to CVBlaster, your all-in-one platform for managing and showcasing your professional journey. 
      </p>
      <p>
        Seamlessly add and organize your unique skills, track your experience levels, and document your career history—all within an intuitive and user-friendly interface. 
      </p>
      <p>Whether you’re building a standout resume, preparing for interviews, or simply keeping a personal record of your growth, CVBlaster empowers you to present your expertise with confidence and clarity.</p>
      <p className='font-bold mt-4'>Join CVBlaster today and take control of your professional narrative!</p>
      <hr className='my-4 border-b-1 border-primary' />
      <LoginBox />
    </div>
  );
}
