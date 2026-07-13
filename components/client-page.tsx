"use client"

import { useMemo, useState } from "react"
import {
  LayoutList,
  MessageCircle,
  BookOpen,
  Search,
  Lock,
  Edit3,
  type LucideIcon,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { PostCard } from "@/components/post-card"
import { ChatPanel } from "@/components/chat-panel"
import { WriteDialog } from "@/components/write-dialog"
import { boards, type BoardId, type Post } from "@/lib/posts"
import { type PostDTO, createPost, toggleLike } from "@/app/actions/posts"
import { cn } from "@/lib/utils"

const pageIcons: Record<BoardId, LucideIcon> = {
  all: LayoutList,
  free: MessageCircle,
  study: BookOpen,
  lost: Search,
  secret: Lock,
}

type SortTab = "hot" | "new" | "mine"

function timeAgo(createdAt: number): string {
  const diffMs = Date.now() - createdAt
  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

function toPost(dto: PostDTO): Post {
  return {
    id: dto.id,
    board: dto.board,
    tag: dto.tag,
    anonymous: dto.anonymous,
    notice: dto.notice,
    hot: dto.hot,
    op: dto.op,
    title: dto.title,
    preview: dto.preview,
    likes: dto.likes - (dto.liked ? 1 : 0),
    comments: dto.comments,
    views: dto.views,
    time: timeAgo(dto.createdAt),
    createdAt: dto.createdAt,
  }
}

export function ClientPage({ initialPosts }: { initialPosts: PostDTO[] }) {
  const [activeBoard, setActiveBoard] = useState<BoardId>("all")
  const [tab, setTab] = useState<SortTab>("hot")
  const [posts, setPosts] = useState<PostDTO[]>(initialPosts)
  const [writeOpen, setWriteOpen] = useState(false)

  const current = boards.find((b) => b.id === activeBoard)!
  const PageIcon = pageIcons[activeBoard]

  const visiblePosts = useMemo(() => {
    let list = activeBoard === "all" ? posts : posts.filter((p) => p.board === activeBoard)
    if (tab === "mine") list = list.filter((p) => p.mine)
    const sorted = [...list]
    if (tab === "hot") sorted.sort((a, b) => Number(b.notice) - Number(a.notice) || b.likes - a.likes)
    else sorted.sort((a, b) => Number(b.notice) - Number(a.notice) || b.createdAt - a.createdAt)
    return sorted
  }, [posts, activeBoard, tab])

  async function handleToggleLike(id: number) {
    const result = await toggleLike(id)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: result.liked, likes: result.liked ? p.likes + 1 : p.likes - 1 }
          : p
      )
    )
  }

  async function addPost(data: Pick<PostDTO, "board" | "title" | "preview" | "anonymous">) {
    await createPost(data)
    const { getPosts } = await import("@/app/actions/posts")
    const fresh = await getPosts()
    setPosts(fresh)
    setActiveBoard(data.board)
    setTab("new")
    setWriteOpen(false)
  }

  const tabs: { id: SortTab; label: string }[] = [
    { id: "hot", label: "인기글" },
    { id: "new", label: "최신글" },
    { id: "mine", label: "내가 쓴 글" },
  ]

  const defaultBoard: Exclude<BoardId, "all"> = activeBoard === "all" ? "free" : activeBoard

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar activeBoard={activeBoard} onSelectBoard={setActiveBoard} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
          <h1 className="flex items-center gap-2 text-base font-bold text-foreground">
            <PageIcon className="h-[18px] w-[18px] text-primary" />
            {current.label}
          </h1>
          <button
            onClick={() => setWriteOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Edit3 className="h-4 w-4" />
            글쓰기
          </button>
        </header>

        <div className="flex border-b border-border bg-card px-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "border-b-2 px-4 py-2.5 text-[13px] transition-colors",
                tab === t.id
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-3.5">
          {visiblePosts.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">아직 글이 없어요.</p>
          ) : (
            visiblePosts.map((dto) => (
              <PostCard key={dto.id} post={toPost(dto)} liked={dto.liked} onToggleLike={handleToggleLike} />
            ))
          )}
        </div>
      </main>

      <ChatPanel />

      <WriteDialog open={writeOpen} defaultBoard={defaultBoard} onClose={() => setWriteOpen(false)} onSubmit={addPost} />
    </div>
  )
}
