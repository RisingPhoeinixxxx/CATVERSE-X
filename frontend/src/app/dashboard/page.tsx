import Background from "@/components/background/Background";
import CircuitOverlay from "@/components/background/CircuitOverlay";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Dashboard from "@/components/dashboard/Dashboard";
import PawCursor from "@/components/cursor/PawCursor";

export default function DashboardPage() {
  return (
    <>
      <Background />
      <CircuitOverlay />
      <Navbar />
      <Hero />
      <Dashboard />
      <PawCursor />
    </>
  );
}