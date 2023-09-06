import { useEffect, useRef, useState } from "react";
import styles from "./PlayGround.module.scss";
import UserGuide from "./UserGuide/UserGuide";
const buttonStyles = [styles.b1, styles.b2, styles.b3, styles.b4];
function PlayGround() {
  const [HTMLGuideElements, setHTMLGuideElements] = useState<HTMLElement[]>([]);
  useEffect(() => {
    //because it will run twice (strict mode)
    if (HTMLGuideElements.length === 0) {
      const HTMLElementsArray: HTMLElement[] = [];
      document
        .querySelectorAll(`[data-userguide-position]`)
        .forEach((el) => HTMLElementsArray.push(el as HTMLElement));
      setHTMLGuideElements([...HTMLElementsArray]);
    }
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <button
          className={styles.b1}
          data-userguide-key="button1"
          data-userguide-position="right"
        >
          0
        </button>
        <button
          className={styles.b2}
          data-userguide-key="button2"
          data-userguide-position="left"
        >
          1
        </button>
        <button
          className={styles.b3}
          data-userguide-key="button1"
          data-userguide-position="right"
        >
          2
        </button>
        <button
          className={styles.b4}
          data-userguide-key="button2"
          data-userguide-position="left"
        >
          3
        </button>
      </div>
      {HTMLGuideElements.length > 0 && (
        <UserGuide
          HTMLGuideElements={HTMLGuideElements}
          setHTMLGuideElements={setHTMLGuideElements}
          spaceOffGuideElements={10}
        />
      )}
    </>
  );
}

export default PlayGround;
