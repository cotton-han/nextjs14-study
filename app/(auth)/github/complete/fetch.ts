export async function getAccessToken(
  code: string
): Promise<string | undefined> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const res = await fetch(
    `https://github.com/login/oauth/access_token?${accessTokenParams}`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    }
  );

  const { access_token, error } = await res.json();

  if (error) console.log(`github access token error: ${error}`);

  return access_token;
}

interface UserInfoResponse {
  id: string;
  avatar: string;
  username: string;
}

export async function getUserInfo(
  accessToken: string
): Promise<UserInfoResponse> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });
  const { id, avatar_url, login } = await res.json();

  return { id: id + "", avatar: avatar_url, username: login };
}

export async function getUserEmail(accessToken: string): Promise<string> {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });
  const emails = await res.json();
  const primaryEmail = emails.find(
    (email: any) =>
      email.primary && email.verified && email.visibility === "public"
  );
  return primaryEmail.email;
}
