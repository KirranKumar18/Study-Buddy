import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Dashboard } from "@/components/Dashboard";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { initApiClient } from "@/lib/api";

const Index = () => {
  const { user, accessToken, refreshAccessToken, logout } = useAuth();

  // Initialize the API client with auth functions
  useEffect(() => {
    initApiClient(
      () => accessToken,
      refreshAccessToken,
      () => {
        logout();
      }
    );
  }, [accessToken, refreshAccessToken, logout]);

  // Build user object for Header
  const headerUser = user ? {
    name: user.username,
    xp: 1250,  // These can come from backend later
    level: 5,
    streak: 7,
  } : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header user={headerUser} />
      
      {user ? (
        <Dashboard />
      ) : (
        <>
          <Hero />
          <Features />
          <HowItWorks />
          <CTA />
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
