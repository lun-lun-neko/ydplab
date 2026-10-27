const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
const KAKAO_TEMPLATE_ID = import.meta.env.VITE_KAKAO_TEMPLATE_ID;

const initKakao = () => {
  const { Kakao } = window;
  if (Kakao.isInitialized()) {
    return;
  }
  Kakao.init(KAKAO_JS_KEY);
};

const shareByKakaoTalk = ({
  name,
  animalType,
  description,
  imageURL,
  animalId,
}) => {
  const { Kakao } = window;
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

export { initKakao, shareByKakaoTalk };
