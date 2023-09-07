import { CSSProperties, useEffect, useRef, useState } from "react";
import { closeIcon } from "../../assets";
import styles from "./UserGuide.module.scss";
import { userGuideData } from "./userGuideData";
import {
  Dimensions,
  GuideAttributePosition,
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
    initiateObserver();
    setUserGuideContent(
      userGuideData[
        getGuideElementKeyAttribute(currentGuideElementIndex.current)
      ]
    );
  }, [HTMLGuideElements]);

  useEffect(() => {
    //to prevent calling (getUserGuidePosition) which will call (saveGuideElementOriginalZIndex) which will make the first guided Element z-index to always be 999
    if (userGuideDimensions.width === 0 || userGuideContent.videoSrc == "")
      return;
    setUserGuidePosition(
      getUserGuidePosition(currentGuideElementIndex.current)
    );
  }, [userGuideDimensions, userGuideContent]);

  function initiateObserver() {
    const resizeObserver = new ResizeObserver((elements) => {
      const observedDiv = elements[0];
      setUserGuideDimensions({
        width: observedDiv.borderBoxSize[0].inlineSize,
        height: observedDiv.borderBoxSize[0].blockSize,
      });
    });
    resizeObserver.observe(userGuideRef.current!);
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
    currentRect: DOMRect,
    positionAttribute: GuideAttributePosition
  ): number {
    let userGuideTopPosition = 0;
    switch (positionAttribute) {
      case "top":
        userGuideTopPosition =
          currentRect.top -
          userGuideDimensions.height -
          guidePointerRef.current?.getBoundingClientRect().height! -
          spaceOffGuideElements;

        break;
      case "bottom":
        userGuideTopPosition =
          currentRect.top +
          currentRect.height +
          guidePointerRef.current?.getBoundingClientRect().height! +
          spaceOffGuideElements;
        break;
      default:
        userGuideTopPosition = currentRect.top;
        break;
    }
    return fixUserGuideVerticalOffset(userGuideTopPosition);
  }

  function calculateUserGuideLeftValue(
    currentRect: DOMRect,
    positionAttribute: GuideAttributePosition
  ): number {
    let userGuideLeftPosition = 0;
    switch (positionAttribute) {
      case "left":
        userGuideLeftPosition =
          currentRect.left -
          userGuideDimensions.width -
          guidePointerRef.current?.getBoundingClientRect().height! -
          spaceOffGuideElements;

        break;
      case "right":
        userGuideLeftPosition =
          currentRect.right +
          guidePointerRef.current?.getBoundingClientRect().height! +
          spaceOffGuideElements;
        break;
      default:
        userGuideLeftPosition = currentRect.left;
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

    const currentGuideElementRect =
      HTMLGuideElements[elementIndex].getBoundingClientRect();
    elementPositionAttributeRef.current = getGuideElementPositionAttribute(
      elementIndex
    ) as GuideAttributePosition;

    const userGuidePosition: UserGuidePosition = {
      top: calculateUserGuideTopValue(
        currentGuideElementRect,
        elementPositionAttributeRef.current
      ),
      left: calculateUserGuideLeftValue(
        currentGuideElementRect,
        elementPositionAttributeRef.current
      ),
    };

    return userGuidePosition;
  }

  function getGuidePointerStyles(): CSSProperties {
    const currentHTMLElementRect =
      HTMLGuideElements[
        currentGuideElementIndex.current
      ].getBoundingClientRect();

    const pointerStyles = {
      top: 0,
      left: 0,
      rotate: "0deg",
    };
    //the -1 in top and left cases are needed, otherwise the pointer will have space near the user guide
    switch (elementPositionAttributeRef.current) {
      case "top":
        pointerStyles.top =
          currentHTMLElementRect.top -
          guidePointerRef.current?.getBoundingClientRect().height! -
          spaceOffGuideElements -
          1;
        pointerStyles.left =
          currentHTMLElementRect.left + currentHTMLElementRect.width / 2;
        pointerStyles.rotate = "180deg";
        break;
      case "bottom":
        pointerStyles.top =
          currentHTMLElementRect.bottom + spaceOffGuideElements;
        pointerStyles.left =
          currentHTMLElementRect.left + currentHTMLElementRect.width / 2;
        break;
      case "right":
        pointerStyles.top =
          currentHTMLElementRect.top + currentHTMLElementRect.height / 2;
        pointerStyles.left =
          currentHTMLElementRect.right + spaceOffGuideElements;
        pointerStyles.rotate = "-90deg";
        break;
      case "left":
        pointerStyles.top =
          currentHTMLElementRect.top + currentHTMLElementRect.height / 2;
        pointerStyles.left =
          currentHTMLElementRect.left -
          guidePointerRef.current?.getBoundingClientRect().height! -
          spaceOffGuideElements -
          1;
        pointerStyles.rotate = "90deg";
        break;
    }
    return pointerStyles;
  }

  function handleNextButton() {
    decreaseGuideElementZIndex(currentGuideElementIndex.current);
    currentGuideElementIndex.current++;
    saveGuideElementOriginalZIndex(currentGuideElementIndex.current);

    const guideElementKeyAttribute = getGuideElementKeyAttribute(
      currentGuideElementIndex.current
    );
    setUserGuideContent(userGuideData[guideElementKeyAttribute]);
  }

  function handleBackButton() {
    decreaseGuideElementZIndex(currentGuideElementIndex.current);
    currentGuideElementIndex.current--;
    saveGuideElementOriginalZIndex(currentGuideElementIndex.current);
    const guideElementKeyAttribute = getGuideElementKeyAttribute(
      currentGuideElementIndex.current
    );
    setUserGuideContent(userGuideData[guideElementKeyAttribute]);
  }

  function getGuideElementKeyAttribute(elementIndex: number): string {
    return HTMLGuideElements[elementIndex].getAttribute("data-userguide-key")!;
  }

  function getGuideElementPositionAttribute(elementIndex: number): string {
    return HTMLGuideElements[elementIndex].getAttribute(
      "data-userguide-position"
    )!;
  }
  function handleCloseGuide() {
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
        style={getGuidePointerStyles()}
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
