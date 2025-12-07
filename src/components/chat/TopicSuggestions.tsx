import { Gamepad2, GraduationCap, Cpu, Leaf } from "lucide-react";

interface TopicSuggestionsProps {
  onSelect: (topic: string) => void;
}

const topics = [
  {
    icon: Gamepad2,
    label: "Gaming",
    prompt: "What are the latest popular games in 2024?",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: GraduationCap,
    label: "CBSE Studies",
    prompt: "What chapters are covered in Class 10 Science CBSE?",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Cpu,
    label: "AI Tools",
    prompt: "What are the best AI tools for productivity?",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Leaf,
    label: "Nature",
    prompt: "Tell me interesting facts about rainforests",
    color: "from-green-500 to-lime-600",
  },
];

const TopicSuggestions = ({ onSelect }: TopicSuggestionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {topics.map((topic) => (
        <button
          key={topic.label}
          onClick={() => onSelect(topic.prompt)}
          className="group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-soft bg-card border border-border"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          <div className="relative flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${topic.color} text-white`}>
              <topic.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{topic.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {topic.prompt}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TopicSuggestions;
