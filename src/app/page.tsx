import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import RightSidebar from '../components/RightSidebar';
import RecentActivities from '../components/RecentActivities';


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

        {/* Content Sektion mit rechter Spalte */}
        <main className="flex flex-col lg:flex-row p-4 bg-white">
          {/* Hauptinhalt */}
          <div className="w-full lg:w-3/4 bg-white">
            <RecentActivities />
          </div>

          {/* Rechte Spalte */}
          <div className="w-full lg:w-1/4 bg-white shadow-xl rounded-2xl mr-4 border border-gray-300 overflow-hidden">
            <RightSidebar />
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
