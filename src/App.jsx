import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import QuestionPage from "./pages/QuestionPage";
import ResultPage from "./pages/ResultPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:id" element={<QuestionPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
