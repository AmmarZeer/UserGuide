import { useEffect, useRef, useState } from "react";
import { closeIcon } from "../../assets";
import styles from "./UserGuide.module.scss";
interface UserGuideProps {
  HTMLGuideElements: HTMLElement[];
  setHTMLGuideElements: React.Dispatch<React.SetStateAction<HTMLElement[]>>;
}
interface UserGuidePosition {
  top: number;
  left: number;
}

type GuideAttributeVerticalPosition = "top" | "right" | "bottom" | "left";

function UserGuide({
  HTMLGuideElements,
  setHTMLGuideElements,
}: UserGuideProps) {
  const currentGuideElementIndex = useRef<number>(0);
  const originalGuideElementZIndex = useRef<string>("");
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
    HTMLGuideElements[elementIndex].style.zIndex = "15";
  }
  function decreaseGuideElementZIndex(elementIndex: number) {
    HTMLGuideElements[elementIndex].style.zIndex =
      originalGuideElementZIndex.current;
  }
  function calculateUserGuideTopValue(
    currentRect: DOMRect,
    positionAttribute: GuideAttributeVerticalPosition
  ): number {
    let userGuideTopPosition = 0;
    switch (positionAttribute) {
      case "top":
        userGuideTopPosition =
          currentRect.top -
          userGuideRef.current?.getBoundingClientRect().height!;
        break;
      case "bottom":
        userGuideTopPosition = currentRect.top + currentRect.height;
        break;
      default:
        userGuideTopPosition = currentRect.top;
        break;
    }
    return fixUserGuideVerticalOffset(userGuideTopPosition);
  }
  function calculateUserGuideLeftValue(
    currentRect: DOMRect,
    positionAttribute: GuideAttributeVerticalPosition
  ): number {
    let userGuideLeftPosition = 0;
    switch (positionAttribute) {
      case "left":
        userGuideLeftPosition =
          currentRect.left -
          userGuideRef.current?.getBoundingClientRect().width!;
        break;
      case "right":
        userGuideLeftPosition = currentRect.left + currentRect.width;
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
    const guideAttribute: GuideAttributeVerticalPosition = HTMLGuideElements[
      elementIndex
    ].getAttribute("data-userguide")! as GuideAttributeVerticalPosition;

    const userGuidePosition: UserGuidePosition = {
      top: calculateUserGuideTopValue(currentGuideElementRect, guideAttribute),
      left: calculateUserGuideLeftValue(
        currentGuideElementRect,
        guideAttribute
      ),
    };
    calculateUserGuideTopValue(currentGuideElementRect, guideAttribute);
    // guideAttribute === "bottom"
    //   ? (userGuidePosition["top"] =
    //       currentGuideElementRect.top + currentGuideElementRect.height)
    //   : (userGuidePosition["top"] = currentGuideElementRect.top);

    // guideAttribute === "right"
    //   ? (userGuidePosition["left"] =
    //       currentGuideElementRect.left + currentGuideElementRect.width)
    //   : (userGuidePosition["left"] =
    //       currentGuideElementRect.left -
    //       userGuideRef.current?.getBoundingClientRect().width!);
    const userGuideBottomOffset =
      userGuidePosition.top +
      userGuideRef.current?.getBoundingClientRect().height! -
      window.innerHeight;
    if (userGuideBottomOffset > 0) {
      userGuidePosition.top -= userGuideBottomOffset;
    }
    console.log(
      userGuidePosition.top +
        userGuideRef.current?.getBoundingClientRect().height!,
      window.innerHeight
    );

    return userGuidePosition;
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
      <div className={styles.shadedBackground}></div>;
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
          <div>Video/GIF</div>
          <h3>Expose Service:</h3>
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
