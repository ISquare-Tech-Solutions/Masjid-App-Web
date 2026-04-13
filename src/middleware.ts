import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that require authentication
 */
const PROTECTED_PATHS = [
    '/dashboard',
    '/prayer-management',
    '/events',
    '/campaigns',
    '/settings',
    '/profile',
];

/**
 * Routes that are only accessible when NOT authenticated
 */
const AUTH_PATHS = ['/login'];

/**
 * Middleware for route protection
 *
 * Uses the presence of the refresh token cookie (set by the backend)
 * as a heuristic for whether the user has a valid session.
 * The actual token validation happens server-side when the frontend
 * calls the refresh endpoint.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasRefreshToken = request.cookies.has('refreshToken');

    // Check if the path matches a protected route
    const isProtectedPath = PROTECTED_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    // Check if the path is an auth-only route
    const isAuthPath = AUTH_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    // Redirect unauthenticated users away from protected pages
    if (isProtectedPath && !hasRefreshToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login page
    if (isAuthPath && hasRefreshToken) {
        // If the client explicitly requested to clear the session (e.g. expired token), 
        // we can forcibly delete the cookie in the middleware response.
        if (request.nextUrl.searchParams.has('clear')) {
            const response = NextResponse.next();
            response.cookies.delete('refreshToken');
            return response;
        }
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, images, and other static assets
         */
        '/((?!_next/static|_next/image|favicon.ico|images/).*)',
    ],
};
