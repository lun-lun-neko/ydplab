// 백엔드 응답의 오타 필드명과 문구를 화면에서 쓰기 좋게 정리한다.
// 백엔드가 고쳐지면 새 필드명을 그대로 쓰고, 이 어댑터는 지워도 된다.
const fixWording = (text) =>
  // "3위었습니다", "24.6%었습니다" → 모음으로 끝나므로 "였습니다"
  text.replace(/(\d위|\d%)었습니다/g, "$1였습니다");

const fixDeep = (value) => {
  if (typeof value === "string") return fixWording(value);
  if (Array.isArray(value)) return value.map(fixDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, fixDeep(v)])
    );
  }
  return value;
};

export const normalizeResult = (raw) => {
  const { typeDescriptoon, analSummary, culsterInfo, ...rest } = raw;
  return fixDeep({
    ...rest,
    typeDescription: rest.typeDescription ?? typeDescriptoon,
    analysisSummary: rest.analysisSummary ?? analSummary,
    clusterInfo: rest.clusterInfo ?? culsterInfo,
  });
};
