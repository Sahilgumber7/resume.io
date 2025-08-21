// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/',
  '/builder',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
});

export const config = {
  matcher: ['/((?!_next|.*\\..*|_static|favicon.ico).*)'],
};
