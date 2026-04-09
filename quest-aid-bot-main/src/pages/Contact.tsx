import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have a question? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">support@studybuddy.com</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Available 24/7</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold mb-2">Help Center</h3>
              <p className="text-sm text-muted-foreground">Browse FAQs</p>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full gradient-primary text-white">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
