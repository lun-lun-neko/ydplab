import { useEffect, useState } from "react";

const SLOW_THRESHOLD_MS = 5000;

const AnalyzingOverlay = ({ isOpen }) => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setIsSlow(true), SLOW_THRESHOLD_MS);
    return () => {
      clearTimeout(timer);
      setIsSlow(false);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 text-center"
      >
        <span
          aria-hidden="true"
          className="w-10 h-10 border-4 border-blue-200 border-t-blue-400 rounded-full animate-spin"
        />
        <p className="font-bold">답변을 분석하는 중이에요…</p>
        {isSlow && (
          <p className="text-gray-500 text-sm">
            잠들어 있던 서버를 깨우는 중이에요. 최대 1분 정도 걸릴 수 있어요.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyzingOverlay;
