"use server"

import { db } from "@/lib/db"
import { postLikes, posts } from "@/lib/db/schema"
import { getAnonId } from "@/lib/anon"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type PostDTO = {
  id: number
  board: "free" | "study" | "lost" | "secret"
  tag: "공지" | "자유" | "공부" | "분실물" | "비밀"
  anonymous: boolean
  notice: boolean
  hot: boolean
  op: boolean
  mine: boolean
  liked: boolean
  title: string
  preview: string
  likes: number
  comments: number
  views: number
  createdAt: number
}

const TAG_BY_BOARD: Record<string, PostDTO["tag"]> = {
  free: "자유",
  study: "공부",
  lost: "분실물",
  secret: "비밀",
}

export async function getPosts(): Promise<PostDTO[]> {
  const anonId = await getAnonId()

  const rows = await db
    .select({
      id: posts.id,
      board: posts.board,
      tag: posts.tag,
      title: posts.title,
      preview: posts.preview,
      anonymous: posts.anonymous,
      notice: posts.notice,
      op: posts.op,
      authorId: posts.authorId,
      comments: posts.comments,
      views: posts.views,
      baseLikes: posts.baseLikes,
      createdAt: posts.createdAt,
      likeCount: sql<number>`count(${postLikes.id})`.mapWith(Number),
    })
    .from(posts)
    .leftJoin(postLikes, eq(postLikes.postId, posts.id))
    .groupBy(posts.id)
    .orderBy(desc(posts.createdAt))

  // Which of these posts the current visitor liked
  const ids = rows.map((r) => r.id)
  const likedIds = new Set<number>()
  if (ids.length > 0) {
    const mine = await db
      .select({ postId: postLikes.postId })
      .from(postLikes)
      .where(and(eq(postLikes.userId, anonId), inArray(postLikes.postId, ids)))
    for (const m of mine) likedIds.add(m.postId)
  }

  return rows.map((r) => {
    const likes = r.baseLikes + r.likeCount
    return {
      id: r.id,
      board: r.board as PostDTO["board"],
      tag: r.tag as PostDTO["tag"],
      anonymous: r.anonymous,
      notice: r.notice,
      hot: likes >= 40 && !r.notice,
      op: r.op,
      mine: r.authorId === anonId,
      liked: likedIds.has(r.id),
      title: r.title,
      preview: r.preview,
      likes,
      comments: r.comments,
      views: r.views,
      createdAt: new Date(r.createdAt).getTime(),
    }
  })
}

export async function createPost(input: {
  board: "free" | "study" | "lost" | "secret"
  title: string
  preview: string
  anonymous: boolean
}): Promise<void> {
  const anonId = await getAnonId()
  const title = input.title.trim()
  const preview = input.preview.trim()
  if (!title) throw new Error("제목을 입력해주세요.")

  await db.insert(posts).values({
    board: input.board,
    tag: TAG_BY_BOARD[input.board] ?? "자유",
    title,
    preview: preview || "(내용 없음)",
    anonymous: input.anonymous,
    notice: false,
    op: false,
    authorId: anonId,
    comments: 0,
    views: 0,
    baseLikes: 0,
  })

  revalidatePath("/")
}

export async function toggleLike(postId: number): Promise<{ liked: boolean }> {
  const anonId = await getAnonId()

  const existing = await db
    .select({ id: postLikes.id })
    .from(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, anonId)))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, anonId)))
    revalidatePath("/")
    return { liked: false }
  }

  await db.insert(postLikes).values({ postId, userId: anonId })
  revalidatePath("/")
  return { liked: true }
}
