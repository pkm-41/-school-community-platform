"use client"

import {
  LayoutList,
  MessageCircle,
  BookOpen,
  Search,
  Lock,
  Mail,
  Users,
  Calendar,
  UtensilsCrossed,
  Bell,
  User,
  GraduationCap,
  Flame,
  type LucideIcon,
} from "lucide-react"
import { boards, lifeMenu, type BoardId } from "@/lib/posts"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  LayoutList,
  MessageCircle,
  BookOpen,
  Search,
  Lock,
  Mail,
  Users,
  Calendar,
  UtensilsCrossed,
  Bell,
  User,
}

export function Sidebar({
  activeBoard,
  onSelectBoard,
}: {
  activeBoard: BoardId
  onSelectBoard: (id: BoardId) => void
}) {
  return (
    <aside className="flex w-56 min-w-56 flex-col overflow-y-auto border-r border-border bg-card max-md:hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold text-foreground">스쿨타임</span>
        <span className="rounded-full border border-primary/20 bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          한국고 · 3학년 인증
        </span>
      </div>

      <nav className="py-2.5">
        <p className="px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          게시판
        </p>
        {boards.map((b) => {
          const Icon = iconMap[b.icon]
          const active = activeBoard === b.id
          return (
            <button
              key={b.id}
              onClick={() => onSelectBoard(b.id)}
              className={cn(
                "relative flex w-full items-center gap-2 px-4 py-1.5 text-[13px] transition-colors",
                active
                  ? "bg-accent font-semibold text-accent-foreground after:absolute after:right-0 after:top-0 after:bottom-0 after:w-0.5 after:rounded-l after:bg-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {b.label}
            </button>
          )
        })}
      </nav>

      <nav className="py-2.5">
        <p className="px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          학교생활
        </p>
        {lifeMenu.map((m) => {
          const Icon = iconMap[m.icon]
          return (
            <button
              key={m.label}
              className="flex w-full items-center gap-2 px-4 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {m.label}
              {m.badge ? (
                <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {m.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-border px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            익명
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">익명의 고등학생</p>
            <p className="text-[11px] text-muted-foreground">3학년 · 학번 인증됨</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-orange-500">
              <Flame className="h-3 w-3" />
              128 포인트
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
