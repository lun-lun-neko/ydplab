import Container from "../../components/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import { useGetQuestionsQuery } from "../../hooks/useGetQuestionsQuery";
import Spinner from "../../components/Spinner";
import QuestionCard from "../../components/QuestionCard";
import { useState } from "react";

const QuestionsPage = () => {
  const { data: questions, isLoading } = useGetQuestionsQuery();

  const [selected, setSelected] = useState({
    householdIncome: 0,
    leisurePurpose: 0,
    leisurePurpose2: 0,
    weekdayAvgLeisureTime: 0,
    weekendAvgLeisureTime: 0,
    restRecreationRate: 0,
    hobbyRate: 0,
    selfImprovementRate: 0,
    socialRelationshipRate: 0,
    leisureActivity1: 0,
    leisureActivity2: 0,
    leisureActivity3: 0,
    leisureActivity4: 0,
    leisureActivity5: 0,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <Swiper slidesPerView={1}>
        {questions.map((question) => (
          <SwiperSlide>
            <QuestionCard question={question} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default QuestionsPage;
