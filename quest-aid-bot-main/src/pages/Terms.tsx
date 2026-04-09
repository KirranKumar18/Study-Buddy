import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 8, 2025</p>

          <Card className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using StudyBuddy, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Use of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                You agree to use StudyBuddy only for lawful purposes and in accordance with these terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Share your account credentials with others</li>
                <li>Upload copyrighted materials you don't own</li>
                <li>Attempt to reverse engineer or hack the platform</li>
                <li>Use the service to cheat on exams or assessments</li>
                <li>Abuse or harass other users or support staff</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The StudyBuddy platform, including its original content, features, and functionality, is owned by StudyBuddy and is protected by international copyright, trademark, and other intellectual property laws. You retain ownership of materials you upload, but grant us a license to process them for service delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Subscription and Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paid subscriptions are billed in advance on a recurring basis. You may cancel your subscription at any time, but refunds are only provided within 14 days of initial purchase. Prices are subject to change with 30 days notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. AI-Generated Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                StudyBuddy uses AI to generate study plans, quizzes, and explanations. While we strive for accuracy, AI-generated content may contain errors. Users should verify important information from authoritative sources. We are not liable for any damages resulting from reliance on AI-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                StudyBuddy is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about these Terms of Service should be sent to legal@studybuddy.com
              </p>
            </section>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
