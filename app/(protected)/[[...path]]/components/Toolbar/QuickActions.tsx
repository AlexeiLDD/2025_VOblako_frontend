import styles from "./Toolbar.module.css";
import type { QuickAction } from "./types";

type QuickActionsProps = {
  actions: QuickAction[];
};

const QuickActions = ({ actions }: QuickActionsProps) => (
  <div className={styles.quickActions}>
    {actions.map(({ label, Icon }) => (
      <button key={label} type="button" className={styles.quickAction}>
        <Icon />
        {label}
      </button>
    ))}
  </div>
);

export default QuickActions;
