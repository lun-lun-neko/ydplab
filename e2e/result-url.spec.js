import { expect, test } from "@playwright/test";
import { answerUntilLast, mockApi } from "./helpers";

// PR 01: 결과는 URL만으로 다시 열 수 있어야 한다 (공유 링크·새 탭)
test("제출하면 /result/:animalId로 이동하고, 같은 링크를 새 탭에서 열어도 결과가 보인다", async ({
  page,
  context,
}) => {
  await mockApi(page);
  await answerUntilLast(page);
  await page.getByRole("button", { name: "제출" }).click();

  await expect(page).toHaveURL(/\/ydplab\/result\/dolphin$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("돌고래");

  const shared = await context.newPage();
  await shared.goto(page.url());
  await expect(shared.getByRole("heading", { level: 1 })).toContainText(
    "돌고래"
  );
});

for (const [path, text] of [
  ["result/greyheron", "왜가리"],
  ["result/unknown", "결과를 찾을 수 없어요"],
  ["result", "아직 결과가 없어요"],
  ["questions/99", "없는 질문이에요"],
  ["questions/abc", "없는 질문이에요"],
  ["nope", "페이지를 찾을 수 없어요"],
]) {
  test(`/${path} 직접 접근 시 흰 화면이 아니다`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await mockApi(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(text);
    expect(errors).toEqual([]);
  });
}
