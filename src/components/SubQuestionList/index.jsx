import { useId } from "react";
import { usePostDataStore } from "../../store/usePostDataStore";
import Total from "../Total";
import { validateQuestion } from "../../utils/validation";

const SubQuestionList = ({
  currentQuestion,
  handleNextPage,
  handlePrevPage,
}) => {
  const { postData, setPostData } = usePostDataStore();
  const { subQuestions } = currentQuestion;
  const idPrefix = useId();
  const errorId = `${idPrefix}-error`;

  const isRequireTotal = () => {
    return currentQuestion.category === "leisureRate" ? true : false;
  };

  const { canProceed, error } = validateQuestion(currentQuestion, postData);
  const { min, max } =
    currentQuestion.category === "avgLeisureTime"
      ? { min: 0, max: 24 }
      : { min: 0, max: 100 };

  return (
    <>
      <div>
        <h2 className="text-[18px] pt-3 font-bold">{currentQuestion.title}</h2>
        {isRequireTotal() && <Total />}
        <ul className="flex flex-col gap-3 pt-3">
          {subQuestions.map((question) => (
            <li key={question.category} className="flex flex-col gap-3">
              <label
                htmlFor={`${idPrefix}-${question.category}`}
                className="font-bold text-[16px]"
              >
                {question.title}
              </label>
              <input
                id={`${idPrefix}-${question.category}`}
                aria-describedby={errorId}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                step={1}
                aria-invalid={Boolean(error)}
                value={postData[question.category] ?? ""}
                onChange={(e) => setPostData(question.category, e.target.value)}
                placeholder={question.placeholder}
                className="focus:outline-blue-600 bg-gray-200 w-full py-2 px-4"
              />
            </li>
          ))}
        </ul>
        <p
          id={errorId}
          aria-live="polite"
          className="min-h-5 mt-3 text-red-500 text-sm"
        >
          {error}
        </p>
      </div>
      <div className="flex justify-between mt-auto pt-4">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 cursor-pointer border border-gray-200 disabled:bg-gray-200"
        >
          이전
        </button>
        <button
          onClick={handleNextPage}
          disabled={!canProceed}
          className="px-4 py-2 cursor-pointer border border-gray-200 disabled:bg-gray-200"
        >
          다음
        </button>
      </div>
    </>
  );
};

export default SubQuestionList;
