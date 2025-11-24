import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./Sidebar.module.css";

type BrandCardProps = {
  variant?: "default" | "header";
  className?: string;
  actionSlot?: ReactNode;
};

const BrandCard = ({
  variant = "default",
  className = "",
  actionSlot,
}: BrandCardProps) => {
  const cardClasses = clsx(
    styles.brandCard,
    variant === "header" && styles.brandCardHeader,
    className,
  );

  return (
    <div className={cardClasses}>
      <div className={styles.brandContent}>
          <Image
            src="/vobla.png"
            alt="Логотип VOblako"
            width={48}
            height={48}
            priority={variant === "header"}
          />
        <div>
          <p className={styles.brandTitle}>VOblako</p>
          <p className={styles.brandSubtitle}>облачное хранилище</p>
        </div>
      </div>
      {actionSlot}
    </div>
  );
};

export default BrandCard;
