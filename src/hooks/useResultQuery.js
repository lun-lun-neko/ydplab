import { useQuery } from "@tanstack/react-query";
import { loadResult } from "../utils/resultStorage";

// 결과 내용은 군집(동물)마다 고정이므로, 직접 제출한 결과가 없으면
// (공유 링크·새 탭) 빌드에 포함된 동물별 결과로 보여준다.
const fetchResult = async (animalId) => {
  const saved = loadResult(animalId);
  if (saved) return saved;

  const { default: results } = await import("../data/results.json");
  if (!Object.hasOwn(results, animalId)) {
    throw new Error(`Unknown animalId: ${animalId}`);
  }
  return results[animalId];
};

export const useResultQuery = (animalId) =>
  useQuery({
    queryKey: ["result", animalId],
    queryFn: () => fetchResult(animalId),
    staleTime: Infinity,
    retry: false,
  });
