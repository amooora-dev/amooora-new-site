'use server';

import { redirect } from 'next/navigation';
import { clearAdminSession, setAdminSession, validateAdminCredentials } from '@/lib/admin/auth';

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Preencha email e senha.' };
  }

  if (!validateAdminCredentials(email, password)) {
    return { error: 'Email ou senha incorretos.' };
  }

  try {
    await setAdminSession(email);
  } catch {
    return {
      error:
        'ADMIN_SESSION_SECRET não configurado. Gere um secret com: openssl rand -base64 32',
    };
  }

  redirect('/admin/dashboard');
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}
