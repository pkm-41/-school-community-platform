import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Assigns a stable anonymous device id so each visitor can see "my posts"
// and their own chat history without needing to log in.
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (!request.cookies.get("anon_id")) {
    const id = crypto.randomUUID()
    response.cookies.set("anon_id", id, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
