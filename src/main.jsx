import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 웹폰트 CSS는 첫 렌더를 막지 않도록 따로 받는다 (font-display: swap)
import("pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css");

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={client}>
    <BrowserRouter basename="/ydplab">
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
