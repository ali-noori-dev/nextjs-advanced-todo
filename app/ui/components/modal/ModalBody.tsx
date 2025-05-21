import styles from "./modal.module.scss";

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className={styles["modal__body"]}>{children}</div>;
}
