import { Routes, Route, useLocation } from "react-router";
import HomePage from "./pages/HomePage";
import QuestionPage from "./pages/QuestionPage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";
import LastResultRedirect from "./pages/ResultPage/LastResultRedirect";
import Layout from "./components/Layout";
import { useEffect } from "react";

function App() {
  const location = useLocation();
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
