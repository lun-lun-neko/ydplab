import { useNavigate } from "react-router";
import Container from "../../components/Container";
import { pageTitle } from "../../constants/SITE";

const NotFoundPage = ({
  title = "페이지를 찾을 수 없어요",
  description = "주소가 잘못되었거나 더 이상 없는 페이지예요.",
}) => {
  const navigate = useNavigate();

  return (
    <Container className="flex flex-col items-center gap-4 p-4">
      <title>{pageTitle(title)}</title>
      <h1 className="text-blue-600 font-bold text-[22px]">{title}</h1>
      <p className="text-gray-500 text-center">{description}</p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 py-2 px-4 w-full text-white cursor-pointer rounded-md"
      >
        테스트 하러 가기
      </button>
    </Container>
  );
};

export default NotFoundPage;
