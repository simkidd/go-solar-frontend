import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_NAME, USER_DETAILS } from "./utils/constants";
import { User } from "./interfaces/auth.interface";

// Specify protected and public routes
const adminRoutes = ["/admin"];
const publicRoutes = ["/shop", "/product", "/blog", "/"];
const privateRoutes = ["/profile"];
const authRoutes = ["/account"];

export default async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  // const isProtectedRoute = protectedRoutes.includes(path);
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  // const isPublicRoute = publicRoutes.includes(path);
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const cookie = cookies().get(TOKEN_NAME)?.value;
  const userCookie = cookies().get(USER_DETAILS)?.value;

  if (userCookie) {
    const user: User = JSON.parse(userCookie);

    // restrict users from admin routes
    if (isAdminRoute && !user?.isSuperAdmin && !user.isAdmin) {
      return NextResponse.redirect(new URL("/account/login", req.nextUrl));
    }
  }

  // Redirect to /login if the user is not authenticated
  if (isAdminRoute && !cookie) {
    return NextResponse.redirect(new URL("/account/login", req.nextUrl));
  }

  if (isPrivateRoute && !cookie) {
    return NextResponse.redirect(new URL("/account/login", req.nextUrl));
  }

  // Redirect to homepage if the user is authenticated and trying to access auth routes
  if (isAuthRoute && cookie) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
