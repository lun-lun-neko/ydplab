import { useNavigate } from "react-router";
import Container from "../../components/Container";
import { useGetQuestionsQuery } from "../../hooks/useGetQuestionsQuery";
import Spinner from "../../components/Spinner";

const CAUTIONS = [
  "정확한 결과를 위해 솔직하게 답변해주세요",
  "약 3분 정도 소요됩니다",
];

const HomePage = () => {
  const { data: questions, isLoading } = useGetQuestionsQuery();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/questions");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container className={"flex flex-col items-center justify-center gap-4"}>
      <h1 className="font-bold text-[24px] text-blue-400">
        나의 동물 성격 찾기
      </h1>
      <h2>
        {questions.length} 개의 질문을 통해 당신과 닮은 동물을 찾아보세요!
      </h2>
      <ul>
        {CAUTIONS.map((caution) => (
          <li className="list-disc text-gray-400">{caution}</li>
        ))}
      </ul>
      <button
        className="cursor-pointer w-full p-4 bg-blue-300 text-white hover:bg-blue-400 transition"
        onClick={handleNavigate}
      >
        테스트 시작하기
      </button>
    </Container>
  );
};

export default HomePage;
