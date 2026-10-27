import { useQuery } from "@tanstack/react-query";
import instance from "../api/instance";

// 설문을 푸는 동안 잠든 서버를 미리 깨워 제출 대기 시간을 줄인다
export const useWarmUpServer = () =>
  useQuery({
    queryKey: ["ping"],
    queryFn: () => instance.get("/").then(() => true),
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });
