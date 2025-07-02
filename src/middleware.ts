import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_NAME, USER_DETAILS } from "./utils/constants";
import { User } from "./interfaces/auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";

// Specify protected and public routes
const adminRoutes = ["/admin"];
const publicRoutes = ["/shop", "/product", "/blog", "/"];
const privateRoutes = [
  "/account/profile",
  "/account/orders",
  "/orders/success",
];
const authRoutes = [
  "/account/login",
  "/account/register",
  "/account/reset-password",
  "/account/forgot-password",
];

const checkoutRoutes = ["/checkout"];

// Utility function to check user roles
const isAdminUser = (user: User | null): boolean => {
  return user?.isSuperAdmin || user?.isAdmin || false;
};

export default async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  // const isProtectedRoute = protectedRoutes.includes(path);
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  // const isPublicRoute = publicRoutes.includes(path);
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
  const ischeckoutRoute = checkoutRoutes.some((route) =>
    path.startsWith(route)
  );

  const token = cookieStore.get(TOKEN_NAME)?.value;
  const userCookie = cookieStore.get(USER_DETAILS)?.value;

  // Parse user details if available
  let user: User | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie) as User;
    } catch (error) {
      console.error("Failed to parse user details:", error);
    }
  }

  if (isAdminRoute) {
    if (token) {
      // User is authenticated, check if they are an admin
      if (!isAdminUser(user)) {
        // User is not an admin, restrict access
        return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
      }
    } else {
      // User is not authenticated, redirect to login with redirectUrl
      const redirectUrl = encodeURIComponent(path);
      return NextResponse.redirect(
        new URL(`/account/login?redirectUrl=${redirectUrl}`, req.nextUrl)
      );
    }
  }

  // Redirect to login if the user is not authenticated and trying to access protected routes
  if (isPrivateRoute && !token) {
    const redirectUrl = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`/account/login?redirectUrl=${redirectUrl}`, req.nextUrl)
    );
  }

  if (ischeckoutRoute && !token) {
    const redirectUrl = encodeURIComponent(path);
    return NextResponse.redirect(
      new URL(`/account/login?redirectUrl=${redirectUrl}`, req.nextUrl)
    );
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Allow access to public routes
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
