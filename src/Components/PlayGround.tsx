import styles from "./PlayGround.module.scss";
import UserGuide from "./UserGuide/UserGuide";
function PlayGround() {
  return (
    <>
      <div className={styles.wrapper}>
        <button
          className={styles.b1}
          data-userguide-order="1"
          data-userguide-key="button1"
          data-userguide-position="right"
        >
          0
        </button>
        <button
          className={styles.b2}
          data-userguide-order="3"
          data-userguide-key="button2"
          data-userguide-position="left"
        >
          1
        </button>
        <button
          className={styles.b3}
          data-userguide-order="2"
          data-userguide-key="button1"
          data-userguide-position="right"
        >
          2
        </button>
        <button
          className={styles.b4}
          data-userguide-order="4"
          data-userguide-key="button2"
          data-userguide-position="left"
        >
          3
        </button>
      </div>
      <UserGuide spaceOffGuideElements={10} />
    </>
  );
}

export default PlayGround;
