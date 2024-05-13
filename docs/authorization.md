# Authorization

- 비밀번호 해싱

  - `bcrypt` 라이브러리 활용
  - 단방향
  - 같은 비밀번호는 같은 문자열을 반환. 복호화 X

  ```ts
  const hashedPassword = await bcrypt.hash(password, 12);
  ```

- 쿠키 암호화

  - `iron-session` 라이브러리 활용
  - 양방향
  - 사용자 정보를 암호화 -> 복호화 가능

  ```ts
  const session = await getIronSession(cookies(), {
    cookieName: "karrot-session",
    password: process.env.SESSION_SECRET!,
  });
  // @ts-ignore
  session.id = user.id;
  await session.save();
  ```
