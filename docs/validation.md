# Form (Validation)

## Zod 활용

- `parse` vs `safeParse`
  - parse는 에러를 던지지만 safeParse는 에러를 던지지 않음
  - parse로 유효성 검사를 하면 try-catch 필수
  - parse는 return X, safeParse는 return O
- `safeParse`
  - success가 false인 경우 `result.error`만 하면 큰 object의 배열이 반환됨
  - `result.error.flatten()`을 해주면 작은 object로 변환됨 -> FlattenError 타입
- `safeParseAsync`
  - 검증 로직에 async/await 구문이 있는 경우 사용
  - 보통 refine에 데이터베이스를 조회하여 검증하는 경우에 사용됨
  - `spa` 로도 사용 가능
- `refine`
  - 각각의 필드마다 커스텀 validation을 수행할 수 있음
  - 비밀번호 확인의 경우 password, confirmPassword 2개의 값이 모두 필요하기 때문에 object에 refine을 지정해주면 됨.
  - 단, path를 별도로 지정하지 않으면 formErrors에 에러가 찍힘 -> global error로 인지
- `superRefine`

  - refine과 동일하게 동작하지만, 해당 검증에서 걸릴 경우 다른 검사는 진행하지 않도록 처리
  - 각 필드마다 refine에 데이터베이스 검증 로직이 있다면 매우 비효율적
  - object에 한번만 superRefine을 걸어서 쿼리를 한번만 날리는데에 사용
  - fatal을 `true`로, return을 `z.NEVER`을 해줘야 중단됨

  ```ts
  z.object(...)
    .superRefine(async ({ username }, ctx) => {
      const user = await db.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (user) {
        ctx.addIssue({
          code: "custom",
          message: "This username is already taken",
          path: ["username"],
          fatal: true, // 필수
        });
        return z.NEVER; // 필수
      }
    })
  ```

- Transformation
  - 데이터 변환
  - `` .transform((username) => `👽 ${username}`) ``
- `coerce`
  - 예를 들어 form 데이터는 input으로 받는 데이터는 숫자를 입력해도 문자열로 전달
    - number로 형변환할 때 사용
    - `z.coerce.number().min(100000).max(999999);`

```ts
import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const schema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Username is required!",
      })
      .min(3, "Way too short!!!")
      .max(10, "That is too looooong!")
      .trim()
      .toLowerCase()
      .transform((username) => `👽 ${username}`)
      .refine((username) => !username.includes("potato"), "No potatoes!"),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(4)
      .regex(
        passwordRegex,
        "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-"
      ),
    confirmPassword: z.string().min(4),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Two passwords should be equal",
        path: ["confirm_password"],
      });
    }
  });
```
