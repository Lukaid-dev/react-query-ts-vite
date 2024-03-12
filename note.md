# Tanstack Query

Tanstack Query는 HTTP 요청을 전송하고 프론트엔드 사용자 인터페이스를 백엔드 데이터와 동기화 된 상태로 유지하는 데 이용하는 라이브러리이다.

사실 useEffect나 fetch를 이용해서도 비슷한 기능을 구현할 수 있지만, Tanstack Query는 이러한 기능을 추상화하고, 더 쉽게 사용할 수 있도록 도와준다.

Tanstack Query는 HTTP 요청을 전송하는 로직이 내장되어있지 않다.

대신 Tanstack 쿼리는 요청을 관리하는 로직을 제공한다. 요청과 관련된 데이터와 발생 가능한 오류를 추적하는 역할 등을 한다. 따라서, 요청을 전송하는 코드는 직접 작성해야 한다.

```ts
const { data, isPending, isError, error } = useQuery({
  queryKey: ["events"],
  queryFn: fetchEvents,
  staleTime: 1000 * 5, // default is 0
  gcTime: 1000 * 60 * 3, // default is 1000 * 60 * 5
});
```

### staleTime

- staleTime은 데이터가 최신으로 간주되는 시간을 밀리초 단위로 설정한다.
- 기본값은 0이며, 0으로 설정하면 데이터가 fetch된 후 즉시 stale(구식)로 간주된다.
- staleTime 값을 설정하면 데이터가 stale 상태가 되어도 컴포넌트에 계속 표시된다.
- 새로운 데이터를 fetch하기 전에 컴포넌트가 데이터를 다시 렌더링해야 하는 경우 refetch 함수를 사용해야 한다.

### gcTime

- gcTime은 캐시된 데이터가 삭제되기 전에 유지되는 시간을 밀리초 단위로 설정한다.
- 기본값은 1000 _ 60 _ 5 (5분)
- gcTime 값을 설정하면 더 이상 사용되지 않는 캐시된 데이터가 자동으로 삭제되어 메모리를 절약할 수 있다.
- gcTime은 쿼리가 비활성화된 후에만 적용된다. 쿼리가 활성화된 동안에는 캐시된 데이터가 삭제되지 않는다.
