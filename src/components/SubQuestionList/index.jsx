import { usePostDataStore } from "../../store/usePostDataStore";
import { useEffect } from "react";

const SubQuestionList = ({ currentQuestion }) => {
  const { postData, setPostData } = usePostDataStore();
  const { subQuestions } = currentQuestion;
  console.log("ccc", currentQuestion);

  useEffect(() => {
    console.log(postData);
  }, [postData]);
  return (
    <div>
      <h2 className="text-[18px] py-3 font-bold">{currentQuestion.title}</h2>
      <ul className="flex flex-col gap-3">
        {subQuestions.map((question) => (
          <li key={question.category} className="flex flex-col gap-3">
            <label className="font-bold text-[16px]">{question.title}</label>
            <input
              type="text"
              value={postData[question.category] || ""}
              onChange={(e) => setPostData(question.category, e.target.value)}
              placeholder={question.placeholder}
              className="focus:outline-blue-400 bg-gray-200 w-full py-2 px-4"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubQuestionList;
