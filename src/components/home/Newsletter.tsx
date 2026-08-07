'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { trackNewsletterSignup } from '@/lib/analytics';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { EmailInput } from '@/components/ui/EmailInput';
import { SectionShell } from '@/components/ui/SectionShell';
import type { MobileProps } from '@/components/home/types';

export function Newsletter({ isMobile }: MobileProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    trackNewsletterSignup();
    setEmail('');
  };

  return (
    <section className="bg-white px-5 py-6 md:px-0 md:pb-9 md:pt-6">
      <SectionShell
        narrow
        className={`flex flex-col ${isMobile ? 'items-start text-left' : 'items-center text-center'} !px-0 md:!px-12`}
      >
        <p
          className={`mb-5 max-w-[480px] font-sans text-[clamp(15px,1.4vw,17px)] font-normal leading-[1.7] text-muted-fg md:max-w-none ${
            isMobile ? 'whitespace-normal' : 'whitespace-nowrap'
          }`}
        >
          {C.newsletter.title}
        </p>

        <form
          onSubmit={handleSubmit}
          className={`flex w-full max-w-[480px] gap-2.5 md:max-w-[520px] ${
            isMobile ? 'flex-col items-stretch' : 'flex-row items-center justify-center'
          }`}
        >
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={C.newsletter.placeholder}
            required
            className={isMobile ? 'w-full' : 'min-w-0 flex-1'}
          />
          <PrimaryButton
            type="submit"
            className={`min-h-12 shrink-0 whitespace-nowrap px-6 text-sm ${isMobile ? 'self-start' : ''}`}
          >
            {C.newsletter.button}
          </PrimaryButton>
        </form>
      </SectionShell>
    </section>
  );
}
