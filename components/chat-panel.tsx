"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

const quickAsks = [
  { label: "📅 공부계획", text: "기말고사 공부 계획 짜줘" },
  { label: "📐 수학질문", text: "수학 미적분 극한 쉽게 설명해줘" },
  { label: "✏️ 영어", text: "영어 에세이 잘 쓰는 법 알려줘" },
  { label: "💬 고민상담", text: "오늘 스트레스 받았어. 얘기 들어줄래?" },
]

function messageText(message: { parts?: Array<{ type: string; text?: string }> }) {
  return (
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""
  )
}

export function ChatPanel() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const busy = status === "streaming" || status === "submitted"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  return (
    <aside className="flex w-80 min-w-80 flex-col border-l border-border bg-card max-lg:hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
        <span className="text-[13px] font-bold text-foreground">AI 학교 도우미</span>
        <span className="ml-auto text-[11px] text-green-600">{busy ? "입력 중..." : "온라인"}</span>
      </div>

      <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        <div className="max-w-[87%] self-start">
          <p className="mb-1 text-[10px] text-muted-foreground">AI 도우미</p>
          <div className="rounded-[3px_10px_10px_10px] border border-border bg-secondary px-3 py-2 text-xs leading-relaxed text-foreground">
            안녕하세요! 👋 학교생활 관련 질문, 숙제 도움, 공부 질문 뭐든지 물어보세요!
          </div>
        </div>

        {messages.map((m) => {
          const text = messageText(m)
          if (!text) return null
          const isUser = m.role === "user"
          return (
            <div key={m.id} className={cn("max-w-[87%]", isUser ? "self-end" : "self-start")}>
              {!isUser && <p className="mb-1 text-[10px] text-muted-foreground">AI 도우미</p>}
              <div
                className={cn(
                  "px-3 py-2 text-xs leading-relaxed",
                  isUser
                    ? "rounded-[10px_3px_10px_10px] bg-primary text-primary-foreground"
                    : "whitespace-pre-wrap rounded-[3px_10px_10px_10px] border border-border bg-secondary text-foreground",
                )}
              >
                {text}
              </div>
            </div>
          )
        })}

        {status === "submitted" && (
          <div className="max-w-[87%] self-start">
            <p className="mb-1 text-[10px] text-muted-foreground">AI 도우미</p>
            <div className="flex items-center gap-1 rounded-[3px_10px_10px_10px] border border-border bg-secondary px-3 py-2.5">
              <Dot delay="0s" />
              <Dot delay="0.2s" />
              <Dot delay="0.4s" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 border-t border-border px-3 py-2">
        {quickAsks.map((q) => (
          <button
            key={q.label}
            onClick={() => submit(q.text)}
            disabled={busy}
            className="whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            {q.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="flex items-end gap-1.5 border-t border-border px-3 py-2.5"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit(input)
            }
          }}
          rows={1}
          placeholder="질문을 입력하세요..."
          className="max-h-24 min-h-9 flex-1 resize-none rounded-lg border border-border bg-secondary px-2.5 py-2 text-xs text-foreground outline-none focus:border-primary focus:bg-card"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="전송"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4 text-primary-foreground" />
        </button>
      </form>
    </aside>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: delay, animationDuration: "1s" }}
    />
  )
}
