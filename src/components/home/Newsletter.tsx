"use client";

import { EmailInput } from "@/components/ui/EmailInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { trackNewsletterSignup } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import type { FormEvent } from "react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    trackNewsletterSignup();
    setEmail("");
  };

  return (
    <section className='bg-white px-5 py-6 md:px-0 md:pb-9 md:pt-6'>
      <SectionShell
        narrow
        className='items-start text-left md:items-center md:text-center flex flex-col !px-0 md:!px-12'
      >
        <p className='mb-5 max-w-[480px] font-sans text-[clamp(15px,1.4vw,17px)] font-normal leading-[1.7] text-muted-fg md:max-w-none whitespace-normal md:whitespace-nowrap'>
          {C.newsletter.title}
        </p>

        <form
          onSubmit={handleSubmit}
          className={`flex w-full max-w-[480px] gap-2.5 md:max-w-[520px] flex-col items-stretch md:flex-row md:items-center md:justify-center`}
        >
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={C.newsletter.placeholder}
            required
            className={"w-full md:min-w-0 md:flex-1"}
          />
          <PrimaryButton
            type='submit'
            className={`min-h-12 shrink-0 whitespace-nowrap px-6 text-sm self-start md:self-auto`}
          >
            {C.newsletter.button}
          </PrimaryButton>
        </form>
      </SectionShell>
    </section>
  );
}
