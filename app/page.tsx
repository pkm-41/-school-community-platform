import { getPosts } from "@/app/actions/posts"
import { ClientPage } from "@/components/client-page"

export const dynamic = "force-dynamic"

export default async function Page() {
  const posts = await getPosts()
  return <ClientPage initialPosts={posts} />
}
