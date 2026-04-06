import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/", "/login", "/register"]

function isPublic(pathname: string) {
  return PUBLIC_PATHS.includes(pathname)
}

export default function proxy(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value
  const pathname = req.nextUrl.pathname
  const isAuthenticated = !!token

  if (pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  // away from protected routes
  if (!isAuthenticated && !isPublic(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    return NextResponse.redirect(url)
  }

  //  away from public routes
  if (isAuthenticated && isPublic(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/home"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
}
