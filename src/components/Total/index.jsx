import { usePostDataStore } from "../../store/usePostDataStore";

const Total = () => {
  const { postData } = usePostDataStore();

  const total =
    Number(postData.restRecreationRate ?? 0) +
    Number(postData.hobbyRate ?? 0) +
    Number(postData.selfImprovementRate ?? 0) +
    Number(postData.socialRelationshipRate ?? 0);

  return (
    <p className="text-gray-500 font-bold" aria-live="polite">
      합계 {total} / 100
    </p>
  );
};

export default Total;
