//if the guide was on the right or on bottom we use -1 and if it was on the left or on the top we use +1 this is a safe value (making the guide go inside the pointer in 1 px)
import { useEffect, useRef, useState } from "react";
import { closeIcon } from "../../assets/index";
import styles from "./UserGuide.module.scss";
import { userGuideData } from "./userGuideData";
import {
  Dimensions,
  GuideAttributePosition,
  PointerPosition,
  UserGuidePosition,
  UserGuideProps,
  userGuideInstructions,
} from "./userGuideInterfaces";

function UserGuide({
  spaceOffGuideElements,
  afterCloseAction,
}: UserGuideProps) {
  const currentGuideElementIndex = useRef<number>(0);
  const originalGuideElementZIndex = useRef<string>("");
  const elementPositionAttributeRef = useRef<GuideAttributePosition | null>(
    null
  );
  const guidePointerRef = useRef<HTMLSpanElement>(null);
  const userGuideRef = useRef<HTMLDivElement>(null);

  const [HTMLGuideElements, setHTMLGuideElements] = useState<HTMLElement[]>([]);
  const [userGuideContent, setUserGuideContent] =
    useState<userGuideInstructions>({
      videoSrc: "",
      title: "",
      description: "",
    });
  const [userGuideDimensions, setUserGuideDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [userGuidePosition, setUserGuidePosition] = useState<UserGuidePosition>(
    {
      top: 0,
      left: 0,
    }
  );
  const [userGuidePointerPosition, setUserGuidePointerPosition] =
    useState<PointerPosition>({
      top: 0,
      left: 0,
      rotate: "0",
    });

  useEffect(() => {
    //because it will run twice (strict mode)
    if (HTMLGuideElements.length === 0) {
      const HTMLElementsArray: HTMLElement[] = [];
      document
        .querySelectorAll(`[data-userguide-position]`)
        .forEach((el) => HTMLElementsArray.push(el as HTMLElement));
      HTMLElementsArray.sort(
        (a, b) =>
          parseInt(a.getAttribute("data-userguide-order")!) -
          parseInt(b.getAttribute("data-userguide-order")!)
      );
      setHTMLGuideElements(HTMLElementsArray);
    }
  }, []);

  useEffect(() => {
    if (!userGuideRef.current || HTMLGuideElements.length === 0) return;
    const resizeObserver = createAndRunObserver();
    setUserGuideContent(
      userGuideData[getGuideElementKeyAttribute(currentGuideElementIndex)]
    );
    setElementPositionAttributeRef(currentGuideElementIndex.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [HTMLGuideElements]);

  useEffect(() => {
    if (userGuideContent.videoSrc === "" || userGuideDimensions.width === 0)
      return;
    setUserGuidePointerPosition(getGuidePointerPosition());
  }, [userGuideContent, userGuideDimensions]);

  useEffect(() => {
    if (userGuideContent.videoSrc === "") return;
    setUserGuidePosition(
      getUserGuidePosition(currentGuideElementIndex.current)
    );
  }, [userGuidePointerPosition]);

  function createAndRunObserver() {
    const resizeObserver = new ResizeObserver((elements) => {
      const observedDiv = elements[0];
      setUserGuideDimensions({
        width: observedDiv.borderBoxSize[0].inlineSize,
        height: observedDiv.borderBoxSize[0].blockSize,
      });
    });
    resizeObserver.observe(userGuideRef.current!);
    return resizeObserver;
  }

  function saveGuideElementOriginalZIndex(elementIndex: number) {
    originalGuideElementZIndex.current =
      HTMLGuideElements[elementIndex].style.zIndex;
  }

  function increaseGuideElementZIndex(elementIndex: number) {
    HTMLGuideElements[elementIndex].style.zIndex = "999";
  }

  function decreaseGuideElementZIndex(elementIndex: number) {
    HTMLGuideElements[elementIndex].style.zIndex =
      originalGuideElementZIndex.current;
  }

  function calculateUserGuideTopValue(
    positionAttribute: GuideAttributePosition
  ): number {
    let userGuideTopPosition = 0;
    switch (positionAttribute) {
      case "top":
        userGuideTopPosition =
          userGuidePointerPosition.top - userGuideDimensions.height;
        break;
      case "bottom":
        userGuideTopPosition =
          userGuidePointerPosition.top +
          guidePointerRef.current?.getBoundingClientRect().height!;
        break;
      default:
        userGuideTopPosition =
          userGuidePointerPosition.top - userGuideDimensions.height / 2;
        break;
    }
    return fixUserGuideVerticalOffset(userGuideTopPosition);
  }

  function calculateUserGuideLeftValue(
    positionAttribute: GuideAttributePosition
  ): number {
    let userGuideLeftPosition = 0;
    switch (positionAttribute) {
      case "left":
        userGuideLeftPosition =
          userGuidePointerPosition.left - userGuideDimensions.width;
        break;
      case "right":
        userGuideLeftPosition =
          userGuidePointerPosition.left +
          guidePointerRef.current?.getBoundingClientRect().width!;
        break;
      default:
        userGuideLeftPosition =
          userGuidePointerPosition.left - userGuideDimensions.width / 2;
        break;
    }
    return fixUserGuideHorizontalOffset(userGuideLeftPosition);
  }

  function fixUserGuideVerticalOffset(topPosition: number): number {
    //off from the top of the screen
    if (topPosition < 0) return 0;
    const bottomOfScreenOffset =
      topPosition + userGuideDimensions.height - window.innerHeight;
    if (bottomOfScreenOffset > 0) {
      return topPosition - bottomOfScreenOffset;
    }
    return topPosition;
  }

  function fixUserGuideHorizontalOffset(leftPosition: number): number {
    if (leftPosition < 0) return 0;
    const rightSideOfScreenOffset =
      leftPosition + userGuideDimensions.width - window.innerWidth;
    if (rightSideOfScreenOffset > 0) {
      return leftPosition - rightSideOfScreenOffset;
    }
    return leftPosition;
  }

  function getUserGuidePosition(elementIndex: number): UserGuidePosition {
    increaseGuideElementZIndex(elementIndex);

    const userGuidePosition: UserGuidePosition = {
      top: calculateUserGuideTopValue(elementPositionAttributeRef.current!),
      left: calculateUserGuideLeftValue(elementPositionAttributeRef.current!),
    };

    return userGuidePosition;
  }

  function getGuidePointerPosition() {
    const currentHTMLElementRect =
      HTMLGuideElements[
        currentGuideElementIndex.current
      ].getBoundingClientRect();
    const pointerPosition = {
      top: 0,
      left: 0,
      rotate: "0deg",
    };
    //the -1 in top and left cases are needed, otherwise the pointer will have space near the user guide
    switch (elementPositionAttributeRef.current) {
      case "top":
        pointerPosition.top =
          currentHTMLElementRect.top -
          guidePointerRef.current?.getBoundingClientRect().height! -
          spaceOffGuideElements;
        pointerPosition.left =
          currentHTMLElementRect.left + currentHTMLElementRect.width / 2;
        pointerPosition.rotate = "180deg";
        break;
      case "bottom":
        pointerPosition.top =
          currentHTMLElementRect.bottom + spaceOffGuideElements;
        pointerPosition.left =
          currentHTMLElementRect.left + currentHTMLElementRect.width / 2;
        break;
      case "right":
        pointerPosition.top =
          currentHTMLElementRect.top + currentHTMLElementRect.height / 2;
        pointerPosition.left =
          currentHTMLElementRect.right + spaceOffGuideElements;
        pointerPosition.rotate = "-90deg";
        break;
      case "left":
        pointerPosition.top =
          currentHTMLElementRect.top + currentHTMLElementRect.height / 2;
        pointerPosition.left =
          currentHTMLElementRect.left -
          guidePointerRef.current?.getBoundingClientRect().height! -
          spaceOffGuideElements;
        pointerPosition.rotate = "90deg";
        break;
    }
    return pointerPosition;
  }

  function handleNextButton() {
    decreaseGuideElementZIndex(currentGuideElementIndex.current);
    currentGuideElementIndex.current++;
    saveGuideElementOriginalZIndex(currentGuideElementIndex.current);
    setElementPositionAttributeRef(currentGuideElementIndex.current);

    const guideElementKeyAttribute = getGuideElementKeyAttribute(
      currentGuideElementIndex
    );
    setUserGuideContent(userGuideData[guideElementKeyAttribute]);
  }

  function handleBackButton() {
    decreaseGuideElementZIndex(currentGuideElementIndex.current);
    currentGuideElementIndex.current--;
    saveGuideElementOriginalZIndex(currentGuideElementIndex.current);
    setElementPositionAttributeRef(currentGuideElementIndex.current);

    const guideElementKeyAttribute = getGuideElementKeyAttribute(
      currentGuideElementIndex
    );
    setUserGuideContent(userGuideData[guideElementKeyAttribute]);
  }

  function getGuideElementKeyAttribute(
    elementIndexRef: React.MutableRefObject<number>
  ): string {
    return HTMLGuideElements[elementIndexRef.current].getAttribute(
      "data-userguide-key"
    )!;
  }
  function setElementPositionAttributeRef(elementIndex: number) {
    elementPositionAttributeRef.current = HTMLGuideElements[
      elementIndex
    ].getAttribute("data-userguide-position")! as GuideAttributePosition;
  }

  function handleCloseGuide() {
    decreaseGuideElementZIndex(currentGuideElementIndex.current);
    setHTMLGuideElements([]);
    afterCloseAction();
  }

  //short circuit the component in case the querySelectorAll hasn't been run yet
  if (HTMLGuideElements.length === 0) return <></>;

  return (
    <>
      <div className={styles.shadedBackground}></div>
      <span
        className={styles.guidePointer}
        style={userGuidePointerPosition}
        ref={guidePointerRef}
      ></span>
      <div
        className={styles.guideContainer}
        style={userGuidePosition}
        ref={userGuideRef}
      >
        <img
          className={styles.closeIcon}
          src={closeIcon}
          alt="close icon"
          onClick={handleCloseGuide}
        />
        <div className={styles.instructionsContainer}>
          <video
            className={styles.instructionsVideo}
            key={userGuideContent.videoSrc}
            width={350}
            height={234}
            autoPlay
            muted
            loop
          >
            <source src={userGuideContent.videoSrc} />
          </video>

          <h2 className={styles.instructionsTitle}>{userGuideContent.title}</h2>
          <div
            className={styles.instructionsDescription}
            dangerouslySetInnerHTML={{ __html: userGuideContent.description }}
          ></div>
        </div>
        <div className={styles.footer}>
          {currentGuideElementIndex.current > 0 && (
            <button onClick={handleBackButton}>Back</button>
          )}
          {currentGuideElementIndex.current < HTMLGuideElements.length - 1 && (
            <button onClick={handleNextButton}>Next</button>
          )}
          {currentGuideElementIndex.current ===
            HTMLGuideElements.length - 1 && (
            <button onClick={handleCloseGuide}>Close</button>
          )}
        </div>
      </div>
    </>
  );
}

export default UserGuide;
