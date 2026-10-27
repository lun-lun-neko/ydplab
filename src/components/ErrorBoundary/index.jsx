import { Component } from "react";
import Container from "../Container";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    // 다른 경로로 이동하면 에러 상태를 초기화한다
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Container className="flex flex-col items-center gap-4 p-4">
        <h1 className="text-blue-400 font-bold text-[22px]">
          문제가 발생했어요
        </h1>
        <p className="text-gray-500">잠시 후 다시 시도해주세요.</p>
        <a
          href={import.meta.env.BASE_URL}
          className="bg-blue-400 py-2 px-4 w-full text-white text-center rounded-md"
        >
          처음으로 돌아가기
        </a>
      </Container>
    );
  }
}

export default ErrorBoundary;
