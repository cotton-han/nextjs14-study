# Infinite Scroll 구현 방법

- intersection observer 활용
- 가장 하단에 span 태그 생성 -> useRef로 참조

  - `const trigger = useRef<HTMLSpanElement>(null);`
  - (참고) useRef는 값을 변경해도 리렌더링이 발생하지 않음. 리렌더링이 됐을 때도 초기화가 되지 않음(값 유지).

  ```tsx
  const ref = useRef(1);
  ref.current = 2; // 리렌더링이 발생하지 않음
  ```

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    async (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && trigger.current && !isLoading) {
        observer.unobserve(trigger.current);
        await loadMore();
      }
    },
    { threshold: 0 }
  );
  if (trigger.current) observer.observe(trigger.current);
  return () => {
    observer.disconnect();
  };
}, [page]);
```
