import { expect, test } from "@playwright/test";
import { answerUntilLast, mockApi, results } from "./helpers";

const fulfillAfter = (ms) => async (route) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await route.fulfill({ json: results.dolphin }).catch(() => {});
};

// PR 04: 제출 중 피드백, 중복 제출 차단, 실패 안내, 재시도
test("더블클릭해도 POST는 한 번이고, 분석 중 상태가 보인다", async ({
  page,
}) => {
  const calls = await mockApi(page, { onPost: fulfillAfter(1500) });
  await answerUntilLast(page);
  await page.getByRole("button", { name: "제출" }).dblclick();

  await expect(page.getByRole("status")).toContainText("분석하는 중");
  await expect(page.getByRole("button", { name: "분석 중…" })).toBeDisabled();
  await expect(page).toHaveURL(/result\/dolphin$/);
  expect(calls.post).toHaveLength(1);
});

test("서버 오류가 계속되면 안내하고 다시 제출할 수 있다", async ({ page }) => {
  await mockApi(page, {
    onPost: (route) => route.fulfill({ status: 500, body: "error" }),
  });
  await answerUntilLast(page);
  await page.getByRole("button", { name: "제출" }).click();

  await expect(page.getByRole("alert")).toContainText(
    "결과를 불러오지 못했어요"
  );
  await expect(page.getByRole("button", { name: "제출" })).toBeEnabled();
});

test("첫 요청이 503이면 자동으로 재시도해 결과에 도달한다", async ({
  page,
}) => {
  const calls = await mockApi(page, {
    onPost: (route, n) =>
      n === 1
        ? route.fulfill({ status: 503, body: "waking up" })
        : route.fulfill({ json: results.dolphin }),
  });
  await answerUntilLast(page);
  await page.getByRole("button", { name: "제출" }).click();

  await expect(page).toHaveURL(/result\/dolphin$/);
  expect(calls.post).toHaveLength(2);
});

test("앱에 들어오면 잠든 서버를 깨우는 핑을 보낸다", async ({ page }) => {
  const calls = await mockApi(page);
  await page.goto("./");
  await expect.poll(() => calls.ping).toBe(1);
});
