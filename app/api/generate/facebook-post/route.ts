import { generateText, Output } from "ai"
import { z } from "zod"

const postTypePrompts: Record<string, string> = {
  engagement: `Create an engaging Facebook post that encourages comments and discussion. Use questions, polls, or controversial takes that make people want to share their opinions.`,
  promotional: `Create a promotional Facebook post that sells without being pushy. Focus on benefits, social proof, and urgency while maintaining authenticity.`,
  educational: `Create an educational Facebook post that provides immediate value. Share tips, insights, or how-tos that people will want to save and share.`,
  storytelling: `Create a storytelling Facebook post that connects emotionally. Use personal anecdotes, case studies, or transformation stories that inspire.`,
}

export async function POST(req: Request) {
  try {
    const { prompt, postType = "engagement" } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const typeInstruction = postTypePrompts[postType] || postTypePrompts.engagement

    const result = await generateText({
      model: "openai/gpt-4o",
      system: `You are a social media expert for "Jay's AI Playbook" - a brand focused on AI, automation, and content creation. 
      
Your Facebook posts:
- Are written in a conversational, relatable tone
- Use short paragraphs and line breaks for readability
- Include hooks that stop the scroll
- Have clear calls-to-action
- Feel authentic, not corporate
- May include relevant emojis (but not overused)
- Are optimized for engagement and shares`,
      prompt: `${typeInstruction}

Topic/Content to write about:
${prompt}

Create the Facebook post following best practices for organic reach and engagement. The post should feel natural and personal, not like an ad.`,
      output: Output.object({
        schema: z.object({
          content: z.string().describe("The main Facebook post content"),
          variations: z.array(z.string()).describe("2-3 alternative versions of the post with different angles or hooks"),
        }),
      }),
    })

    return Response.json({
      content: result.output?.content || "",
      variations: result.output?.variations || [],
    })
  } catch (error) {
    console.error("Facebook post generation error:", error)
    return Response.json(
      { error: "Failed to generate Facebook post" },
      { status: 500 }
    )
  }
}
