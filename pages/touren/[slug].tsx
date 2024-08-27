import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getAllActivitySlugs, getActivityBySlug } from '../../lib/activities';
import Navbar from '../../src/components/Navbar';
import HeroPages from '../../src/components/HeroPages';
import Footer from '../../src/components/Footer';
import RightSidebarPages from '../../src/components/RightSidebarPages';
import DetailsActivities from '../../src/components/DetailsActivities';

interface Waypoint {
  lat: number;
  lon: number;
  ele: number;
}

interface Activity {
  _id: string;
  name: string;
  type: string;
  date: number;
  startTime: number;
  endTime: number;
  slug: string;
  startLocation: {
    city: string;
    countryCode2: string;
  };
  endLocation: {
    city: string;
    countryCode2: string;
  };
  waypoints: Waypoint[];
  distance: number;
  movingTime: number;
  elevationGain: number;
  elevationLoss: number;
  duration: number;
}

interface ActivityPageProps {
  activity: Activity;
}

export const getStaticProps: GetStaticProps<ActivityPageProps> = async ({ params }) => {
  try {
    const activity = await getActivityBySlug(params?.slug as string);

    if (!activity) {
      return {
        notFound: true,
      };
    }

    // Reduziere die Anzahl der Wegpunkte, indem du nur jeden 10. Punkt verwendest
    const reducedWaypoints = activity.waypoints.filter((_, index) => index % 2 === 0);

    return {
      props: {
        activity: {
          ...activity,
          waypoints: reducedWaypoints,
        },
      },
      revalidate: 10,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};


export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllActivitySlugs();

  return {
    paths: slugs
      .filter((slug) => slug)
      .map((slug) => ({
        params: { slug: slug!.toString() },
      })),
    fallback: false,
  };
};

export default function ActivityPage({ activity }: ActivityPageProps) {
  const formattedDate = new Date(activity.date * 1000).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="bg-gray-100">
      <div className="max-w-screen-2xl mx-auto">
        <header>
          <Navbar />
        </header>

        <section className="bg-white">
        <HeroPages 
            title={activity.name} 
            date={formattedDate} 
            activityType={activity.type}
            distance={activity.distance}
            elevationGain={activity.elevationGain}
            duration={activity.duration}
            movingTime={activity.movingTime}
          />        </section>

        <main className="flex flex-col lg:flex-row p-4 bg-white">
          <div className="w-full lg:w-3/4 bg-white shadow-xl rounded-2xl mr-4 border border-gray-300 overflow-hidden">
            <DetailsActivities waypoints={activity.waypoints} distance={activity.distance} />
          </div>
          <div className="w-full lg:w-1/4 bg-white shadow-xl rounded-2xl mr-4 border border-gray-300 overflow-hidden">
            <RightSidebarPages 
              startTime={activity.startTime}
              endTime={activity.endTime}  
              distance={activity.distance} 
              duration={activity.duration} 
              movingTime={activity.movingTime}
              elevationGain={activity.elevationGain}
              elevationLoss={activity.elevationLoss}
              startLocationCity={activity.startLocation.city}
              endLocationCity={activity.endLocation.city}
              slug={activity.slug}
               />
          </div>
        </main>

        <footer className="bg-white">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
