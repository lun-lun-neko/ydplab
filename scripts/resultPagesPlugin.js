import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://lun-lun-neko.github.io/ydplab";

const escapeAttr = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const setMeta = (html, key, value) =>
  html.replace(
    new RegExp(`(<meta\\s+(?:property|name)="${key}"\\s+content=")[^"]*(")`),
    `$1${escapeAttr(value)}$2`
  );

// 크롤러(카카오·SNS 미리보기)는 JS를 실행하지 않으므로, 결과별 OG 메타를 담은
// dist/result/{animalId}/index.html을 빌드 시점에 만든다.
// GitHub Pages에서 404.html 폴백 대신 200으로 응답하는 효과도 있다.
export const resultPagesPlugin = (resultsPath) => ({
  name: "result-pages",
  apply: "build",
  writeBundle({ dir }) {
    const template = fs.readFileSync(path.join(dir, "index.html"), "utf8");
    const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));

    for (const [animalId, result] of Object.entries(results)) {
      const url = `${SITE_URL}/result/${animalId}/`;
      const title = `${result.animalType} | 나와 닮은 동물 찾기`;
      const image = `${SITE_URL}/og/${animalId}.jpg`;

      let html = template.replace(
        /<title>[^<]*<\/title>/,
        `<title>${escapeAttr(title)}</title>`
      );
      html = html.replace(
        /(<link rel="canonical" href=")[^"]*(")/,
        `$1${url}$2`
      );
      for (const [key, value] of [
        ["description", result.description],
        ["og:url", url],
        ["og:title", title],
        ["og:description", result.description],
        ["og:image", image],
        ["og:image:alt", `${result.animalType} 캐릭터`],
        ["twitter:title", title],
        ["twitter:description", result.description],
        ["twitter:image", image],
      ]) {
        html = setMeta(html, key, value);
      }

      const outDir = path.join(dir, "result", animalId);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
    }
  },
});
