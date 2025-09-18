import Container from "../../components/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import { useGetQuestionsQuery } from "../../hooks/useGetQuestionsQuery";
import Spinner from "../../components/Spinner";
import QuestionCard from "../../components/QuestionCard";
import { useRef } from "react";

const QuestionsPage = () => {
  const { data: questions, isLoading } = useGetQuestionsQuery();
  const swiperRef = useRef(null);

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext(); // 다음 슬라이드로 이동
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <Swiper
        pagination={true}
        modules={[Pagination]}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
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
