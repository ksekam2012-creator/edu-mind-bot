import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="dark min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Chatify</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

          <section className="space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Chatify ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>
                Chatify is an AI-powered chatbot service that provides information and assistance across various topics including education, gaming, technology, entertainment, health, and general knowledge. The service is provided "as is" and is intended for informational and educational purposes only.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You agree to use the Service only for lawful purposes</li>
                <li>You will not use the Service to generate harmful, abusive, or inappropriate content</li>
                <li>You understand that AI responses may not always be accurate and should verify important information</li>
                <li>You will not attempt to reverse engineer, hack, or compromise the Service</li>
                <li>You are responsible for maintaining the confidentiality of any personal information you share</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Intellectual Property</h2>
              <p>
                The Service, including its original content, features, and functionality, is owned by Chatify and is protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the Service. AI-generated content may contain errors and should not be relied upon as the sole source of information for critical decisions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
              <p>
                In no event shall Chatify be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Age Requirements</h2>
              <p>
                The Service is intended for users who are at least 13 years of age. By using this Service, you represent that you are at least 13 years old or have parental consent to use the Service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through the main application.
              </p>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>© 2024 Chatify. All rights reserved.</span>
          <span>•</span>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
