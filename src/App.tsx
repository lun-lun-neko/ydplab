import { Route, Routes } from "react-router";
import "./index.css";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import Layout from "./layout";
import QuestionsPage from "./pages/QuestionsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/ydplab" element={<HomePage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
