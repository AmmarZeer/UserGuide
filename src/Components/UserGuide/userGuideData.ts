import { fillerVideo, navigationVideo } from "../../assets";
export interface userGuideContent {
  videoSrc: string;
  title: string;
  instructions: string;
}
interface UserGuideData {
  [key: string]: userGuideContent;
}
export const userGuideData: UserGuideData = {
  button1: {
    videoSrc: navigationVideo,
    title: "",
    instructions:
      "Integration microservices will be exposed ia Oracle Applicatio Gateway. Exposed Services are secured with keyCloaksdf",
  },
  button2: {
    videoSrc: fillerVideo,
    title: "",
    instructions: "hello",
  },
};
