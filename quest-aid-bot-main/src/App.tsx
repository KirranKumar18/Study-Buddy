import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreatePlan from "./pages/CreatePlan";
import Quiz from "./pages/Quiz";
import Session from "./pages/Session";
import SessionDay from "./pages/SessionDay";
import Review from "./pages/Review";
import Auth from "./pages/Auth";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import StudyHours from "./pages/StudyHours";
import QuestionsAnswered from "./pages/QuestionsAnswered";
import AverageScore from "./pages/AverageScore";
import ActivePlans from "./pages/ActivePlans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/create-plan" element={<ProtectedRoute><CreatePlan /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/session" element={<ProtectedRoute><Session /></ProtectedRoute>} />
            <Route path="/session/day" element={<ProtectedRoute><SessionDay /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/study-hours" element={<ProtectedRoute><StudyHours /></ProtectedRoute>} />
            <Route path="/questions-answered" element={<ProtectedRoute><QuestionsAnswered /></ProtectedRoute>} />
            <Route path="/average-score" element={<ProtectedRoute><AverageScore /></ProtectedRoute>} />
            <Route path="/active-plans" element={<ProtectedRoute><ActivePlans /></ProtectedRoute>} />

            {/* Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
