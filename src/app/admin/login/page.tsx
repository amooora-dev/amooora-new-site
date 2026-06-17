'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, type LoginState } from './actions';
import { adminInputClass, adminLabelClass } from '@/components/admin/admin-ui';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-xl bg-primary px-6 py-3 font-sans text-sm font-semibold text-white shadow-sm transition hover:brightness-95 hover:shadow-md active:scale-[0.99] disabled:opacity-60"
    >
      {pending ? 'Entrando…' : 'Entrar no painel'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});

  return (
    <div className="flex min-h-screen">
      {/* Painel lateral — desktop */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-tertiary via-primary to-[#6b1f52] p-12 lg:flex">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative">
          <Image
            src="/images/logo-header.png"
            alt="Amooora"
            width={160}
            height={64}
            className="h-11 w-auto brightness-0 invert"
            priority
          />
        </div>
        <div className="relative">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-white/60">CMS Loja</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-white">
            Gerencie sua loja com clareza
          </h1>
          <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-white/75">
            Cadastre produtos, atualize fotos e acompanhe o catálogo que aparece na loja pública.
          </p>
        </div>
        <p className="relative font-sans text-xs text-white/40">© Amooora</p>
      </div>

      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center bg-[#F3F0F5] px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-header.png"
                alt="Amooora"
                width={180}
                height={72}
                className="mx-auto h-11 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="mb-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">Acesso restrito</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Painel administrativo</h2>
              <p className="mt-1 font-sans text-sm text-muted-fg">Entre com suas credenciais para continuar</p>
            </div>

            <form action={formAction} className="space-y-4">
              <div>
                <label htmlFor="email" className={adminLabelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className={adminInputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className={adminLabelClass}>
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={adminInputClass}
                />
              </div>

              {state.error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700" role="alert">
                  {state.error}
                </p>
              )}

              <SubmitButton />
            </form>

            <p className="mt-6 text-center font-sans text-xs text-muted-fg">
              <Link href="/loja" className="font-medium text-primary transition hover:underline">
                ← Voltar para a loja
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
