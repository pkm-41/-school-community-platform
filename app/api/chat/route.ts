import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const maxDuration = 30

// 사용자가 AI_GATEWAY_API_KEY 환경 변수에 Google Gemini API 키를 저장했습니다.
const google = createGoogleGenerativeAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

const SYSTEM_PROMPT = `당신은 한국 고등학교 학생들을 위한 친근한 AI 학교 도우미 "스쿨타임 도우미"입니다.
학교생활, 공부, 숙제, 진로, 시험 준비, 고민 상담 등 무엇이든 도와주세요.
존댓말을 쓰되 친근하고 따뜻하게 대화해 주세요. 답변은 간결하고 실용적으로, 핵심 위주로 해주세요.
학생을 격려하고 응원하는 태도를 유지하세요.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: google("gemini-flash-latest"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
