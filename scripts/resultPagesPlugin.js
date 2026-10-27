import fs from "node:fs";
import path from "node:path";
import { RESULT_IMAGE_SIZES } from "../src/constants/IMAGE.js";

const SITE_URL = "https://lun-lun-neko.github.io/ydplab";

const escapeAttr = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const setMeta = (html, key, value) =>
  html.replace(
    new RegExp(`(<meta\\s+(?:property|name)="${key}"\\s+content=")[^"]*(")`),
    `$1${escapeAttr(value)}$2`
  );

// 결과 페이지 청크와 그 정적 의존 청크, 결과 데이터 청크 (메인 엔트리는 제외)
const findResultChunks = (bundle) => {
  const chunks = Object.values(bundle).filter((c) => c.type === "chunk");
  const byModule = (suffix) =>
    chunks.find((c) => c.facadeModuleId?.endsWith(suffix));
  const page = byModule("src/pages/ResultPage/index.jsx");
  const data = byModule("src/data/results.json");
  const entry = chunks.find((c) => c.isEntry);
  return [page, ...(page?.imports ?? []).map((f) => bundle[f]), data]
    .filter((c) => c && c !== entry)
    .map((c) => c.fileName);
};

// 크롤러(카카오·SNS 미리보기)는 JS를 실행하지 않으므로, 결과별 OG 메타를 담은
// dist/result/{animalId}/index.html을 빌드 시점에 만든다.
// GitHub Pages에서 404.html 폴백 대신 200으로 응답하는 효과도 있다.
// 메인 JS → 결과 페이지 청크 → 결과 데이터 → 이미지로 이어지는 워터폴을 막도록
// 필요한 청크는 modulepreload, 결과 이미지는 preload로 함께 넣는다.
export const resultPagesPlugin = (resultsPath) => {
  let base = "/";
  return {
    name: "result-pages",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    writeBundle({ dir }, bundle) {
      const template = fs.readFileSync(path.join(dir, "index.html"), "utf8");
      const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
      const modulePreloads = findResultChunks(bundle)
        .map(
          (file) =>
            `    <link rel="modulepreload" crossorigin href="${base}${file}">`
        )
        .join("\n");

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
        html = html.replace(
          /<link\s+rel="preload"[^>]*data-lcp-preload[^>]*>/,
          `<link rel="preload" as="image" type="image/avif" imagesrcset="${base}animals/${animalId}-320.avif 320w, ${base}animals/${animalId}-640.avif 640w" imagesizes="${RESULT_IMAGE_SIZES}" fetchpriority="high">`
        );
        html = html.replace("  </head>", `${modulePreloads}\n  </head>`);
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
  };
};
