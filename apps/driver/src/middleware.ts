import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const url = new URL(req.url);
  const protectedPrefixes = ['/onboarding', '/jobs', '/profile', '/booking', '/pending-review', '/home', '/history', '/wallet'];
  const isProtected = protectedPrefixes.some((p) => url.pathname.startsWith(p));
  const hasAuth = req.headers.get('cookie')?.includes('driver_auth=1');
  if (isProtected && !hasAuth) { url.pathname = '/login'; return NextResponse.redirect(url); }
  return NextResponse.next();
}
export {};
