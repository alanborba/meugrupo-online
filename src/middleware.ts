import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Proteção global de taxas (Basic In-Memory Rate Limiting for edge/serverless)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 100; // Máximo de reqs/minuto no geral

// Rate limit mais restrito para API de POST/PATCH/DELETE
const API_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_API_POST_REQUESTS = 10;

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const path = request.nextUrl.pathname;

  // 1. Basic Rate Limiting
  const now = Date.now();
  let rateLimit = rateLimitMap.get(ip);
  if (!rateLimit || now - rateLimit.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimit = { count: 0, lastReset: now };
  }
  rateLimit.count++;
  rateLimitMap.set(ip, rateLimit);

  // Checks for strict API limits
  if (path.startsWith('/api/') && ['POST', 'PATCH', 'DELETE'].includes(request.method)) {
    if (rateLimit.count > MAX_API_POST_REQUESTS) {
       return new NextResponse(JSON.stringify({ error: "Rate limit excedido (Anti-DDoS ativo). Tente novamente em 1 minuto." }), {
         status: 429,
         headers: { 'Content-Type': 'application/json' }
       });
    }
  } else {
    // Check standard limit
    if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // 2. Validate Supabase Auth Session
  const { supabaseResponse, user } = await updateSession(request)

  // 3. Proteger rotas autenticadas (Hard lock)
  const protectedRoutes = ['/dashboard', '/adicionar', '/promover'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se o user já está logado, não deixa acessar login/cadastro
  if ((path.startsWith('/login') || path.startsWith('/cadastro')) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // 4. Security Headers (Helmet)
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
  supabaseResponse.headers.set('X-Frame-Options', 'DENY') // Previne iFrame Clickjacking
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff') // Previne MIME sniffing
  supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload') // Força HTTPS
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
