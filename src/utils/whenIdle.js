// 첫 화면 자원(LCP 이미지 등)과 대역폭을 다투지 않도록 브라우저가 한가할 때 실행한다
export const whenIdle = () =>
  new Promise((resolve) => {
    const schedule = window.requestIdleCallback ?? setTimeout;
    schedule(() => resolve());
  });
