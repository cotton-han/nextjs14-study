# Next.js Tip

- 모든 페이지와 컴포넌트는 기본적으로 서버에서 렌더링된다.
  - use client -> 클라이언트단에서 렌더링된다는 뜻이 아님
    - 서버 사이드 렌더링은 모든 컴포넌트에 발생하지만, 모든 컴포넌트들이 hydration되는건 아니다.
    - `"use client"` 라고 되어있는 컴포넌트들만 hydration 된다.
  - hydration : HTML이 보이고나서 React 컴포넌트가 되는 과정
    - ex) `/about 진입 -> 단순 HTML -> 사용자 -> hydration(React application 초기화)`
    - use client 컴포넌트는 초기에는 서버에서 상태의 초기값과 리스너가 없는 상태로 html 렌더링이 돼서 사용자에게 전달한 다음 hydration을 통해 리액트 컴포넌트가 되는 것.
- Link는 클라이언트 사이드 네비게이션
  - Link를 사용하면 링크가 뷰포트에 나타날 때 pre-fetch를 함
  - Link를 사용하는게 성능 최적화와 사용자 경험 측면에서 권장
  - 다른 도메인으로의 링크나 페이지 외부로의 링크인 경우에는 a 태그를 사용하는 것이 적합할 수 있음
  - prefetch 옵션 (production 모드에서만 활성화)
    - null(default), true, false
    - null : static, dynamic인지에 따라 동작이 다름. 정적 라우팅은 모두 prefetch되고, 동적 라우팅은 loading.js boundary의 가장 가까운 세그먼트를 prefetch 함
- 서버 컴포넌트에서 버튼에 핸들러를 달고싶은 경우 방법은 2가지

  - 클라이언트 컴포넌트로 분리
  - form 활용

  ```tsx
  <form action={logout}>
    <button>log out</button>
  </form>
  ```

- middleware

  - app, components와 동일한 위치에 middleware.ts 생성
  - 모든 request 마다 실행

    - request.nextUrl.pathname을 콘솔에 찍어보면 어떤 요청에 호출됐는지 확인 가능
    - 모든 요청마다 실행되지 않도록 matcher를 활용할 수 있음

    ```ts
    export const config = {
      matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    };
    ```

  - redirect를 하기 위해서는 절대 경로를 사용해야함
    - `new URL("/", request.url)`
  - Edge runtime에서 실행 -> 빠르게 실행되기 위함
    - 제한된 버전의 node.js
    - [edge runtime에서 사용 가능한 API](https://nextjs.org/docs/app/api-reference/edge)

- url을 검색할 때 array 안에 포함여부를 검색하는 것보다 object로 string-boolean 값으로 검색하는게 약간 더 빠름

  ```ts
  const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
  };
  ```

- Image 컴포넌트

  - width, height를 적는 이유 : layout shift가 일어나지 않도록 placeholder를 두기 위함
  - 이미지가 로드되는 동안 placeholder 같은 transparent 박스를 갖게되는데 설정한 width, height만큼으로 생성
  - 얼마나 큰지 모르는 경우, width, height를 지우고 fill을 지정하는 방법이 있음
    - 자동으로 `position: absolute`로 지정되고 `width: 100%, height: 100%`로 설정됨
    - 부모 요소에 relative와 size를 지정해주면됨
    - border-radius를 지정해주려면 overflow:hidden도 같이 적용해야함
    - 직사각형의 이미지의 경우 정사각형 프레임에 이미지가 변형되어 들어가는 일이 발생할 수 있음 -> object-fit: cover나 contain으로 해결 가능

  ```tsx
  <div className="relative size-28 rounded-md overflow-hidden">
    <Image fill src={photo} alt={title} className="object-cover" />
  </div>
  ```

- cache
  - 페이지 단위 캐시 (ex) 삭제 후 목록 화면으로 진입하는 경우 등)
    - `revalidatePath("/products");`
