import { fillerVideo, navigationVideo } from "../../assets";
import { UserGuideData } from "./userGuideInterfaces";

export const userGuideData: UserGuideData = {
  button1: {
    videoSrc: navigationVideo,
    title: "Left Navigation:",
    description:
      "Integration microservices will be exposed ia Oracle Applicatio Gateway. Exposed Services are secured with keyCloaksdf",
  },
  button2: {
    videoSrc: fillerVideo,
    title: "Left Navigation:",
    description: `
        <p><span>1. Enterprise Integration Patterns:</span> EI module supports multiple EIP,e.g. Content Based Router, Aggregator, Message filter etc.</P>
        <p><span>2.Connectors (Components & Kamelets):</span> Connectors offer services for messaging, sending data, notifications and various other services that can not only resolve easy messaging and transferring data but also provide securing of data.</p>,`,
  },
  button3: {
    videoSrc: fillerVideo,
    title: "",
    description: "hello",
  },
  button4: {
    videoSrc: fillerVideo,
    title: "",
    description: "hello",
  },
};
