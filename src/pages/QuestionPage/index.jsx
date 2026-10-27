import { Navigate, useNavigate, useParams } from "react-router";
import Container from "../../components/Container";
import ResponsePercent from "../../components/ResponsePercent";
import mockData from "../../mock.json";
import QuestionList from "../../components/QuestionList";
import SubQuestionList from "../../components/SubQuestionList";
import { usePostDataStore } from "../../store/usePostDataStore";
import { useEffect, useRef } from "react";
import { usePostQuestionsQuery } from "../../hooks/usePostQuestionsQuery";
import NotFoundPage from "../NotFoundPage";
import AnalyzingOverlay from "../../components/AnalyzingOverlay";
import { findFirstIncompleteIndex } from "../../utils/validation";
import { pageTitle } from "../../constants/SITE";

const QuestionPage = () => {
  const { postData } = usePostDataStore();
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const { questions } = mockData;
  const total = questions.length;
  const currentQuestion = /^\d+$/.test(id) ? questions[id - 1] : undefined;
  const {
    mutate: postQuestions,
    isPending: isSubmitting,
    isError: isSubmitError,
  } = usePostQuestionsQuery();

  const handleNextPage = () => {
    const nextId = Number(id) + 1;
    navigate(`/questions/${nextId}`);
  };

  const handlePrevPage = () => {
    const prevId = Number(id) - 1;
    navigate(`/questions/${prevId}`);
  };

  // 더블클릭은 리렌더 전에 두 번 호출되므로 isPending만으로는 막을 수 없다
  const submitLockRef = useRef(false);
  const handleSubmit = () => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    postQuestions(postData, {
      onSettled: () => {
        submitLockRef.current = false;
      },
    });
  };

  useEffect(() => {
    console.log(postData);
  }, [postData]);

  if (!currentQuestion) {
    return (
      <NotFoundPage
        title="없는 질문이에요"
        description={`질문은 1번부터 ${total}번까지 있어요.`}
      />
    );
  }

  // 앞 문항을 건너뛰고 들어오면 아직 답하지 않은 첫 문항으로 보낸다
  const firstIncompleteIndex = findFirstIncompleteIndex(postData, id - 1);
  if (firstIncompleteIndex !== -1) {
    return <Navigate to={`/questions/${firstIncompleteIndex + 1}`} replace />;
  }

  return (
    <Container className="flex flex-col ">
      <title>{pageTitle(`질문 ${id} / ${total}`)}</title>
      <AnalyzingOverlay isOpen={isSubmitting} />
      <ResponsePercent currentQuestionIndex={id} total={total} />

      {currentQuestion.subQuestions ? (
        <SubQuestionList
          currentQuestion={currentQuestion}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      ) : (
        <QuestionList
          currentQuestion={currentQuestion}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSubmitError={isSubmitError}
          currentId={id}
        />
      )}
    </Container>
  );
};

export default QuestionPage;
