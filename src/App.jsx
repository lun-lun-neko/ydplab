import { Route, Routes } from "react-router";
import "./index.css";
import HomePage from "./pages/HomePage";
import QuestionsPage from "./pages/QuestionsPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;
