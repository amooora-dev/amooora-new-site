/**
 * BACKUP — AppSection original (mobile + desktop) antes da reestruturação mobile.
 * Restaurar copiando de volta para HomePage.tsx e revertendo conteudo-home.ts em backups/conteudo-home-app-backup.ts
 * Data: 2026-07-08
 */

/* ── APP SECTION (backup) ── */
function AppSection({ accent, cta, isMobile }: SectionProps & CtaProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setVisible(true);}, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = C.app.items;
  const introFull = C.app.intro.slice(0, 2);
  const introSplit = C.app.intro.slice(2);
  const introParagraphStyle = (marginBottom: number): CSSProperties => ({
    fontFamily: "var(--sans)",
    fontSize: 'clamp(14px,1.2vw,16px)', fontWeight: 300,
    lineHeight: 1.8, color: '#717182', marginBottom
  });

  return (
    <section id="aplicativo" ref={ref} style={{
      padding: isMobile ? '80px 0' : '120px 0', background: '#faf7fb',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingInline: isMobile ? 20 : 48 }}>

        {/* Cabeçalho + 2 primeiros parágrafos em largura total */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1.5, background: accent }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>{C.app.label}</span>
          </div>
          <h2 style={{ fontFamily: "var(--serif)",
            fontSize: 'clamp(28px,3.5vw,50px)', fontWeight: 900, color: 'var(--ink)',
            lineHeight: 1.1, marginBottom: 12 }}>
            {C.app.title}
          </h2>
          {introFull.map((paragraph, i) =>
          <p key={i} style={introParagraphStyle(i === introFull.length - 1 ? 20 : 20)}>
              <TextWithBreaks text={paragraph} />
            </p>
          )}
        </div>

        {/* A partir do 3º parágrafo: texto + mockup lado a lado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 48 : 80,
          alignItems: 'start'
        }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>

          {introSplit.map((paragraph, i) =>
          <p key={i} style={introParagraphStyle(i === introSplit.length - 1 ? 40 : 20)}>
              <TextWithBreaks text={paragraph} />
            </p>
          )}

          {/* Accordion items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={{
                  borderTop: `1px solid ${accent}20`,
                  borderBottom: i === items.length - 1 ? `1px solid ${accent}20` : 'none'
                }}>
                  <button onClick={() => setOpen(isOpen ? null : i)} style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12
                  }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 'clamp(14px,1.2vw,16px)', fontWeight: 600,
                      color: isOpen ? accent : '#717182', transition: 'color 0.2s' }}>
                      {item.label}
                    </span>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: isOpen ? accent : `${accent}14`,
                      color: isOpen ? 'white' : accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 300,
                      transition: 'all 0.22s',
                      transform: isOpen ? 'rotate(45deg)' : 'none'
                    }}>+</span>
                  </button>

                  {isOpen &&
                  <div style={{ paddingBottom: 20, animation: 'fadeUp 0.3s ease both' }}>
                      {item.blocks.map((b, bi) =>
                    <div key={bi} style={{
                      padding: '14px 0 14px 16px',
                      borderLeft: `2px solid ${accent}`,
                      marginBottom: bi < item.blocks.length - 1 ? 12 : 0
                    }}>
                          <p style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600,
                        color: 'var(--ink)', marginBottom: 6 }}>{b.q}</p>
                          <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: '#717182',
                        lineHeight: 1.7, fontWeight: 300 }}>{b.a}</p>
                        </div>
                    )}
                    </div>
                  }
                </div>);

            })}
          </div>

              <PilotSignup accent={accent} cta={cta} isMobile={isMobile} />
        </div>

        {/* Mockup alinhado ao 3º parágrafo */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(40px)',
          transition: 'all 1s 0.2s ease'
        }}>
          <Image
            src="/images/app-mockup.png"
            alt="Amooora App"
            width={520}
            height={1040}
            style={{
              width: '100%',
              maxWidth: 520,
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 32px 64px rgba(147,45,111,0.25))',
              animation: isMobile ? 'none' : 'floatY 5s ease-in-out infinite'
            }}
          />
        </div>
        </div>
      </div>
    </section>);

}
