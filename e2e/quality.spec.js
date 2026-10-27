import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mockApi } from "./helpers";

const axe = (page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();

// PR 06: 접근성 회귀 방지
for (const path of ["./", "questions/1", "result/greyheron"]) {
  test(`axe 위반 0건: ${path}`, async ({ page }) => {
    await mockApi(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect((await axe(page)).violations).toEqual([]);
  });
}

// 사파리는 마우스 클릭으로 버튼에 포커스를 주지 않으므로, 포커스 복귀가 의미 있는 키보드 경로로 확인한다
test("결과 모달은 dialog로 열리고 ESC로 닫히며 포커스가 돌아온다", async ({
  page,
}) => {
  await mockApi(page);
  await page.goto("result/greyheron");
  const opener = page.getByRole("button", { name: "나는 어떤 유형일까요?" });
  await opener.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect((await axe(page)).violations).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

// PR 02: OS와 무관하게 한글이 Pretendard로 그려진다
test("한글 웹폰트(Pretendard)가 로드되어 적용된다", async ({ page }) => {
  await mockApi(page);
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.fonts].some(
          (f) => f.family.includes("Pretendard") && f.status === "loaded"
        )
      )
    )
    .toBe(true);
  const family = await page
    .getByRole("heading", { level: 1 })
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toMatch(/^"?Pretendard Variable/);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("ko");
});

// PR 03: 최적화 이미지가 실제로 로드된다 (경로가 깨져도 SPA 폴백이 200을 주므로 응답 코드로는 못 잡는다)
for (const path of ["./", "result/orca"]) {
  test(`이미지가 깨지지 않고 최적화 파일로 로드된다: ${path}`, async ({
    page,
  }) => {
    await mockApi(page);
    await page.goto(path);
    const img = page.getByRole("img").first();
    await expect(img).toBeVisible();
    await expect
      .poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);
    expect(await img.evaluate((el) => el.currentSrc)).toMatch(
      /\/ydplab\/animals\/\w+-(320|640)\.(avif|webp)$/
    );
  });
}

// PR 07: 결과 링크는 결과별 OG 메타를 담은 HTML로 응답한다
test("결과 정적 페이지는 결과별 OG 메타를 담고 있다", async ({ request }) => {
  const res = await request.get("result/orca/");
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toContain("위풍당당 범고래");
  expect(html).toContain("/ydplab/og/orca.jpg");
});
