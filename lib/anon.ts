import { cookies } from "next/headers"

// Reads the anonymous device id assigned by middleware.
// Falls back to "anon" if the cookie hasn't been set yet.
export async function getAnonId(): Promise<string> {
  const store = await cookies()
  return store.get("anon_id")?.value ?? "anon"
}
