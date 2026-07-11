import { bigint, bigserial, boolean, integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core"

export const posts = pgTable("posts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  board: text("board").notNull(),
  tag: text("tag").notNull(),
  title: text("title").notNull(),
  preview: text("preview").notNull(),
  anonymous: boolean("anonymous").notNull().default(true),
  notice: boolean("notice").notNull().default(false),
  op: boolean("op").notNull().default(false),
  authorId: text("author_id").notNull(),
  comments: integer("comments").notNull().default(0),
  views: integer("views").notNull().default(0),
  baseLikes: integer("base_likes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const postLikes = pgTable(
  "post_likes",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    postId: bigint("post_id", { mode: "number" }).notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqLike: unique().on(t.postId, t.userId),
  }),
)

export const chatMessages = pgTable("chat_messages", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
