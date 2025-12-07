import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-chat-assistant px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
