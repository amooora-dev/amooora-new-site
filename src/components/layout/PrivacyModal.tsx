'use client';

import { useEffect } from 'react';
import { POLITICA_DE_COOKIES as P } from '@/lib/politica-de-cookies';

type PrivacyModalProps = {
  onClose: () => void;
};

export function PrivacyModal({ onClose }: PrivacyModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const bodyText: React.CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: 'clamp(14px,1.2vw,16px)',
    fontWeight: 300,
    color: '#717182',
    lineHeight: 1.8,
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: 'clamp(14px,1.2vw,16px)',
    fontWeight: 600,
    color: '#717182',
    lineHeight: 1.8,
    marginBottom: 8,
    marginTop: 28,
  };

  const subTitle: React.CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: 'clamp(14px,1.2vw,16px)',
    fontWeight: 600,
    color: '#717182',
    lineHeight: 1.8,
    marginBottom: 6,
    marginTop: 20,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(58,24,79,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 680,
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: 'clamp(24px,4vw,48px)',
          position: 'relative',
        }}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'sticky', top: 0, float: 'right',
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(147,45,111,0.08)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', fontSize: 18, lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ✕
        </button>

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--primary)', marginBottom: 12,
        }}>
          Política de Privacidade
        </p>

        {/* Título */}
        <h2 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(24px,3vw,36px)',
          fontWeight: 700, color: 'var(--secondary)',
          lineHeight: 1.15, marginBottom: 8,
        }}>
          {P.title}
        </h2>

        {/* Intro */}
        <p style={{ ...bodyText, marginBottom: 0 }}>{P.intro}</p>

        {/* Seções */}
        {P.sections.map((section) => (
          <div key={section.title}>
            <p style={sectionTitle}>{section.title}</p>

            {'paragraphs' in section && section.paragraphs.map((p) => (
              <p key={p} style={{ ...bodyText, marginBottom: 8 }}>{p}</p>
            ))}

            {'bullets' in section && (
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                {section.bullets.map((b) => (
                  <li key={b} style={{ ...bodyText, marginBottom: 6 }}>{b}</li>
                ))}
              </ul>
            )}

            {'subsections' in section && (
              <div style={{ marginTop: 8 }}>
                {section.subsections.map((sub) => (
                  <div key={sub.title}>
                    <p style={subTitle}>{sub.title}</p>
                    {sub.paragraphs.map((p) => (
                      <p key={p} style={{ ...bodyText, marginBottom: 8 }}>{p}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
