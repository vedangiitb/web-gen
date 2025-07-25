export type HeroProps = {
  content: {
    heading: string;
    subheading: string;
    primaryButton: string;
    secondaryButton: string;
    imageUrl: string;
  };
  style: GenStyles;
  heroImg: string;
  editMode: boolean;
  updateData: (key: string, value: any) => void;
  setShowImgBox: (show: boolean) => void;
};

export type HeroContent = {
  heading: string;
  subheading: string;
  primaryButton: string;
  secondaryButton: string;
  imageUrl: string;
};

export type EditableHeroKeys =
  | "heading"
  | "subheading"
  | "primaryButton"
  | "secondaryButton";