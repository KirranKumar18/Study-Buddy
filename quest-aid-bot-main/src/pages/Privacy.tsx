import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 8, 2025</p>

          <Card className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, including your name, email address, study materials, quiz responses, and account preferences. We also automatically collect usage data such as study session times, quiz scores, and platform interactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide and improve our study planning services</li>
                <li>Generate personalized learning recommendations</li>
                <li>Track your progress and achievements</li>
                <li>Send important notifications and updates</li>
                <li>Improve our AI algorithms and platform features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption at rest and in transit, regular security audits, and strict access controls. Your study materials and personal information are stored securely and never shared with third parties without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to maintain your session and remember your preferences. Analytics cookies help us understand how you use the platform to improve your experience. You can manage cookie preferences in your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use trusted third-party services for AI processing, analytics, and infrastructure. These services are carefully vetted and operate under strict data protection agreements. We never sell your data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is intended for users 13 years and older. If we discover that we've collected information from a child under 13, we will delete it immediately. Parents or guardians can contact us regarding any concerns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this privacy policy or how we handle your data, please contact us at privacy@studybuddy.com or visit our Contact page.
              </p>
            </section>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
