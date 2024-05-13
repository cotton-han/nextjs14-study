import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

const getUser = async () => {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { id: true, username: true, email: true },
    });
    if (user) return user;
  }
  notFound();
};

export default async function ProfilePage() {
  const user = await getUser();

  const logout = async () => {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  };

  return (
    <div>
      <h1>Hi {user?.username}</h1>
      <form action={logout}>
        <button>log out</button>
      </form>
    </div>
  );
}
