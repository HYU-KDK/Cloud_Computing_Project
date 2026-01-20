import React from "react";
import { Gender } from "../../types";

// 이미지 import
import female0 from "../../assets/characters/female_stage0.png";
import female1 from "../../assets/characters/female_stage1.png";
import female2 from "../../assets/characters/female_stage2.png";
import female3 from "../../assets/characters/female_stage3.png";
import female4 from "../../assets/characters/female_stage4.png";
import female5 from "../../assets/characters/female_stage5.png";

import male0 from "../../assets/characters/male_stage0.png";
import male1 from "../../assets/characters/male_stage1.png";
import male2 from "../../assets/characters/male_stage2.png";
import male3 from "../../assets/characters/male_stage3.png";
import male4 from "../../assets/characters/male_stage4.png";
import male5 from "../../assets/characters/male_stage5.png";

const CHARACTER_IMAGES: Record<
  Gender,
  string[]
> = {
  female: [female0, female1, female2, female3, female4, female5],
  male: [male0, male1, male2, male3, male4, male5],
};

interface CharacterProps {
  gender: Gender;
  stage: number; // 0~5
  size?: number; // px
  className?: string;
}

const clampStage = (stage: number) => {
  if (stage < 0) return 0;
  if (stage > 5) return 5;
  return stage;
};

const Character: React.FC<CharacterProps> = ({
  gender,
  stage,
  size = 160,
  className,
}) => {
  const safeStage = clampStage(stage);
  const src = CHARACTER_IMAGES[gender][safeStage];

  return (
    <img
      src={src}
      alt={`${gender} character stage ${safeStage}`}
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
};

export default Character;
