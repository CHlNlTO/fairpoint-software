import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the response from supabase middleware
  const response = await updateSession(request);

  // Add pathname header for layout to access
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
