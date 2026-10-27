import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "../api/client";
import { useNavigate } from "react-router";
import { saveResult } from "../utils/resultStorage";

const postQuestions = async (data) => {
  const client = await getClient();
  return client.post("/questions", data);
};

// 응답이 없거나(타임아웃·네트워크) 5xx일 때만 재시도한다. 4xx는 입력 문제라 재시도하지 않는다
const isRetryable = (error) =>
  !error.response || error.response.status >= 500;

export const usePostQuestionsQuery = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postQuestions,
    retry: (failureCount, error) => failureCount < 1 && isRetryable(error),
    retryDelay: 2000,
    onSuccess: (res) => {
      const animalId = saveResult(res.data);
      queryClient.setQueryData(["result", animalId], res.data);
      navigate(`/result/${animalId}`);
    },
  });
};
