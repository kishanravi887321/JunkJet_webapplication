import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    // Mock AI response - in real app, integrate with actual AI service
    const responses = [
      "Great question! For plastic waste, make sure to clean containers before listing them. This increases their value and makes them more attractive to buyers.",
      "I'd recommend sorting your waste by material type (plastic, metal, electronics) before listing. This helps middle buyers process them more efficiently.",
      "Did you know that recycling one aluminum can saves enough energy to power a TV for 3 hours? Every contribution makes a difference!",
      "For electronics, make sure to remove any personal data before listing. Our Phase 2 partners can help with proper data destruction if needed.",
      "The best time to list waste items is early in the week when middle buyers are planning their collection routes.",
      "Consider joining our community challenges! This month we're focusing on reducing plastic waste in households.",
    ]

    // Simple response selection based on message content
    let response = responses[Math.floor(Math.random() * responses.length)]

    if (message.toLowerCase().includes("plastic")) {
      response =
        "For plastic waste, clean containers thoroughly and separate by type (PET, HDPE, etc.). This significantly increases their recycling value!"
    } else if (message.toLowerCase().includes("metal")) {
      response =
        "Metal waste is highly valuable! Separate aluminum, steel, and copper. Remove any non-metal attachments for better pricing."
    } else if (message.toLowerCase().includes("electronic")) {
      response =
        "Electronics require special handling. Ensure data is wiped and batteries are removed. Our certified Phase 2 partners handle e-waste safely."
    } else if (message.toLowerCase().includes("phase")) {
      response =
        "Our three-phase system connects households (Phase 1) → middle buyers (Phase 2) → organizations (Phase 3). Which phase would you like to know more about?"
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chatbot API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
