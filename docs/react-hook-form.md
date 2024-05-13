# React Hook Form

- Next.js에서 꼭 필수는 아님
  - 개인적으로는 사용하지 않는 코드가 더 깔끔해보임
  - 프론트엔드에서도 validation을 할 수 있다는 점은 장점
- app/products/add 에서 사용 예시를 볼 수 있음
- 설치
  - react-hook-form
  - @hookform/resolvers

```ts
const { register } = useForm<ProductType>({
  resolver: zodResolver(productSchema), // productSchema를 백엔드, 프론트엔드 모두 공유
});

// schema.ts (공통으로 사용하기 위해 action으로부터 분리)
import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
});

export type ProductType = z.infer<typeof productSchema>;
```

- 사용자 정의 컴포넌트로 register의 props을 넘겨줄 때 ref를 넘겨주는 부분에서 에러가 발생한다.

  - 해결 방법 : 컴포넌트를 arrow function으로 변경하고 forwardRef로 감싼 뒤 ref를 전달해주면 된다.

  ```tsx
  import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

  interface InputProps {
    name: string;
    errors?: string[];
  }

  const _Input = (
    {
      name,
      errors,
      ...rest
    }: InputProps & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          name={name}
          className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
          {...rest}
        />
        {errors?.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">
            {error}
          </span>
        ))}
      </div>
    );
  };

  export default forwardRef(_Input);
  ```
