import { useNavigate, useParams } from "react-router";
import Container from "../../components/Container";
import ResponsePercent from "../../components/ResponsePercent";
import mockData from "../../mock.json";
import QuestionList from "../../components/QuestionList";
import SubQuestionList from "../../components/SubQuestionList";
import { usePostDataStore } from "../../store/usePostDataStore";

const QuestionPage = () => {
  const { postData } = usePostDataStore();
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const { questions } = mockData;
  const total = questions.length;
  const currentQuestion = questions[id - 1];
  const handleNextPage = () => {
    const nextId = Number(id) + 1;
    navigate(`/questions/${nextId}`);
  };

  const handlePrevPage = () => {
    const prevId = Number(id) - 1;
    navigate(`/questions/${prevId}`);
  };

  const handleSubmit = () => {
    navigate("/result");
  };

  const isDisabledNextBtn = () => {
    // 해당 카테고리의 값이 없거나
    // 주관식일 때 조건에 안맞거나 조건1) 0~24
    console.log("zzz");
  };

  //

  return (
    <Container className="flex flex-col min-h-[625px]">
      <ResponsePercent currentQuestionIndex={id} total={total} />

      {currentQuestion.subQuestions ? (
        <SubQuestionList currentQuestion={currentQuestion} />
      ) : (
        <QuestionList currentQuestion={currentQuestion} />
      )}
      <div className="flex justify-between mt-auto pt-4">
        <button
          onClick={handlePrevPage}
          disabled={id === "1"}
          className="px-4 py-2 cursor-pointer border border-gray-200 disabled:bg-gray-200"
        >
          이전
        </button>
        <button
          onClick={handleNextPage}
          // disabled={isDisabledNextBtn}
          className="px-4 py-2 cursor-pointer border border-gray-200 disabled:bg-blue-200"
        >
          다음
        </button>
      </div>
    </Container>
  );
};

export default QuestionPage;
