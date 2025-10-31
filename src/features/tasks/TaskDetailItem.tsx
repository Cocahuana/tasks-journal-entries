// Right now, this component displays a label and a value for task details.
// I dont consider that this component will be reused elsewhere more than in TaskDetail,
import { tv } from "tailwind-variants";
const detailItemStyles = tv({
  slots: {
    base: "flex",
    label: "font-medium",
    value: "",
  }
});

interface DetailItemProps {
  label: string;
  value: string;
}

export function TaskDetailItem({ label, value }: DetailItemProps) {
    const styles = detailItemStyles();
    // Added a space before the value for better readability
const spacedValue = ` ${value}`;
  return (
    <div className={styles.base()}>
      <span className={styles.label()}>{label}</span>
      <span className={styles.value()}>: {spacedValue}</span>
    </div>
  );
}