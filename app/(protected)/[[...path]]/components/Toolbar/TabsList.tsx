import Link from "next/link";
import styles from "./Toolbar.module.css";
import type { Tab } from "./types";

type TabsListProps = {
  tabs: Tab[];
};

const TabsList = ({ tabs }: TabsListProps) => {
  const lastIndex = tabs.length - 1;

  return (
    <nav className={styles.breadcrumbs} aria-label="Навигация по папкам">
      <ol className={styles.breadcrumbList}>
        {tabs.map(({ label, current, href }, index) => {
          const isCurrent = typeof current === "boolean" ? current : index === lastIndex;

          return (
            <li key={`${label}-${index}`} className={styles.breadcrumbItem}>
              {isCurrent ? (
                <span className={styles.currentBreadcrumb} aria-current="page">
                  {label}
                </span>
              ) : (
                <Link href={href ?? "#"} className={styles.breadcrumbButton}>
                  {label}
                </Link>
              )}
              {!isCurrent && (
                <span className={styles.breadcrumbSeparator}>/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default TabsList;
