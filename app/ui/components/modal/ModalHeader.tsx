import styles from "./modal.module.scss";

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className={styles["modal__header"]}>{children}</div>;
}
