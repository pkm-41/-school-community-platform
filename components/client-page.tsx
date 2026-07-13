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
import { boards, type BoardId } from "@/lib/posts"
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
