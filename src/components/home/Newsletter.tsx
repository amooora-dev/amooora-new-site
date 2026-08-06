"use client";

import { EmailInput } from "@/components/ui/EmailInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { trackNewsletterSignup } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import type { FormEvent } from "react";
import { useState } from "react";

export function Newsletter() {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    trackNewsletterSignup();
    setEmail("");
  };

  return (
    <section
      className='bg-white'
      style={{ padding: isMobile ? "24px 20px 36px" : "24px 0 36px" }}
    >
      <div
        className='mx-auto flex flex-col'
        style={{
          maxWidth: 860,
          padding: isMobile ? 0 : "0 48px",
          alignItems: isMobile ? "flex-start" : "center",
          textAlign: isMobile ? "left" : "center",
        }}
      >
        <p
          className='mb-5 font-sans font-normal leading-[1.7] text-muted-fg'
          style={{
            fontSize: "clamp(15px,1.4vw,17px)",
            maxWidth: isMobile ? 480 : "none",
            whiteSpace: isMobile ? "normal" : "nowrap",
          }}
        >
          {C.newsletter.title}
        </p>

        <form
          onSubmit={handleSubmit}
          className='flex gap-2.5'
          style={{
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: isMobile ? "flex-start" : "center",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? 480 : 520,
          }}
        >
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={C.newsletter.placeholder}
            required
            className={isMobile ? "w-full" : "flex-1 min-w-0"}
          />
          <PrimaryButton
            type='submit'
            className='shrink-0 px-6 text-sm'
            style={{
              alignSelf: isMobile ? "flex-start" : "auto",
              minHeight: 48,
              whiteSpace: "nowrap",
            }}
          >
            {C.newsletter.button}
          </PrimaryButton>
        </form>
      </div>
    </section>
  );
}
