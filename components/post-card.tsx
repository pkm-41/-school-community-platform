"use client"

import { Heart, MessageSquare, Eye } from "lucide-react"
import type { Post } from "@/lib/posts"
import { cn } from "@/lib/utils"

const tagStyles: Record<Post["tag"], string> = {
  공지: "bg-amber-100 text-amber-800",
  자유: "bg-blue-100 text-blue-800",
  공부: "bg-green-100 text-green-800",
  분실물: "bg-purple-100 text-purple-800",
  비밀: "bg-slate-200 text-slate-700",
}

export function PostCard({
  post,
  liked,
  onToggleLike,
}: {
  post: Post
  liked: boolean
  onToggleLike: (id: number) => void
}) {
  return (
    <article
      className={cn(
        "rounded-xl border p-4 transition-colors",
        post.notice
          ? "border-amber-200 bg-amber-50"
          : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
      )}
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", tagStyles[post.tag])}>{post.tag}</span>
        {post.anonymous && <span className="text-[11px] text-muted-foreground">익명</span>}
        {post.op && <span className="text-[11px] text-muted-foreground">운영자 ✉</span>}
        {post.hot && (
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">🔥 인기</span>
        )}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground text-pretty">{post.title}</h3>
      <p className="mb-2.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">{post.preview}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleLike(post.id)}
          className={cn(
            "flex items-center gap-1 text-xs transition-colors",
            liked ? "font-semibold text-red-500" : "text-muted-foreground hover:text-red-500",
          )}
          aria-pressed={liked}
          aria-label="좋아요"
        >
          <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          {post.comments}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          {post.views}
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">{post.time}</span>
      </div>
    </article>
  )
}
