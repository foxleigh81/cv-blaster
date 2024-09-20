import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const getUser = async () => {
    const response = await fetch(`${process.env.API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,  // Send the backend JWT token
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user:', await response.text());
      throw new Error('Failed to fetch user');
    }

    const userData = await response.json();

    return userData;
  };

  try {
    const user = await getUser();
    return (
      <div>
        <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
        <p className="mb-3">Welcome, <strong className="text-indigo-500">{session.user.name}</strong>!</p>
        { user.is_admin && <p> Ooh, you are an <strong className="text-red-500">admin</strong>! I am at your service, my lord! 👑</p> }
        <pre className="mt-3 p-5 bg-slate-400 rounded-lg">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    console.error('Failed to load user data:', error);
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Failed to load user data. Please try again later.</p>
      </div>
    );
  }
}