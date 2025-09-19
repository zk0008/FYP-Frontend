import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  "/",
  // "/auth/confirm",
  // "/auth/confirmed",
  "/signin",
  "/signup",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) {
    // If the path is public, allow it to proceed without checking for authentication
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set(name, value, options);
        }
      }
    }
  )

  const {
    data: { user } 
  } = await supabase.auth.getUser();

  if (!user && !isPublic) {
    // If the user is not authenticated and the path is not public, redirect to homepage
    const homeURL = new URL("/", request.url);
    return NextResponse.redirect(homeURL);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|\\.well-known|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
