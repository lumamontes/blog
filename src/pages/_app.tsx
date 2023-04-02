import { PrismicProvider } from '@prismicio/react';
import Link from 'next/link';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <PrismicProvider internalLinkComponent={props => <Link {...props} />}>
      <Component {...pageProps} />
    </PrismicProvider>
  );
}
