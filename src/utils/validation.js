import mockData from "../mock.json";

const { questions } = mockData;

const RANGE_RULES = {
  avgLeisureTime: { min: 0, max: 24, label: "여가 시간" },
  leisureRate: { min: 0, max: 100, label: "비율" },
};
const RANK_PATTERN = /^leisureActivity(\d)$/;
const NONE = 0;

const isEmpty = (value) => value === null || value === undefined || value === "";

const getRank = (category) => Number(category.match(RANK_PATTERN)?.[1] ?? 0);

const getEarlierRankValues = (category, postData) =>
  Array.from(
    { length: getRank(category) - 1 },
    (_, i) => postData[`leisureActivity${i + 1}`]
  );

const validateNumberInputs = (question, postData) => {
  const { min, max, label } = RANGE_RULES[question.category];
  const values = question.subQuestions.map((q) => postData[q.category]);

  const invalid = values.find(
    (v) => !isEmpty(v) && (!Number.isInteger(v) || v < min || v > max)
  );
  if (invalid !== undefined) {
    return {
      canProceed: false,
      error: `${label}은 ${min}~${max} 사이의 정수로 입력해주세요.`,
    };
  }
  if (values.some(isEmpty)) return { canProceed: false, error: null };

  if (question.category === "leisureRate") {
    const sum = values.reduce((acc, v) => acc + v, 0);
    if (sum !== 100) {
      return {
        canProceed: false,
        error: `합계가 100이 되어야 해요. (현재 ${sum})`,
      };
    }
  }
  return { canProceed: true, error: null };
};

const validateChoice = (question, postData) => {
  const value = postData[question.category];
  if (isEmpty(value)) return { canProceed: false, error: null };

  if (getRank(question.category) > 1 && value !== NONE) {
    const earlier = getEarlierRankValues(question.category, postData);
    if (earlier.includes(NONE)) {
      return {
        canProceed: false,
        error: "앞 순위에서 '없음'을 골랐다면 이후 순위도 '없음'만 고를 수 있어요.",
      };
    }
    if (earlier.includes(value)) {
      return { canProceed: false, error: "이미 앞 순위에서 고른 활동이에요." };
    }
  }
  return { canProceed: true, error: null };
};

export const validateQuestion = (question, postData) =>
  question.subQuestions
    ? validateNumberInputs(question, postData)
    : validateChoice(question, postData);

// 순위 문항에서 고를 수 없는 선택지 값 (앞 순위에서 고른 활동, 또는 앞 순위가 '없음'이면 전부)
export const getDisabledValues = (question, postData) => {
  if (getRank(question.category) <= 1) return new Set();
  const earlier = getEarlierRankValues(question.category, postData);
  if (earlier.includes(NONE)) {
    return new Set(Object.values(question.questions).filter((v) => v !== NONE));
  }
  return new Set(earlier.filter((v) => v !== NONE));
};

// endIndex 이전에서 아직 완료되지 않은 첫 문항의 인덱스, 모두 완료면 -1
export const findFirstIncompleteIndex = (
  postData,
  endIndex = questions.length
) =>
  questions
    .slice(0, endIndex)
    .findIndex((q) => !validateQuestion(q, postData).canProceed);
