import { Navigate } from "react-router";
import NotFoundPage from "../NotFoundPage";
import { getLastAnimalId } from "../../utils/resultStorage";

// 이전 주소(/result)로 들어오면 이 세션의 마지막 결과로 보낸다
const LastResultRedirect = () => {
  const animalId = getLastAnimalId();

  if (animalId) return <Navigate to={`/result/${animalId}`} replace />;

  return (
    <NotFoundPage
      title="아직 결과가 없어요"
      description="테스트를 완료하면 나와 닮은 동물을 알려드릴게요!"
    />
  );
};

export default LastResultRedirect;
