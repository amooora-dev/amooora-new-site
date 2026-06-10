import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from './session';

export function validateAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase() && password === adminPassword;
}

export async function setAdminSession(email: string) {
  const token = await createSessionToken(email);
  cookies().set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
}

export async function clearAdminSession() {
  cookies().set(ADMIN_SESSION_COOKIE, '', { ...sessionCookieOptions(0), maxAge: 0 });
}

export async function getAdminSession() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}
