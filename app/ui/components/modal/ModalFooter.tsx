import styles from "./modal.module.scss";

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className={styles["modal__footer"]}>{children}</div>;
}
