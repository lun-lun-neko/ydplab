import { expect, test } from "@playwright/test";
import { answerUntilLast, choose, mockApi } from "./helpers";

// PR 05: 서버가 거절(422)하거나 그대로 받아버리는 입력을 프론트에서 막는다
test("앞 문항을 건너뛰고 들어오면 첫 미완료 문항으로 보낸다", async ({
  page,
}) => {
  await mockApi(page);
  await page.goto("questions/5");
  await expect(page).toHaveURL(/questions\/1$/);
});

test("여가 시간은 0~24 정수, 비율은 합계 100이어야 넘어갈 수 있다", async ({
  page,
}) => {
  await mockApi(page);
  await page.goto("./");
  await page.getByRole("button", { name: "테스트 시작하기" }).click();
  for (let n = 1; n <= 3; n++) {
    await page.locator("fieldset label").nth(1).click();
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page.getByText(`질문 ${n + 1} / 10`)).toBeVisible();
  }

  const weekday = page.getByLabel("평일 하루 평균 여가 시간을 입력해주세요.");
  const weekend = page.getByLabel("주말 하루 평균 여가 시간을 입력해주세요");
  const next = page.getByRole("button", { name: "다음" });

  await weekday.fill("2.5");
  await weekend.fill("6");
  await expect(page.getByText("0~24 사이의 정수로")).toBeVisible();
  await expect(next).toBeDisabled();

  await weekday.fill("99");
  await expect(next).toBeDisabled();

  await weekday.fill("3");
  await expect(next).toBeEnabled();
  await next.click();

  await page.getByLabel("휴식·오락", { exact: true }).fill("150");
  await page.getByLabel("취미", { exact: true }).fill("-50");
  await page.getByLabel("본인계발", { exact: true }).fill("0");
  await page.getByLabel("대인관계·교제", { exact: true }).fill("0");
  await expect(page.getByText("0~100 사이의 정수로")).toBeVisible();
  await expect(next).toBeDisabled();
});

test("관심 활동 순위는 중복으로 고를 수 없고, '없음' 뒤에는 '없음'만 고를 수 있다", async ({
  page,
}) => {
  const calls = await mockApi(page);
  await answerUntilLast(page);
  // answerUntilLast가 1~4순위에 고른 활동은 5순위에서 비활성이어야 한다
  for (const label of [
    "미디어/콘텐츠",
    "스포츠/운동",
    "여행/야외활동",
    "문화/예술",
  ]) {
    await expect(
      page.getByRole("radio", { name: label, exact: true })
    ).toBeDisabled();
  }

  await page.getByRole("button", { name: "이전" }).click();
  await expect(page.getByText("질문 9 / 10")).toBeVisible();
  await choose(page, "없음");
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByText("질문 10 / 10")).toBeVisible();
  await expect(
    page.getByRole("radio", { name: "자기계발", exact: true })
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "제출" })).toBeDisabled();

  await choose(page, "없음");
  await page.getByRole("button", { name: "제출" }).click();
  await expect(page).toHaveURL(/result\//);

  const ranks = [1, 2, 3, 4, 5].map(
    (i) => calls.post[0][`leisureActivity${i}`]
  );
  const chosen = ranks.filter((v) => v !== 0);
  expect(new Set(chosen).size).toBe(chosen.length);
});
