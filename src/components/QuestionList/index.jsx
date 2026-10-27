import { useState } from "react";
import { usePostDataStore } from "../../store/usePostDataStore";
import Modal from "../Modal";
import { MAPPING } from "../../constants/MAPPING";
import {
  findFirstIncompleteIndex,
  getDisabledValues,
  validateQuestion,
} from "../../utils/validation";

const QuestionList = ({
  currentQuestion,
  handleNextPage,
  handlePrevPage,
  currentId,
  handleSubmit,
  isSubmitting,
  isSubmitError,
}) => {
  const { postData, setPostData } = usePostDataStore();
  const { questions } = currentQuestion;
  const keyOfQuestions = Object.keys(questions);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { canProceed, error } = validateQuestion(currentQuestion, postData);
  const disabledValues = getDisabledValues(currentQuestion, postData);
  const canSubmit = findFirstIncompleteIndex(postData) === -1;

  return (
    <>
      <div>
        <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
          {MAPPING}
        </Modal>
        <div>
          <h2 className="text-[18px] py-3 font-bold">
            {currentQuestion.title}
          </h2>
        </div>
        <ul className="flex flex-col gap-3">
          {keyOfQuestions.map((key) => (
            <li key={questions[key]}>
              <button
                onClick={() =>
                  setPostData(currentQuestion.category, questions[key])
                }
                disabled={disabledValues.has(questions[key])}
                className={`w-full text-left border border-gray-200 py-1 px-2 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 ${
                  postData[currentQuestion.category] === questions[key]
                    ? "bg-blue-400 text-white transition"
                    : ""
                }`}
              >
                {key}
              </button>
            </li>
          ))}
        </ul>
        <p aria-live="polite" className="min-h-5 mt-3 text-red-500 text-sm">
          {error}
        </p>
      </div>
      {isSubmitError && (
        <p role="alert" className="mt-4 text-red-500 text-sm">
          결과를 불러오지 못했어요. 잠시 후 다시 제출해주세요.
        </p>
      )}
      <div className="flex justify-between mt-auto pt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentId === "1"}
          className="px-4 py-2 cursor-pointer border border-gray-200 disabled:bg-gray-200"
        >
          이전
        </button>
        {currentId == 10 ? (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            aria-busy={isSubmitting}
            className="px-4 py-2 cursor-pointer border border-gray-200 disabled:bg-gray-200"
          >
            {isSubmitting ? "분석 중…" : "제출"}
          </button>
        ) : (
          <button
            onClick={handleNextPage}
            disabled={!canProceed}
            className="px-4 py-2 cursor-pointer border border-gray-200 disabled:bg-gray-200"
          >
            다음
          </button>
        )}
      </div>
    </>
  );
};

export default QuestionList;
