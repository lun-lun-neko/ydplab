import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../api/instance";
import { useNavigate } from "react-router";
import { saveResult } from "../utils/resultStorage";

const postQuestions = (data) => {
  return instance.post("/questions", data);
};

export const usePostQuestionsQuery = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postQuestions,
    onSuccess: (res) => {
      const animalId = saveResult(res.data);
      queryClient.setQueryData(["result", animalId], res.data);
      navigate(`/result/${animalId}`);
    },
  });
};
