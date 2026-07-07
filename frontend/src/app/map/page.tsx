import Background from "@/components/background/Background";
import Navbar from "@/components/Navbar/Navbar";

import MapHero from "@/components/map/MapHero";
import RescueMap from "@/components/map/RescueMap";
import ActivityFeed from "@/components/map/ActivityFeed";

export default function MapPage() {
  return (
    <>
      <Background />
      <Navbar />

      <MapHero />

      <RescueMap />

      <ActivityFeed />

    </>
  );
}