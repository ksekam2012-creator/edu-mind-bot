import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageCircle, Trash2, Zap, Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import TopicSuggestions from "@/components/chat/TopicSuggestions";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    fetchMessages,
    createConversation,
    saveMessage,
    updateConversationTitle,
    deleteConversation,
  } = useConversations(user?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (currentConversationId) {
        const msgs = await fetchMessages(currentConversationId);
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    };
    loadMessages();
  }, [currentConversationId, fetchMessages]);

  const sendMessage = useCallback(async (input: string) => {
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let conversationId = currentConversationId;
    
    // Create new conversation if needed (only for logged in users)
    if (!conversationId && user) {
      // Use first few words as title
      const title = input.slice(0, 50) + (input.length > 50 ? "..." : "");
      conversationId = await createConversation(title);
    }

    // Save user message
    if (conversationId && user) {
      await saveMessage(conversationId, userMessage);
    }

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch { /* ignore */ }
        }
      }

      // Save assistant message
      if (conversationId && user && assistantContent) {
        await saveMessage(conversationId, { role: "assistant", content: assistantContent });
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      setMessages((prev) => {
        if (prev[prev.length - 1]?.role === "assistant" && prev[prev.length - 1]?.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentConversationId, user, createConversation, saveMessage, toast]);

  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
    setSidebarOpen(false);
  }, [setCurrentConversationId]);

  const handleSelectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
  }, [setCurrentConversationId]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setMessages([]);
    setCurrentConversationId(null);
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  }, [signOut, setCurrentConversationId, toast]);

  const showSuggestions = messages.length === 0;

  const sidebarContent = user ? (
    <ChatSidebar
      conversations={conversations}
      currentConversationId={currentConversationId}
      onSelectConversation={handleSelectConversation}
      onNewChat={handleNewChat}
      onDeleteConversation={deleteConversation}
      onSignOut={handleSignOut}
      username={user.user_metadata?.username || user.email?.split("@")[0]}
    />
  ) : null;

  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {user && (
        <div className="hidden md:block">
          {sidebarContent}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              {user && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-64">
                    {sidebarContent}
                  </SheetContent>
                </Sheet>
              )}
              
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
                  onClick={handleNewChat}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  New chat
                </Button>
              )}
              {!user && !authLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in
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
                      {!user && !authLoading && (
                        <p className="text-sm text-primary">
                          <button onClick={() => navigate("/auth")} className="underline hover:no-underline">
                            Sign in
                          </button>
                          {" "}to save your chat history!
                        </p>
                      )}
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
    </div>
  );
};

export default Index;
