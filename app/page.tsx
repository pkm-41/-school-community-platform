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
import { boards, initialPosts, type BoardId, type Post } from "@/lib/posts"
import { cn } from "@/lib/utils"

const pageIcons: Record<BoardId, LucideIcon> = {
  all: LayoutList,
  free: MessageCircle,
  study: BookOpen,
  lost: Search,
  secret: Lock,
}

type SortTab = "hot" | "new" | "mine"

export default function Page() {
  const [activeBoard, setActiveBoard] = useState<BoardId>("all")
  const [tab, setTab] = useState<SortTab>("hot")
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [likes, setLikes] = useState<Record<number, boolean>>({})
  const [myPostIds, setMyPostIds] = useState<number[]>([])
  const [writeOpen, setWriteOpen] = useState(false)

  const current = boards.find((b) => b.id === activeBoard)!
  const PageIcon = pageIcons[activeBoard]

  const visiblePosts = useMemo(() => {
    let list = activeBoard === "all" ? posts : posts.filter((p) => p.board === activeBoard)
    if (tab === "mine") list = list.filter((p) => myPostIds.includes(p.id))
    const sorted = [...list]
    if (tab === "hot") sorted.sort((a, b) => Number(b.notice) - Number(a.notice) || b.likes - a.likes)
    else sorted.sort((a, b) => Number(b.notice) - Number(a.notice) || b.createdAt - a.createdAt)
    return sorted
  }, [posts, activeBoard, tab, myPostIds])

  function toggleLike(id: number) {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function addPost(data: Pick<Post, "board" | "tag" | "title" | "preview" | "anonymous">) {
    const id = Date.now()
    const post: Post = {
      id,
      ...data,
      likes: 0,
      comments: 0,
      views: 1,
      time: "방금 전",
      createdAt: id,
    }
    setPosts((prev) => [post, ...prev])
    setMyPostIds((prev) => [id, ...prev])
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
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-sm font-medium text-foreground">아직 글이 없어요</p>
              <p className="text-xs text-muted-foreground">첫 번째 글을 작성해 보세요!</p>
            </div>
          ) : (
            visiblePosts.map((p) => (
              <PostCard key={p.id} post={p} liked={!!likes[p.id]} onToggleLike={toggleLike} />
            ))
          )}
        </div>
      </main>

      <ChatPanel />

      <WriteDialog
        open={writeOpen}
        defaultBoard={defaultBoard}
        onClose={() => setWriteOpen(false)}
        onSubmit={addPost}
      />
    </div>
  )
}
