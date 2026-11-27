import { Routes, Route, useLocation } from "react-router";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LastResultRedirect from "./pages/ResultPage/LastResultRedirect";
import Layout from "./components/Layout";
import { lazy, useEffect } from "react";
import { whenIdle } from "./utils/whenIdle";

const loadQuestionPage = () => import("./pages/QuestionPage");
const loadResultPage = () => import("./pages/ResultPage");
const QuestionPage = lazy(loadQuestionPage);
const ResultPage = lazy(loadResultPage);

// 첫 화면을 그린 뒤 유휴 시간에 다음 페이지 코드를 미리 받아 둔다
const prefetchPages = () => {
  loadQuestionPage();
  loadResultPage();
};

function App() {
  const location = useLocation();
  useEffect(() => {
    whenIdle().then(prefetchPages);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:id" element={<QuestionPage />} />
        <Route path="/result" element={<LastResultRedirect />} />
        <Route path="/result/:animalId" element={<ResultPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
