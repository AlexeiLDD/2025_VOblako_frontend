import styles from "./WorkspaceFooter.module.css";

export type FooterLink = {
  label: string;
  href: string;
};

type WorkspaceFooterProps = {
  productName: string;
  links: FooterLink[];
};

const WorkspaceFooter = ({ productName, links }: WorkspaceFooterProps) => (
  <footer className={styles.workspaceFooter}>
    <span>{productName}</span>
    <div className={styles.links}>
      {links.map(({ label, href }) => (
        <a key={label} href={href} className={styles.link}>
          {label}
        </a>
      ))}
    </div>
  </footer>
);

export default WorkspaceFooter;
