import { useNavigate, useParams } from "react-router";
import Container from "../../components/Container";
import { usePostDataStore } from "../../store/usePostDataStore";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { loadKakaoSdk, shareByKakaoTalk } from "../../kakao";
import { useResultQuery } from "../../hooks/useResultQuery";
import NotFoundPage from "../NotFoundPage";
import AnimalImage from "../../components/AnimalImage";
import { pageTitle } from "../../constants/SITE";
import { whenIdle } from "../../utils/whenIdle";
import { RESULT_IMAGE_SIZES } from "../../constants/IMAGE";
import { withTopic } from "../../utils/josa";

const ResultPage = () => {
  const { animalId } = useParams();
  const { data: result, isPending, isError } = useResultQuery(animalId);
  const { resetPostData } = usePostDataStore();
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [shareError, setShareError] = useState(null);

  const handleReset = () => {
    resetPostData();
    navigate("/");
  };

  const onClickDetail = (data) => {
    setModalContent(data);
    setIsOpenModal(true);
  };

  useEffect(() => {
    whenIdle()
      .then(loadKakaoSdk)
      .catch(() => {});
  }, []);

  const handleClickShare = async () => {
    setShareError(null);
    try {
      await shareByKakaoTalk({
        name: result.animalName,
        animalType: result.animalType,
        description: result.description,
        imageURL: result.animalImageUrl,
        animalId,
      });
    } catch {
      setShareError("카카오톡 공유를 열지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  if (isPending) {
    return (
      <Container className="flex flex-col items-center gap-4 p-4">
        <p className="text-gray-500">결과를 불러오는 중이에요…</p>
      </Container>
    );
  }

  if (isError) {
    return (
      <NotFoundPage
        title="결과를 찾을 수 없어요"
        description="링크가 잘못되었을 수 있어요. 테스트를 다시 해볼까요?"
      />
    );
  }

  return (
    <Container className="flex flex-col items-center gap-4">
      <title>{pageTitle(`${result.animalType} 결과`)}</title>
      <Modal onClose={() => setIsOpenModal(false)} isOpen={isOpenModal}>
        {typeof modalContent === "string" && <p>{modalContent}</p>}
        {typeof modalContent === "object" &&
          !Array.isArray(modalContent) &&
          modalContent !== null && (
            <div>
              <h2 className="font-bold">{modalContent.subtitle}</h2>
              <p>{modalContent.content}</p>
              <h3 className="text-center text-[24px] p-4 font-bold">
                {"< 주요 지표 >"}
              </h3>
              {modalContent.metrics?.map((obj) => (
                <div key={obj.subtitle}>
                  <h4 className="font-bold py-2 text-[20px] text-blue-600">
                    {obj.subtitle}
                  </h4>
                  <p>{obj.content}</p>
                </div>
              ))}
            </div>
          )}
      </Modal>
      <div className="w-full">
        <AnimalImage
          animalId={animalId}
          fallbackSrc={result.animalImageUrl}
          sizes={RESULT_IMAGE_SIZES}
          className="w-full h-auto"
          alt={`${result.animal} 캐릭터 이미지`}
          priority
        />
      </div>
      <h1 className="font-bold text-blue-600">{result.animalName}</h1>
      <h2 className="text-gray-500">{result.animalType}</h2>
      <p>{result.description}</p>
      <button
        onClick={() => onClickDetail(result.animalDescription)}
        className="w-full bg-yellow-200 p-2 border-1 cursor-pointer font-bold rounded-md"
      >
        {withTopic(result.animal)} 어떤 동물일까요?
      </button>
      <button
        onClick={() => onClickDetail(result.typeDescription)}
        className="w-full bg-yellow-200 p-2 border-1 cursor-pointer font-bold rounded-md"
      >
        나는 어떤 유형일까요?
      </button>
      <h3 className="font-bold">{"< 분석 리포트 >"}</h3>
      {result.analysisSummary.map((summary) => (
        <button
          key={summary.subtitle}
          onClick={() => onClickDetail(summary)}
          className="w-full bg-yellow-200 p-2 border-1 cursor-pointer font-bold rounded-md"
        >
          {summary.subtitle}
        </button>
      ))}
      <h3 className="font-bold">나만의 특성</h3>
      <div className="flex gap-4 flex-wrap">
        {result.interesting.map((tag) => (
          <span
            key={tag}
            className="font-bold bg-green-200 px-2 py-1 rounded-md border-1">
            {tag}
          </span>
        ))}
      </div>

      <div className="w-full flex gap-4">
        <button
          onClick={handleReset}
          className="flex-1 cursor-pointer mt-2 bg-blue-200 p-2"
        >
          다시 테스트하기
        </button>
        <button
          onClick={handleClickShare}
          className="flex-1 cursor-pointer mt-2 bg-blue-200 p-2"
        >
          공유하기
        </button>
      </div>
      {shareError && (
        <p role="alert" className="text-red-500 text-sm">
          {shareError}
        </p>
      )}
    </Container>
  );
};

export default ResultPage;
