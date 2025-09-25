import { useEffect } from "react";
import { usePostDataStore } from "../../store/usePostDataStore";

const QuestionList = ({ currentQuestion }) => {
  const { questions } = currentQuestion;
  const keyOfQuestions = Object.keys(questions);
  const { postData, setPostData } = usePostDataStore();

  const isCategoryLesuire = () => {
    if (currentQuestion.category.includes("leisureActivity")) {
      console.log("dd");
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log(postData);
  }, [postData]);
  return (
    <div>
      <div>
        <h2 className="text-[18px] py-3 font-bold">{currentQuestion.title}</h2>
        {isCategoryLesuire() && (
          <button className="p-2 text-gray-400 cursor-pointer">
            보기 예시
          </button>
        )}
      </div>
      <ul className="flex flex-col gap-3">
        {keyOfQuestions.map((key) => (
          <li key={questions[key]}>
            <button
              onClick={() =>
                setPostData(currentQuestion.category, questions[key])
              }
              className={`w-full text-left border border-gray-200 py-1 px-2 cursor-pointer ${
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
    </div>
  );
};

export default QuestionList;
