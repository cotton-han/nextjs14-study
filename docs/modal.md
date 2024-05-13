# Intercepting Routes & Parallel Routes

- 모달에 활용 가능
  - [공식 문서](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
  - 인스타그램의 모달 방식과 유사하게 구현 가능
    - 게시글 중 하나를 클릭하면 모달이 뜨고 url이 달라진다.
    - 새로고침하면 상세 페이지로 이동한다.
- pages router에도 해당 기능은 존재
  - [공식 문서](https://nextjs.org/docs/getting-started/project-structure#parallel-and-intercepted-routes)

## [Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)

- 사용자가 특정 페이지(예: `/products/[id]`)로 이동하려고 할 때 해당 페이지 대신 다른 컴포넌트를 보여줄 수 있다.
- 단, 새로고침하면 원래의 페이지가 보여진다.
- 폴더명 규칙이 있음
  - 현재 경로가 `/home`일 떄, `/products/[id]`를 가로채기 위해서는 `(..)products/[id]/page.tsx` 를 생성해야함
    - (..) 의 의미는 import...from... 경로 탐색 로직과 동일
      - `(.)` : 현재 경로
      - `(..)` : 상위 경로
      - `(..)(..)` : 상위의 상위 경로
      - `(...)` : / 경로
    - 폴더 경로가 아니라 URL 기준 경로라는 것에 주의
      - (tabs)와 같은 route group은 무시됨

## [Parellel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)

-
