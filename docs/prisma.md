# Prisma

- [Docs](https://www.prisma.io/docs/orm/overview/introduction)
- `npm i prisma` 로 설치
- `npx prisma init` 으로 초기화
  - `.env`, `prisma/schema.prisma` 파일 생성
- 배포하기 전에 sqlite (local db) 사용
  - sqlite: 호스팅 필요없음
- model 추가, 수정, 삭제 시 `npx prisma migrate dev` 명령어로 마이그레이션 수행 -> client 생성해줌
  1. 데이터베이스 변경 사항을 확인하고, 수정되었거나 삭제된 부분을 찾습니다.
  2. 새로운 변경 사항이 있다면, 그것을 시험해 볼 수 있는 별도의 데이터베이스에 먼저 적용합니다. (테스트 목적)
  3. 데이터 모델에 변화가 있으면, 그에 맞는 새로운 마이그레이션을 만듭니다.
  4. 모든 새로운 마이그레이션을 실제 데이터베이스에 적용하고, 이를 기록합니다.
  5. 필요한 코드를 자동으로 생성합니다. (Prisma Client 등..)
- 타입스크립트 활용

  - db를 조회한 결과를 반환하는 함수가 있을 떄, 자동으로 타입을 추출할 수 있음

  ```ts
  export type InitialProducts = Prisma.PromiseReturnType<typeof getProducts>;
  ```

- 사용 방법

```ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default db;
```

- 데이터 시각화
  - `npx prisma studio`
  - nextjs 서버는 계속 실행 중인 상태로 사이드 탭을 열어서 실행
  - 모델 수정 후에 마이그레이션 실행한 다음 prisma studio를 껐다가 다시 켜야함
- 스키마 예제

  ```prisma
  model User {
    id         Int       @id @default(autoincrement())
    username   String    @unique
    email      String?   @unique
    password   String?
    phone      String?   @unique
    github_id  String?   @unique
    avatar     String?
    created_at DateTime  @default(now())
    updated_at DateTime  @updatedAt
    SMSCode    SMSCode[]
  }

  model SMSCode {
    id         Int      @id @default(autoincrement())
    code       String   @unique
    created_at DateTime @default(now())
    updated_at DateTime @updatedAt
    user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    userId     Int
  }
  ```

- 데이터 생성 예제

  ```ts
  const user = await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: { id: true }, // 불필요한 데이터를 불러오지 않도록 지정
  });
  ```
