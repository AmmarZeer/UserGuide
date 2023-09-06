import { CSSProperties, useEffect, useRef, useState } from "react";
import { closeIcon, navigationVideo } from "../../assets";
import styles from "./UserGuide.module.scss";
interface UserGuideProps {
  HTMLGuideElements: HTMLElement[];
  setHTMLGuideElements: React.Dispatch<React.SetStateAction<HTMLElement[]>>;
  spaceOffGuideElements: number;
}
interface UserGuidePosition {
  top: number;
  left: number;
}

type GuideAttributePosition = "top" | "right" | "bottom" | "left";

function UserGuide({
  HTMLGuideElements,
  setHTMLGuideElements,
  spaceOffGuideElements,
}: UserGuideProps) {
  const currentGuideElementIndex = useRef<number>(0);
  const originalGuideElementZIndex = useRef<string>("");
  const guideAttributeRef = useRef<GuideAttributePosition | null>(null);
  const guidePointerRef = useRef<HTMLSpanElement>(null);
  const userGuideRef = useRef<HTMLDivElement>(null);
  const [userGuidePosition, setUserGuidePosition] = useState<UserGuidePosition>(
    {
      top: 0,
      left: 0,
    }
  );

  useEffect(() => {
    setUserGuidePosition(
      getUserGuidePosition(currentGuideElementIndex.current)
    );
  }, []);

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
          userGuideRef.current?.getBoundingClientRect().height! -
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
          userGuideRef.current?.getBoundingClientRect().width! -
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
      topPosition +
      userGuideRef.current?.getBoundingClientRect().height! -
      window.innerHeight;
    if (bottomOfScreenOffset > 0) {
      return topPosition - bottomOfScreenOffset;
    }
    return topPosition;
  }

  function fixUserGuideHorizontalOffset(leftPosition: number): number {
    if (leftPosition < 0) return 0;
    const rightSideOfScreenOffset =
      leftPosition +
      userGuideRef.current?.getBoundingClientRect().width! -
      window.innerWidth;
    if (rightSideOfScreenOffset > 0) {
      return leftPosition - rightSideOfScreenOffset;
    }
    return leftPosition;
  }

  function getUserGuidePosition(elementIndex: number): UserGuidePosition {
    saveGuideElementOriginalZIndex(elementIndex);
    increaseGuideElementZIndex(elementIndex);

    const currentGuideElementRect =
      HTMLGuideElements[elementIndex].getBoundingClientRect();
    guideAttributeRef.current = HTMLGuideElements[elementIndex].getAttribute(
      "data-userguide"
    )! as GuideAttributePosition;

    const userGuidePosition: UserGuidePosition = {
      top: calculateUserGuideTopValue(
        currentGuideElementRect,
        guideAttributeRef.current
      ),
      left: calculateUserGuideLeftValue(
        currentGuideElementRect,
        guideAttributeRef.current
      ),
    };

    return userGuidePosition;
  }

  function guidePointerStyles(): CSSProperties {
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
    switch (guideAttributeRef.current) {
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
    setUserGuidePosition(
      getUserGuidePosition(++currentGuideElementIndex.current)
    );
  }
  function handleBackButton() {
    decreaseGuideElementZIndex(currentGuideElementIndex.current);
    setUserGuidePosition(
      getUserGuidePosition(--currentGuideElementIndex.current)
    );
  }

  return (
    <>
      <div className={styles.shadedBackground}></div>
      <span
        className={styles.guidePointer}
        style={guidePointerStyles()}
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
          onClick={() => setHTMLGuideElements([])}
        />
        <div className={styles.instructionsContainer}>
          <video width={350} height={234} autoPlay muted loop>
            <source src={navigationVideo} />
          </video>
          <h2>Expose Service:</h2>
          <p>
            Integration microservices will be exposed ia Oracle Application
            Gateway. Exposed Services are secured with keyCloak
          </p>
        </div>
        <div className={styles.footer}>
          {currentGuideElementIndex.current > 0 && (
            <button onClick={handleBackButton}>Back</button>
          )}
          {currentGuideElementIndex.current < HTMLGuideElements.length - 1 && (
            <button onClick={handleNextButton}>Next</button>
          )}
        </div>
      </div>
    </>
  );
}

export default UserGuide;
