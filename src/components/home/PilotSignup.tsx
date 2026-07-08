'use client';

import { useState, type FormEvent } from 'react';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { trackPilotSignup } from '@/lib/analytics';

type PilotSignupProps = {
  accent: string;
  cta: string;
  isMobile: boolean;
};

export function PilotSignup({ accent, cta, isMobile }: PilotSignupProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { pilot } = C.app;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // TODO: enviar para o BD quando a API estiver pronta
    console.info('[pilot-signup]', { email: email.trim() });
    trackPilotSignup();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div style={{ marginTop: 36 }}>
      <p style={{
        fontFamily: "var(--sans)",
        fontSize: 'clamp(15px,1.4vw,17px)',
        fontWeight: 400,
        lineHeight: 1.7,
        color: '#717182',
        maxWidth: 480,
        marginBottom: 20,
      }}>
        {pilot.text}
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => {
          if (v) setSubmitted(false);
          return !v;
        })}
        style={{
          fontFamily: "var(--sans)",
          fontSize: 15,
          fontWeight: 600,
          background: cta,
          color: 'white',
          padding: '12px 28px',
          borderRadius: 100,
          border: 'none',
          cursor: 'pointer',
          boxShadow: `0 8px 32px ${cta}44`,
          transition: 'all 0.25s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 12px 40px ${cta}55`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = `0 8px 32px ${cta}44`;
        }}
      >
        {pilot.cta}
      </button>

      {open && (
        <div style={{
          marginTop: 20,
          padding: isMobile ? 16 : 20,
          borderRadius: 12,
          border: `1px solid ${accent}22`,
          background: `${accent}06`,
          animation: 'fadeUp 0.3s ease both',
        }}>
          {submitted ? (
            <p style={{
              fontFamily: "var(--sans)",
              fontSize: 15,
              fontWeight: 500,
              color: accent,
              lineHeight: 1.6,
            }}>
              {pilot.success}
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              gap: 10,
              flexDirection: 'column',
            }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={pilot.placeholder}
                aria-label={pilot.placeholder}
                style={{
                  minHeight: 48,
                  borderRadius: 8,
                  border: '1px solid #e8eaf2',
                  padding: '0 16px',
                  fontFamily: "var(--sans)",
                  fontSize: 16,
                  color: '#0f1b3d',
                  outline: 'none',
                  width: '100%',
                  background: 'white',
                }}
              />
              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  minHeight: 48,
                  padding: '0 24px',
                  borderRadius: 100,
                  border: 'none',
                  background: cta,
                  color: 'white',
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
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
