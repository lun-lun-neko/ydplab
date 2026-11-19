import axios from "axios";

const instance = axios.create({
  baseURL: "https://lunlunneko-ydplab.hf.space/",
  // 무료 HF Space는 잠들어 있으면 깨어나는 데 수십 초가 걸린다
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
