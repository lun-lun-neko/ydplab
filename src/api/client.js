// axios(약 35KB)를 첫 화면 번들에서 빼기 위해 처음 요청할 때 불러온다
export const getClient = () => import("./instance").then((m) => m.default);
