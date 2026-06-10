'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, type LoginState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-tertiary disabled:opacity-60"
    >
      {pending ? 'Entrando…' : 'Entrar'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo-header.png"
              alt="Amooora"
              width={180}
              height={72}
              className="mx-auto h-12 w-auto"
              priority
            />
          </Link>
          <p className="mt-4 font-sans text-sm uppercase tracking-[0.2em] text-primary">
            CMS Loja
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-ink">Painel administrativo</h1>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block font-sans text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 font-sans text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block font-sans text-sm font-medium text-ink">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 font-sans text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {state.error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700" role="alert">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center font-sans text-xs text-muted-fg">
          <Link href="/loja" className="text-primary hover:underline">
            ← Voltar para a loja
          </Link>
        </p>
      </div>
    </div>
  );
}
