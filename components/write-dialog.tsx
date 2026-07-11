"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { boards, type BoardId, type Post } from "@/lib/posts"

const writableBoards = boards.filter((b) => b.id !== "all")

const boardTag: Record<Exclude<BoardId, "all">, Post["tag"]> = {
  free: "자유",
  study: "공부",
  lost: "분실물",
  secret: "비밀",
}

export function WriteDialog({
  open,
  defaultBoard,
  onClose,
  onSubmit,
}: {
  open: boolean
  defaultBoard: Exclude<BoardId, "all">
  onClose: () => void
  onSubmit: (post: Pick<Post, "board" | "tag" | "title" | "preview" | "anonymous">) => void
}) {
  const [board, setBoard] = useState<Exclude<BoardId, "all">>(defaultBoard)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [anonymous, setAnonymous] = useState(true)

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    onSubmit({ board, tag: boardTag[board], title: title.trim(), preview: body.trim(), anonymous })
    setTitle("")
    setBody("")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">새 글 쓰기</h2>
          <button onClick={onClose} aria-label="닫기" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {writableBoards.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBoard(b.id as Exclude<BoardId, "all">)}
                className={
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors " +
                  (board === b.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-secondary")
                }
              >
                {b.label}
              </button>
            ))}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:bg-card"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={4}
            className="resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-primary focus:bg-card"
          />

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--primary)]"
            />
            익명으로 작성하기
          </label>

          <button
            type="submit"
            disabled={!title.trim() || !body.trim()}
            className="rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            게시하기
          </button>
        </form>
      </div>
    </div>
  )
}
