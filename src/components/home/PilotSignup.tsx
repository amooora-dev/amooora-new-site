"use client";

import { EmailInput } from "@/components/ui/EmailInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { trackPilotSignup } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import type { FormEvent } from "react";
import { useState } from "react";

export function PilotSignup() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { pilot } = C.app;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    console.info("[pilot-signup]", { email: email.trim() });
    trackPilotSignup();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className='mt-9'>
      <p className='mb-5 max-w-[480px] font-sans text-[clamp(15px,1.4vw,17px)] font-normal leading-[1.7] text-muted-fg'>
        {pilot.text}
      </p>

      <PrimaryButton
        onClick={() =>
          setOpen((v) => {
            if (v) setSubmitted(false);
            return !v;
          })
        }
        className='px-7 py-3 text-[15px]'
      >
        {pilot.cta}
      </PrimaryButton>

      {open && (
        <div
          className={`mt-5 animate-fadeUp rounded-xl border border-primary-13 bg-primary-2 ${
            isMobile ? "p-4" : "p-5"
          }`}
        >
          {submitted ? (
            <p className='font-sans text-[15px] font-medium leading-[1.6] text-primary'>
              {pilot.success}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className='flex flex-col gap-2.5'>
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={pilot.placeholder}
                required
                className='w-full'
              />
              <button
                type='submit'
                className='min-h-12 cursor-pointer self-start rounded-full border-none bg-primary px-6 font-sans text-sm font-semibold text-white'
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
