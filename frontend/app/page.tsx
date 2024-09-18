import { Card } from '@/components/ui/card';
export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col w-full gap-4 row-start-1 items-start sm:items-start bg-violet-800 text-white p-5">
        <div className="grid grid-cols-2 w-full">
          <h1 className="text-3xl sm:text-4xl font-bold">CV Generator</h1>
          <nav className="justify-self-end">
            <ul className="flex gap-4">
              <li>
                <a className="underline underline-offset-8 decoration-dotted hover:decoration-solid hover:decoration-violet-950" href="/login">Login</a>
              </li>
              <li>
                <a className="underline underline-offset-8 decoration-dotted hover:decoration-solid hover:decoration-violet-950" href="/register">Register</a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="text-lg text-center sm:text-left">
          Generate a CV easily with a few clicks
        </p>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card className="flex flex-col w-full sm:w-96 p-8 pt-5 pb-5 gap-4 shadow-lg">
          <p className="text-lg text-center">
            Start by creating an account or logging in
          </p>
          <div className="grid grid-cols-2 gap-4">
            <a href="/login" className="bg-violet-800 text-white text-lg font-bold p-4 rounded-md hover:bg-violet-900 text-center">Login</a>
            <a href="/register" className="bg-violet-800 text-white text-lg font-bold p-4 rounded-md hover:bg-violet-900 text-center">Register</a>
          </div>
        </Card>
      </main>
    </div>
  );
}
