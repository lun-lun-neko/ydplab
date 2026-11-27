import fs from "node:fs";
import { expect } from "@playwright/test";

const API = "https://lunlunneko-ydplab.hf.space";

export const results = JSON.parse(
  fs.readFileSync(new URL("../src/data/results.json", import.meta.url), "utf8")
);

// 테스트가 HF Space 상태에 좌우되지 않도록 API를 가로챈다
export const mockApi = async (page, { onPost } = {}) => {
  const calls = { ping: 0, post: [] };
  await page.route(`${API}/**`, async (route) => {
    const request = route.request();
    if (request.method() !== "POST") {
      calls.ping += 1;
      return route.fulfill({ json: { ok: true } });
    }
    calls.post.push(request.postDataJSON());
    if (onPost) return onPost(route, calls.post.length);
    return route.fulfill({ json: results.dolphin });
  });
  return calls;
};

const goNext = async (page, current) => {
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByText(`질문 ${current + 1} / 10`)).toBeVisible();
};

// 사용자처럼 보이는 라벨을 누른다 (sr-only input을 강제로 누르면 모바일에서 스크롤 중 빗나간다)
export const choose = async (page, label) => {
  await page
    .locator("fieldset label", { hasText: label })
    .filter({ hasText: new RegExp(`^${label}$`) })
    .click();
  await expect(
    page.getByRole("radio", { name: label, exact: true })
  ).toBeChecked();
};

// 메인에서 시작해 10번 문항까지 유효한 답을 채운다 (제출은 하지 않음)
export const answerUntilLast = async (page) => {
  await page.goto("./");
  await page.getByRole("button", { name: "테스트 시작하기" }).click();
  await expect(page.getByText("질문 1 / 10")).toBeVisible();

  await choose(page, "300 이상 500만원 미만");
  await goNext(page, 1);
  await choose(page, "남는 시간을 보내기 위해");
  await goNext(page, 2);
  await choose(page, "자기 계발을 위해");
  await goNext(page, 3);

  await page.getByLabel("평일 하루 평균 여가 시간을 입력해주세요.").fill("3");
  await page.getByLabel("주말 하루 평균 여가 시간을 입력해주세요").fill("6");
  await goNext(page, 4);

  for (const [label, value] of [
    ["휴식·오락", "40"],
    ["취미", "30"],
    ["본인계발", "20"],
    ["대인관계·교제", "10"],
  ]) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await goNext(page, 5);

  const ranks = ["미디어/콘텐츠", "스포츠/운동", "여행/야외활동", "문화/예술"];
  for (const [i, label] of ranks.entries()) {
    await choose(page, label);
    await goNext(page, 6 + i);
  }
  await choose(page, "자기계발");
};
