import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <strong>Feito com 💗 por Luma</strong>
      <p>
        Projeto desenvolvido como desafio do curso Ignite da{' '}
        <a href="https://www.rocketseat.com.br/" target="blank">
          Rocketseat
        </a>{' '}
      </p>
    </footer>
  );
}
