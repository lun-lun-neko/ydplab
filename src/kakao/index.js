const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
const KAKAO_TEMPLATE_ID = import.meta.env.VITE_KAKAO_TEMPLATE_ID;
const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js";
const KAKAO_SDK_INTEGRITY =
  "sha384-WAtVcQYcmTO/N+C1N+1m6Gp8qxh+3NlnP7X1U7qP6P5dQY/MsRBNTh+e1ahJrkEm";

let sdkPromise = null;

// 공유할 때만 필요한 SDK(약 27KB)를 첫 화면에서 빼고 결과 페이지에서 받는다.
// 공유 버튼을 누를 때 처음 받으면 사파리의 팝업 차단(사용자 제스처 만료)에 걸릴 수 있어
// 결과 페이지에 들어오면 미리 받아 둔다.
const loadKakaoSdk = () => {
  if (window.Kakao) return Promise.resolve(window.Kakao);

  sdkPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = () => resolve(window.Kakao);
    script.onerror = () => {
      sdkPromise = null;
      script.remove();
      reject(new Error("Kakao SDK를 불러오지 못했어요."));
    };
    document.head.append(script);
  });
  return sdkPromise;
};

const initKakao = (Kakao) => {
  if (Kakao.isInitialized()) {
    return;
  }
  Kakao.init(KAKAO_JS_KEY);
};

const shareByKakaoTalk = async ({
  name,
  animalType,
  description,
  imageURL,
  animalId,
}) => {
  const Kakao = await loadKakaoSdk();
  initKakao(Kakao);
  Kakao.Share.sendCustom({
    templateId: Number(KAKAO_TEMPLATE_ID),
    templateArgs: {
      name,
      animalType,
      description,
      imageURL,
      // 템플릿 링크를 /ydplab/result/${animalId}로 설정하면 받은 사람도 결과를 볼 수 있다
      animalId,
    },
    installTalk: true,
  });
};

export { loadKakaoSdk, shareByKakaoTalk };
