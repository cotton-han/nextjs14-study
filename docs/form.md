# Form (Server Actions)

- form action에 해당하는 함수를 server action으로 만들면 post api route를 자동으로 생성해준다.
  - network 탭에서 확인 가능
- form input에 name을 꼭 지정해야함
- action이 처리되는 상태를 알 수 있는 방법 : `useFormStatus`
  - form의 자식에서만 사용할 수 있음
- action에서 에러가 날 경우 알 수 있는 방법 : `useFormState(action, initialState)`
  - 클라이언트 컴포넌트에서는 서버 액션을 사용하면 에러가 남
    - 해결책은 actions.ts로 분리시키는 것
  - useFormState로 넘겨주는 순간 action은 인자를 2개를 받음
    - prevState, formData
    - prevState에는 처음에는 initialState가 그 다음부터는 직전에 반환된 값이 호출됨
    - initialState 타입은 action의 return 타입과 동일해야함

```ts
"use server";

export async function handleForm(prevState: any, formData: FormData) {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(formData.get("email"), formData.get("password"));

  redirect("/");

  return {
    errors: ["error1", "error2"],
  };
}
```

```tsx
// login/page.tsx
const [state, action] = useFormState(handleForm, null);

return (
  <div className="flex flex-col gap-10 py-8 px-6">
    ...
    <form action={action} className="flex flex-col gap-3">
      <FormInput
        name="email"
        type="email"
        placeholder="Email"
        required
        errors={[]}
      />
      <FormInput
        name="password"
        type="password"
        placeholder="Password"
        required
        errors={state?.errors || []}
      />
      <FormButton text="Log in" />
    </form>
    ...
  </div>
);
```

```tsx
// form-btn.tsx
"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}

export default function FormButton({ text }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "로딩 중" : text}
    </button>
  );
}
```
