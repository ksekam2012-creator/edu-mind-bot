import { 
  GraduationCap, 
  Gamepad2, 
  Cpu, 
  Leaf, 
  Film, 
  Heart, 
  Globe, 
  Music,
  Code,
  Rocket,
  BookOpen,
  Lightbulb
} from "lucide-react";

interface TopicSuggestionsProps {
  onSelect: (topic: string) => void;
}

const topics = [
  {
    icon: GraduationCap,
    label: "Studies",
    prompt: "Can you help me understand quadratic equations with examples?",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Gamepad2,
    label: "Gaming",
    prompt: "What are the most popular games right now and why?",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Cpu,
    label: "AI & Tech",
    prompt: "What are the best AI tools for students and professionals?",
    color: "from-cyan-500 to-teal-600",
  },
  {
    icon: Leaf,
    label: "Nature",
    prompt: "Tell me fascinating facts about the Amazon rainforest",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Film,
    label: "Entertainment",
    prompt: "Recommend some must-watch movies from this year",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Heart,
    label: "Health",
    prompt: "What are some effective exercises for beginners?",
    color: "from-red-500 to-orange-600",
  },
  {
    icon: Code,
    label: "Coding",
    prompt: "How do I start learning programming as a beginner?",
    color: "from-amber-500 to-yellow-600",
  },
  {
    icon: Globe,
    label: "World",
    prompt: "What are some interesting facts about different cultures?",
    color: "from-sky-500 to-blue-600",
  },
];

const quickPrompts = [
  { icon: Lightbulb, text: "Explain something complex simply" },
  { icon: BookOpen, text: "Help me study for my exam" },
  { icon: Rocket, text: "What's trending in tech?" },
  { icon: Music, text: "Recommend music based on my mood" },
];

const TopicSuggestions = ({ onSelect }: TopicSuggestionsProps) => {
  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* Main Topics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topics.map((topic) => (
          <button
            key={topic.label}
            onClick={() => onSelect(topic.prompt)}
            className="group relative overflow-hidden rounded-xl p-3 sm:p-4 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-soft bg-card border border-border"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="relative flex flex-col items-center gap-2 text-center">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${topic.color} text-white shadow-sm`}>
                <topic.icon className="w-5 h-5" />
              </div>
              <p className="font-medium text-sm text-foreground">{topic.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap justify-center gap-2">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-all duration-200 border border-transparent hover:border-border"
          >
            <prompt.icon className="w-4 h-4" />
            {prompt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSuggestions;
