import { useEffect, useRef } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">NexusAI</h1>
              <p className="text-xs text-muted-foreground">Your intelligent companion</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear chat
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
            {showSuggestions ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12">
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      Welcome to <span className="text-gradient">NexusAI</span>
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      I'm here to help with gaming, CBSE studies, AI tools, nature, and much more. What would you like to explore?
                    </p>
                  </div>
                </div>
                <TopicSuggestions onSelect={sendMessage} />
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
              NexusAI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
