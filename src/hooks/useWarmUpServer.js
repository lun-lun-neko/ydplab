import { useQuery } from "@tanstack/react-query";
import { getClient } from "../api/client";
import { whenIdle } from "../utils/whenIdle";

// 설문을 푸는 동안 잠든 서버를 미리 깨워 제출 대기 시간을 줄인다
export const useWarmUpServer = () =>
  useQuery({
    queryKey: ["ping"],
    queryFn: async () => {
      await whenIdle();
      const client = await getClient();
      await client.get("/");
      return true;
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });
