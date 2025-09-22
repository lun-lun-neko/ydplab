import { useState } from "react";

const QuestionCard = ({ question }) => {
  const [selected, setSelected] = useState(null);
  console.log(question);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-bold text-[24px]">{question.title}</h2>
      <ul className="flex flex-col gap-4">
        {question.isSubjective
          ? question.choices.map((choice, index) => (
              <div>
                <h3 className="text-[18px]">{choice}</h3>
                <input
                  type="number"
                  className="border-1 p-2 w-full [appearance:textfield] 
    [&::-webkit-outer-spin-button]:appearance-none 
    [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder={question.placeholder}
                />
              </div>
            ))
          : question.choices.map((choice, index) => (
              <li
                onClick={() => setSelected(index)}
                className={` cursor-pointer p-3 border-1 border-gray-200 rounded-md ${
                  selected === index ? "bg-blue-400 text-white transition" : ""
                }`}
              >
                {choice}
              </li>
            ))}
      </ul>
    </section>
  );
};

export default QuestionCard;
