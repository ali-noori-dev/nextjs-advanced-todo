import { TextareaField } from "@/app/ui/components";
import styles from "./title-field.module.scss";

type TitleFieldProps = {
  title: string;
  onUpdate: (newTitle: string) => void;
};

export function TitleField({ title, onUpdate }: TitleFieldProps) {
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value.trim();
    if (newTitle && newTitle !== title) {
      onUpdate(newTitle);
    } else {
      // Reset to original title if empty
      e.target.value = title;
    }
  };

  return (
    <TextareaField
      defaultValue={title}
      className={styles["title-field"]}
      onFocus={(e) => e.target.select()}
      onBlur={handleBlur}
    />
  );
}
