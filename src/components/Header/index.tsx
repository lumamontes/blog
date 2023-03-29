import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" legacyBehavior passHref>
        <div>
          <img src={'/Logo.svg'} alt="logo" />
        </div>
      </Link>
    </header>
  );
}
