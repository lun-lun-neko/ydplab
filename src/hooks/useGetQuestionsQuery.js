import { useQuery } from "@tanstack/react-query";
import instance from "../api/instance";

const getQuestions = () => {
  return instance.get("questions");
};

export const useGetQuestionsQuery = () => {
  return useQuery({
    queryKey: ["getQuestions"],
    queryFn: getQuestions,
    select: (result) => result.data,
  });
};
