import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  // Simple markdown-like formatting for bold and lists
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Handle bold text
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
      
      // Handle bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        formattedLine = `<span class="flex gap-2"><span>•</span><span>${formattedLine.replace(/^[-•]\s*/, '')}</span></span>`;
      }
      
      // Handle numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s/);
      if (numberedMatch) {
        formattedLine = `<span class="flex gap-2"><span class="text-primary font-medium">${numberedMatch[1]}.</span><span>${formattedLine.replace(/^\d+\.\s*/, '')}</span></span>`;
      }

      return (
        <span 
          key={i} 
          className="block"
          dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-gradient-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 rounded-2xl",
          isUser
            ? "bg-chat-user text-primary-foreground rounded-br-md"
            : "bg-chat-assistant text-foreground rounded-bl-md"
        )}
      >
        <div className="text-sm leading-relaxed space-y-1">
          {formatContent(content)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
