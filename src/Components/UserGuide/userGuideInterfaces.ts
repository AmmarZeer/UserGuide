export interface UserGuideProps {
  spaceOffGuideElements: number;
  afterCloseAction: () => void;
}
export interface UserGuidePosition {
  top: number;
  left: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type GuideAttributePosition = "top" | "right" | "bottom" | "left";

export interface userGuideContent {
  videoSrc: string;
  title: string;
  instructions: string;
}
export interface UserGuideData {
  [key: string]: userGuideContent;
}
