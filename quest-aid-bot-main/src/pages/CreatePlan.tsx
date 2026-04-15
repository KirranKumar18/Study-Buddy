import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StepWizard } from "@/components/StepWizard";
import { FileUploadZone } from "@/components/FileUploadZone";
import { ChipInput } from "@/components/ChipInput";
import { ProcessingModal } from "@/components/ProcessingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function CreatePlan() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("Generating your plan..."); // For modal

  const [formData, setFormData] = useState({
    subject: "",
    examDate: "",
    dailyMinutes: 60,
    sessionLength: 45,
    topics: [] as string[],
    notes: "", // <-- 2. Add notes to state
    files: [] as File[]
  });

  const steps = ["Basic Info", "Topics", "Resources", "Review"];

  const handleNext = () => {
    if (currentStep === 1 && (!formData.subject || !formData.examDate)) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (currentStep === 2 && formData.topics.length === 0) {
      toast.error("Please add at least one topic");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(); // <-- This will now call the async function
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- 3. THIS IS THE REPLACED ASYNC SUBMIT FUNCTION ---
  const handleSubmit = async () => {
    setIsProcessing(true);
    setProcessingStep("Contacting AI assistant...");

    // 1. Create the payload for our API
    const apiPayload = {
      subject: formData.subject,
      exam_date: formData.examDate,
      daily_study_time: formData.dailyMinutes,
      session_length: formData.sessionLength,
      topics: formData.topics,
      notes: formData.notes // <-- Pass notes to backend
    };

    // NOTE: File uploads are not yet implemented in the backend.

    // 2. Call the backend API (using the proxy)
    try {
      setProcessingStep("Searching the web for context...");
      const response = await apiFetch('/api/plans/', {
        method: 'POST',
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        // If the server returns an error, show it
        let errorMessage = "Failed to create study plan";
        try {
          // Only attempt to parse JSON if the response says it is JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
          } else {
            // If it's not JSON (like a 502/504 error page), use status text
            errorMessage = `Server Error: ${response.status} ${response.statusText}. Please ensure the backend is running.`;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }

      setProcessingStep("Building daily schedule...");
      
      // 3. Get the real plan data back from the server
      const newPlan = await response.json(); // This is the 'schemas.StudyPlan' object
      
      // 4. (Optional) Save to localStorage to keep other pages working
      const existingPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
      
      // Map backend data to frontend's expected 'PlanCard' format
      const frontendPlan = {
        id: newPlan.id, // The real ID from the database
        subject: newPlan.subject,
        examDate: newPlan.exam_date,
        topics: formData.topics, 
        dailyMinutes: newPlan.daily_study_time,
        sessionLength: newPlan.session_length,
        progress: 0,
        sessionsCompleted: 0,
        totalSessions: newPlan.daily_sessions.length,
        nextSession: { // Get first session from real data
            topic: newPlan.daily_sessions[0]?.topic_title || "First Session",
            date: newPlan.daily_sessions[0]?.date || newPlan.exam_date,
            time: "9:00 AM" // You can make this dynamic
        }
      };
      
      existingPlans.push(frontendPlan);
      localStorage.setItem('studyPlans', JSON.stringify(existingPlans));

      // 5. Update stats
      const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
        totalStudyHours: 0,
        questionsAnswered: 0,
        averageScore: 0,
        activePlans: 0
      }));
      stats.activePlans = existingPlans.length;
      localStorage.setItem('userStats', JSON.stringify(stats));
      
      // 6. Success!
      setIsProcessing(false);
      toast.success("Study plan created successfully!");
      
      // Navigate to the session page, using the real plan ID
      navigate(`/session?plan=${newPlan.id}&subject=${encodeURIComponent(newPlan.subject)}`);

    } catch (error: any) {
      console.error(error);
      setIsProcessing(false);
      toast.error(error.message || "An unknown error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Create Study Plan</h1>
          <p className="text-muted-foreground mb-8">Let's build your personalized study schedule</p>
          
          <StepWizard currentStep={currentStep} steps={steps} />

          <div className="bg-card rounded-2xl shadow-md p-8 mt-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Physics, Mathematics"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="examDate">Exam Date *</Label>
                  <div className="relative mt-2">
                    <Input
                      id="examDate"
                      type="date"
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dailyMinutes">Daily Study Time (minutes)</Label>
                  <Input
                    id="dailyMinutes"
                    type="number"
                    min="15"
                    max="180"
                    value={formData.dailyMinutes}
                    onChange={(e) => setFormData({ ...formData, dailyMinutes: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="sessionLength">Session Length (minutes)</Label>
                  <select
                    id="sessionLength"
                    value={formData.sessionLength}
                    onChange={(e) => setFormData({ ...formData, sessionLength: parseInt(e.target.value) })}
                    className="mt-2 w-full rounded-lg border-2 border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Topics to Cover *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Add topics one by one. This helps the AI build your schedule.</p>
                  <ChipInput
                    values={formData.topics}
                    onChange={(topics) => setFormData({ ...formData, topics })}
                    placeholder="Type a topic and press Enter"
                  />
                </div>
                
                {/* --- 4. ADDED NOTES FIELD --- */}
                <div className="mt-4">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                   <p className="text-sm text-muted-foreground mb-3">Tell the AI what topics you find difficult or want to focus on.</p>
                  <Textarea
                    id="notes"
                    placeholder="e.g., 'I am weak in thermodynamics', 'Focus more on practice problems for quantum mechanics'"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Upload Study Materials (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    (Feature coming soon) Upload PDFs, notes, or images.
                  </p>
                  <FileUploadZone
                    files={formData.files}
                    onChange={(files) => setFormData({ ...formData, files })}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Review Your Plan</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Subject:</span>
                    <span className="font-semibold">{formData.subject}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Exam Date:</span>
                    <span className="font-semibold">{new Date(formData.examDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Daily Study Time:</span>
                    <span className="font-semibold">{formData.dailyMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Topics:</span>
                    <span className="font-semibold">{formData.topics.length} topics</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Files:</span>
                    <span className="font-semibold">{formData.files.length} files</span>
                  </div>
                  {/* --- 5. ADDED NOTES TO REVIEW --- */}
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Notes:</span>
                    <span className="font-semibold truncate max-w-xs">{formData.notes || "None"}</span>
                  </div>
                </div>

                {formData.topics.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.topics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isProcessing}
              >
                Back
              </Button>
              <Button onClick={handleNext} className="gradient-primary text-white" disabled={isProcessing}>
                {currentStep === 4 ? (isProcessing ? "Generating..." : "Generate Plan") : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isProcessing && (
        <ProcessingModal
          progress={65} // You can make this dynamic if you want
          currentStep={processingStep} // Use the new state here
          onCancel={() => setIsProcessing(false)}
        />
      )}
    </div>
  );
}