'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { trackPilotSignup } from '@/lib/analytics';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { EmailInput } from '@/components/ui/EmailInput';
import { pa } from '@/lib/style-utils';
import type { MobileProps } from '@/components/home/types';

export function PilotSignup({ isMobile }: MobileProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { pilot } = C.app;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    console.info('[pilot-signup]', { email: email.trim() });
    trackPilotSignup();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="mt-9">
      <p
        className="mb-5 max-w-[480px] font-sans font-normal leading-[1.7] text-muted-fg"
        style={{ fontSize: 'clamp(15px,1.4vw,17px)' }}
      >
        {pilot.text}
      </p>

      <PrimaryButton
        onClick={() => setOpen((v) => { if (v) setSubmitted(false); return !v; })}
        className="px-7 text-[15px]"
        style={{ padding: '12px 28px' }}
      >
        {pilot.cta}
      </PrimaryButton>

      {open && (
        <div
          className="mt-5 animate-fadeUp rounded-xl"
          style={{
            padding: isMobile ? 16 : 20,
            border: `1px solid ${pa(13)}`,
            background: pa(2),
          }}
        >
          {submitted ? (
            <p className="font-sans text-[15px] font-medium leading-[1.6] text-primary">
              {pilot.success}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={pilot.placeholder}
                required
                className="w-full"
              />
              <button
                type="submit"
                className="self-start min-h-[48px] cursor-pointer rounded-full border-none bg-primary px-6 font-sans text-sm font-semibold text-white"
              >
                {pilot.submit}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
