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
import { type PostDTO, createPost } from "@/app/actions/posts"
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
  const [writeOpen, setWriteOpen] =
