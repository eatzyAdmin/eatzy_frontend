import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith('/onboarding') || url.pathname.startsWith('/jobs') || url.pathname.startsWith('/profile') || url.pathname.startsWith('/booking') || url.pathname.startsWith('/pending-review');
  const hasAuth = req.headers.get('cookie')?.includes('driver_auth=1');
  if (isProtected && !hasAuth) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export {};
