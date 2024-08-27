import dynamic from 'next/dynamic';

// Dynamischer Import der RecentActivities-Komponente ohne SSR (Server-Side Rendering)
const OverviewActivities = dynamic(() => import('../src/components/OverviewActivities'), { ssr: false });

import Navbar from '../src/components/Navbar';
import Hero from '../src/components/Hero';
import Footer from '../src/components/Footer';

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* Gesamtes Layout auf 1920px begrenzen */}
      <div className="max-w-screen-2xl mx-auto">
        {/* Navbar Sektion */}
        <header>
          <Navbar />
        </header>

        {/* Hero Sektion */}
        <section className="bg-white">
          <Hero />
        </section>

        {/* Content Sektion ohne rechte Spalte */}
        <main className="p-4 bg-white">
          {/* Hauptinhalt */}
          <div className="w-full bg-white">
            <OverviewActivities />
          </div>
        </main>

        {/* Footer Sektion */}
        <footer className="bg-white">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
