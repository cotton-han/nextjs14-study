import db from "@/lib/db";

export async function checkUsername(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return !!user;
}
