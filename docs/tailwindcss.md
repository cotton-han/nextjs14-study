# Tailwindcss

- 기본적으로 모바일 우선
- JIT Compiler
  - css 파일이 아닌 컴파일러
  - 저장할 때마다 파일을 스캔해서 class name들을 추출하고 css 코드로 변환
- directive

  - `@tailwindcss` : placeholder 역할
    - base: 기본 스타일(reset style)
    - utilities: 코드상에 작성된 클래스
    - components: ???
  - `@apply` : 공통 스타일을 정의할 수 있음

    - 별도의 리액트 컴포넌트로 분리하는걸 더 권장

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    .btn {
      @apply w-full bg-black h-10 text-white rounded-lg;
    }
    ```

  - `@layer` : 확장 (config 파일에서 가능하기 때문에 굳이 필요 없음)

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* 기본값 확장 */
    @layer base {
      a {
        @apply text-blue;
      }
    }

    /* 모든 곳에서 사용할 수 있는 새로운 class */
    @layer utilities {
      .text-bigger-hello {
        @apply text-3xl font-bold;
      }
    }

    /* class들을 추상화하는 컴포넌트 (스타일은 동일한데 컴포넌트로 분리가 어려운 경우(a, button) 사용) */
    @layer components {
      .btn {
        @apply w-full bg-black h-10 text-white rounded-lg;
      }
    }
    ```

  - plugin으로 각각을 확장할 수 있음
    - 다른 사람이 만들어놓은 base, components, utilities를 설치함으로써 사용할 수 있는 기능
    - `@tailwindcss/forms` : form 관련 reset style 추가
    - [daisyUI](https://daisyui.com/) : component class names 추가

- width, height가 동일하면 size 사용
- `dark:` -> 이렇게만 쓰면 os 테마 설정이 자동으로 적용됨.
- max width -> `max-w-screen-sm` 도 있음
- ring
  - outline 대신 사용할 수 있는 값
  - 보통 outline을 none으로 설정하고 ring으로 커스터마이징
  - 요소 크기를 변경하지않고 테두리 값을 지정할 수 있음
  - ring은 그림자 효과이기 때문에 `transition-shadow`로 적용해야함
  - `ring-[number]` : ring 두께
  - `ring-[color]` : ring 컬러
  - `ring-offset-[number]` : 요소와 ring 사이 거리
  - `ring-offset-[color]` : 요소와 ring 사이의 컬러
- border, outline, ring의 차이
  - border는 요소의 테두리. 요소의 실제 경계를 형성
  - outline은 요소 바깥쪽에 선을 그리고 border와 달리 박스 모델의 일부로 계산되지 않아 요소의 크기나 레이아웃에 영향을 주지 않음
  - ring은 유틸리티. 요소 주위에 그림자 효과를 추가하여 윤곽선처럼 보이게 하는 기능. focus에서 주로 사용. 실제 요소의 크기나 레이아웃에 영향을 주지 않음
- `placeholder:`
  - placeholder에 스타일 적용 가능
  - ex) `placeholder:drop-shadow` `placeholder:text-red`
- 그라데이션 배경
  - `bg-gradient-to-[어느 방향으로..]`
    - `from-[color]`, `to-[color]` 지정 필요
    - `via-[color]` : 중간 색 지정도 가능
- form modifier

  - `invalid` : input이 유효하지 않을 때 적용
  - `peer` : 형제 요소에 따라 영향을 받게 할 수 있음

    ```tsx
    <div>
      <input type="email" required className="peer" />
      <span className="text-red-500 font-bold hidden peer-invalid:block">
        Email is required
      </span>
    </div>
    ```

- state modifier
  - `*` : 자식 컴포넌트들에게 일괄 적용
    - ex) `*:outline-none`
  - `has` : 자식 컴포넌트 중 특정 상태, id 또는 클래스를 가진 컴포넌트가 있다면 적용
    - ex) `has-[.peer]` `has-[:invalid]`
- list modifier
  - `odd` `even` `first` `last`
  - `empty` : 값이 비어있을 때 적용
    - ex) 스켈레톤 로딩
- group modifier

  - has의 반대 개념
  - 부모 요소에 상태에 자식 요소가 영향을 받게하고 싶을 때 사용

  ```tsx
  <div className="group">
    <div />
    <div className="group-hover:text-red-300">data</div>
  </div>
  // group 안에 input 포커스 여부에 따라 span을 숨김 처리하고 싶을 때
   <div className="group">
    <input type="email" placeholder="Write your email" />
    <span className="group-focus-within:block hidden">Make sure it is a valid email...</span>
    <button>Submit</button>
  </div>
  ```
