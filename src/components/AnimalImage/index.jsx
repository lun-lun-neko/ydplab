import { ANIMAL_IDS } from "../../constants/ANIMALS";

const WIDTHS = [320, 640];

const AnimalImage = ({
  animalId,
  fallbackSrc,
  alt,
  sizes,
  className,
  priority = false,
}) => {
  const loadingProps = priority
    ? { loading: "eager", fetchPriority: "high" }
    : { loading: "lazy" };

  // 최적화 이미지가 없는 동물은 API가 준 원본을 그대로 쓴다
  if (!ANIMAL_IDS.includes(animalId)) {
    return (
      <img src={fallbackSrc} alt={alt} className={className} {...loadingProps} />
    );
  }

  const base = `${import.meta.env.BASE_URL}animals/${animalId}`;
  const srcSet = (ext) =>
    WIDTHS.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        src={`${base}-640.webp`}
        srcSet={srcSet("webp")}
        sizes={sizes}
        width={640}
        height={640}
        alt={alt}
        className={className}
        decoding="async"
        {...loadingProps}
      />
    </picture>
  );
};

export default AnimalImage;
