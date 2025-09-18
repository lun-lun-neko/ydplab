const QuestionCard = ({ question }) => {
  console.log(question);
  return (
    <section>
      <h2>{question.title}</h2>
    </section>
  );
};

export default QuestionCard;
