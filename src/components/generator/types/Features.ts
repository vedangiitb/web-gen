export type FeaturesProps = {
  content: {
    title: string;
    featureList: string[];
  };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, data: any) => void;
};

export type FeaturesContent = {
  title: string;
  featureList: string[];
} & {
  [key in `feature-${number}`]: string;
};


export type EditableFeatureKeys = "title" | "featureList" | `feature-${number}`;
