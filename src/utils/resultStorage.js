const STORAGE_KEY = "ydplab:results";
const LAST_KEY = "ydplab:lastAnimalId";

// animalImageUrl(".../static/animals/greyheron.png")의 파일명을 결과 ID로 사용
export const getAnimalId = (result) =>
  result.animalImageUrl.split("/").pop().replace(/\.\w+$/, "");

const readAll = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

export const saveResult = (result) => {
  const animalId = getAnimalId(result);
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...readAll(), [animalId]: result })
    );
    sessionStorage.setItem(LAST_KEY, animalId);
  } catch {
    // 시크릿 모드 등 저장소를 쓸 수 없어도 결과 화면은 정적 데이터로 동작한다
  }
  return animalId;
};

export const loadResult = (animalId) => readAll()[animalId] ?? null;

export const getLastAnimalId = () => {
  try {
    return sessionStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
};
