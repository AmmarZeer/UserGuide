import { fillerVideo, navigationVideo } from "../../assets";
import { UserGuideData } from "./userGuideInterfaces";

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
    instructions: `
        1. Enterprise Integration Patterns: EI module supports multiple EIP,e.g. Content Based Router, Aggregator, Message filter etc.
        2.Connectors (Components & Kamelets): Connectors offer services for messaging, sending data, notifications and various other services that can not only resolve easy messaging and transferring data but also provide securing of data.`,
  },
  button3: {
    videoSrc: fillerVideo,
    title: "",
    instructions: "hello",
  },
  button4: {
    videoSrc: fillerVideo,
    title: "",
    instructions: "hello",
  },
};
