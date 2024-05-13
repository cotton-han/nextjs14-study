import { login } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest } from "next/server";
import { getAccessToken, getUserEmail, getUserInfo } from "./fetch";
import { checkUsername } from "./validate";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) return new Response(null, { status: 400 });

  const accessToken = await getAccessToken(code);

  if (accessToken === undefined) return new Response(null, { status: 400 }); // 또는 redirect("/github/error")

  const { id, avatar, username } = await getUserInfo(accessToken);
  const email = await getUserEmail(accessToken);

  const user = await db.user.findUnique({
    where: { github_id: id },
    select: { id: true },
  });

  let userId = user?.id;

  if (!userId) {
    const existsUsername = await checkUsername(username);
    const newUser = await db.user.create({
      data: {
        github_id: id,
        avatar,
        username: existsUsername ? username + "_gh" : username,
        email,
      },
      select: { id: true },
    });
    userId = newUser.id;
  }

  await login(userId);
}
