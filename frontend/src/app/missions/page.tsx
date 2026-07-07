import Background from "@/components/background/Background";
import Navbar from "@/components/Navbar/Navbar";
import MissionHero from "@/components/missions/MissionHero";
import MissionStats from "@/components/missions/MissionStats";
import MissionGrid from "@/components/missions/MissionGrid";

export default function MissionsPage() {
  return (
    <>
      <Background />
      <Navbar />
      <MissionHero />
      <MissionStats />
      <MissionGrid />
    </>
  );
}