import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const session = await getServerSession();

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user.name}!</p>
        </div>
    );
}