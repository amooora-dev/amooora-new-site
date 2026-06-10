export const ADMIN_SESSION_COOKIE = 'amooora_admin_session';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 dias

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret === 'gerar-um-secret-aleatorio') {
    throw new Error(
      'ADMIN_SESSION_SECRET não configurado. Gere com: openssl rand -base64 32'
    );
  }
  return secret;
}

async function importHmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function createSessionToken(email: string): Promise<string> {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_MAX_AGE_SEC * 1000,
  };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await importHmacKey(getSessionSecret());
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret || secret === 'gerar-um-secret-aleatorio') return null;

    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return null;

    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(sigB64) as BufferSource,
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as SessionPayload;
    if (!payload.email || !payload.exp || payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
