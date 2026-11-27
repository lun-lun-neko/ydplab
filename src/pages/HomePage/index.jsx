import { useNavigate } from "react-router";
import Container from "../../components/Container";
import mockData from "../../mock.json";
import AnimalImage from "../../components/AnimalImage";
import { pageTitle } from "../../constants/SITE";

const HomePage = () => {
  const { questions } = mockData;
  const navigate = useNavigate();

  return (
    <Container className="flex flex-col items-center gap-4 p-4">
      <title>{pageTitle()}</title>
      <AnimalImage
        animalId="greyheron"
        sizes="160px"
        className="rounded-full w-40 h-40"
        alt="배낭을 멘 왜가리 캐릭터"
        priority
      />
      <h1 className="text-blue-600 font-bold text-[22px]">
        나의 동물 성격 찾기
      </h1>
      <p>{questions.length}개의 질문을 통해 당신과 닮은 동물을 찾아보세요!</p>
      <ul className="list-disc text-gray-500">
        <li>정확한 결과를 위해 솔직하게 답변해주세요</li>
        <li>약 2분 정도 소요됩니다</li>
      </ul>
      <button
        onClick={() => navigate("questions/1")}
        className="bg-blue-600 py-2 px-4 w-full text-white cursor-pointer rounded-md"
      >
        테스트 시작하기
      </button>
    </Container>
  );
};

export default HomePage;
