import { useEffect, useRef } from "react";
import { MessageCircle, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import TopicSuggestions from "@/components/chat/TopicSuggestions";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showSuggestions = messages.length === 0;

  return (
    <div className="dark min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-glow">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Chatify</h1>
              <p className="text-xs text-muted-foreground">Your AI companion for everything</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                New chat
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
            {showSuggestions ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-8 px-4">
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center animate-pulse-soft">
                    <MessageCircle className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">
                      Hey there! I'm <span className="text-gradient">Chatify</span> 👋
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-base">
                      Your friendly AI assistant ready to help with studies, gaming, tech, entertainment, and so much more. What's on your mind?
                    </p>
                  </div>
                </div>
                
                <TopicSuggestions onSelect={sendMessage} />

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Powered by advanced AI • Fast & accurate responses</span>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage key={index} role={message.role} content={message.content} />
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <TypingIndicator />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background/50 backdrop-blur-sm p-4">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
            <p className="text-xs text-muted-foreground text-center mt-3">
              Chatify can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>© 2024 Chatify. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
