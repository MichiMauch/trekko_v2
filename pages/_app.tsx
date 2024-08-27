// pages/_app.tsx
import '../src/app/globals.css'; // Beispiel: Globales CSS importieren
import 'leaflet/dist/leaflet.css'; // Beispiel: Leaflet CSS importieren
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
