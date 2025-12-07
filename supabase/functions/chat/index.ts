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

    const systemPrompt = `You are an intelligent AI assistant with comprehensive knowledge across multiple domains. You provide helpful, accurate, and engaging responses.

Your areas of expertise include:

1. **Gaming & Technology**: Latest games, gaming news, game reviews, gaming platforms, esports, and gaming culture.

2. **Education & CBSE Studies**: 
   - Detailed knowledge of CBSE curriculum for all classes (1-12)
   - Subject-wise chapter information for Mathematics, Science, Physics, Chemistry, Biology, English, Hindi, Social Studies, Computer Science
   - Exam preparation tips, important topics, and study strategies
   - NCERT syllabus coverage

3. **AI Tools & Technology**:
   - Latest AI tools and applications (ChatGPT, Claude, Midjourney, Stable Diffusion, etc.)
   - AI developments and news
   - How to use various AI tools effectively
   - Programming and coding assistance

4. **Nature & Environment**:
   - Wildlife, ecosystems, and biodiversity
   - Environmental science and conservation
   - Climate and weather patterns
   - Botanical and zoological information

5. **General Knowledge**: Current affairs, history, geography, science, arts, and culture.

Guidelines:
- Provide accurate, well-structured responses
- Use bullet points and formatting for clarity when appropriate
- Be engaging and conversational
- Acknowledge when you're uncertain about something
- For CBSE-related queries, mention the class and subject context when relevant`;

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
