import Background from "@/components/background/Background";
import Navbar from "@/components/Navbar/Navbar";

import AnalyticsHero from "@/components/analytics/AnalyticsHero";
import AnalyticsStats from "@/components/analytics/AnalyticsStats";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <>
      <Background />
      <Navbar />

      <AnalyticsHero />

      <AnalyticsStats />

      <AnalyticsDashboard />
    </>
  );
}