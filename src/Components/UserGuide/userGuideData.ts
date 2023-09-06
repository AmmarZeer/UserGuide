import { fillerVideo, navigationVideo } from "../../assets";
export interface UserGuideData {
  [key: string]: {
    videoSrc: string;
    content: string;
  };
}
export const userGuideData: UserGuideData = {
  button1: {
    videoSrc: navigationVideo,
    content:
      "Integration microservices will be exposed ia Oracle Applicatio Gateway. Exposed Services are secured with keyCloaksdf",
  },
  button2: {
    videoSrc: fillerVideo,
    content: "hello",
  },
};
