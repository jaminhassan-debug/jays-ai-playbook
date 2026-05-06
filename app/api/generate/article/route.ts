import { generateText, Output } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const result = await generateText({
      model: "openai/gpt-4o",
      system: `You are an expert AI content writer for "Jay's AI Playbook" - a blog focused on AI prompts, automation, content creation, and monetization strategies. 
      
Your writing style is:
- Engaging and conversational but professional
- Practical with actionable advice
- Uses clear headings and structure
- Includes specific examples and use cases
- Optimized for readability with short paragraphs

Write in markdown format with proper headings (##, ###), bullet points, and code blocks where relevant.`,
      prompt: `Write a comprehensive blog article based on this topic/description:

${prompt}

The article should include:
1. An attention-grabbing introduction
2. Well-organized sections with clear headings
3. Practical tips and actionable advice
4. Real-world examples or case studies
5. A compelling conclusion with a call to action

Format the content in clean markdown.`,
      output: Output.object({
        schema: z.object({
          title: z.string().describe("A compelling, SEO-friendly title for the article"),
          excerpt: z.string().describe("A 1-2 sentence summary for previews and meta description"),
          content: z.string().describe("The full article content in markdown format"),
        }),
      }),
    })

    return Response.json({
      title: result.output?.title || "",
      excerpt: result.output?.excerpt || "",
      content: result.output?.content || "",
    })
  } catch (error) {
    console.error("Article generation error:", error)
    return Response.json(
      { error: "Failed to generate article" },
      { status: 500 }
    )
  }
}
