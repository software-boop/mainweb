import LogoutButton from "../shared-logout-button";
import { getSession } from "@/lib/auth-server";

export default async function AdminDashboard() {
  const session = await getSession();
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <LogoutButton />
        </header>
        <p>Hello, {session?.me?.username || session?.me?.email}.</p>
        {/* Admin widgets here */}
      </div>
    </main>
  );
}
