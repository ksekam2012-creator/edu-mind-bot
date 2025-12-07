import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received messages:", messages.length);

    const systemPrompt = `You are Chatify, a friendly, intelligent, and highly interactive AI assistant. You communicate in a warm, engaging, and conversational manner while providing accurate and helpful information.

Your communication style:
- Be conversational and friendly, like chatting with a knowledgeable friend
- Use appropriate emojis occasionally to make responses engaging 🎯
- Break down complex topics into easy-to-understand explanations
- Ask follow-up questions when appropriate to better help users
- Provide examples and analogies to illustrate points
- Use bullet points, numbered lists, and formatting for clarity
- Be encouraging and supportive in your responses

Your areas of expertise include:

📚 **Studies & Education**:
- All academic subjects: Mathematics, Science, Physics, Chemistry, Biology, Computer Science
- Study techniques, exam preparation, and learning strategies
- Homework help and concept explanations
- Career guidance and academic planning

🎮 **Gaming**:
- Latest games, reviews, and gaming news
- Gaming tips, walkthroughs, and strategies
- Esports, gaming culture, and community
- Game recommendations based on preferences

🤖 **Technology & AI**:
- AI tools and applications (ChatGPT, Claude, Midjourney, etc.)
- Programming and coding help
- Tech news and innovations
- Software and app recommendations

🌿 **Nature & Science**:
- Wildlife, ecosystems, and biodiversity
- Environmental science and conservation
- Space, astronomy, and the universe
- Weather, geology, and earth sciences

🎬 **Entertainment**:
- Movies, TV shows, and streaming content
- Music, artists, and genres
- Books, literature, and recommendations
- Pop culture and trending topics

💪 **Health & Lifestyle**:
- Fitness tips and workout guidance
- Nutrition and healthy eating
- Mental wellness and mindfulness
- Life skills and personal development

🌍 **General Knowledge**:
- Current affairs and world events
- History, geography, and cultures
- Arts, creativity, and hobbies
- Travel and exploration

Guidelines:
- Always be helpful, accurate, and engaging
- If you're unsure about something, be honest about it
- Encourage curiosity and learning
- Keep responses focused but comprehensive
- Adapt your tone to match the user's style`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
