import { redirect } from "next/navigation";

export function GET() {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    // redirect_url을 안적은 이유: github에서 이미 설정했기 때문
    scope: "read:user,user:email",
  });

  return redirect(`${baseUrl}?${params.toString()}`);
}
