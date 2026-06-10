/**
 * BACKUP — componente React original da seção Galeria (Amooora.html)
 * Grid 4x3 com imagens e citações intercaladas.
 */

/* ── GALLERY ── */
function Gallery({ accent, isMobile }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setVisible(true);}, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const posts = C.gallery.posts;

  return (
    <section id="galeria" ref={ref} style={{ padding: isMobile ? '80px 0' : '120px 0', background: '#faf7fb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
          opacity: visible ? 1 : 0, transition: 'all 0.7s ease' }}>
          <div style={{ width: 36, height: 1.5, background: accent }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>{C.gallery.label}</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif",
          fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 900, color: 'var(--ink)',
          marginBottom: 56, opacity: visible ? 1 : 0, transition: 'all 0.7s 0.1s ease' }}>
          {C.gallery.title}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gridTemplateRows: isMobile ? 'repeat(6, 190px)' : 'repeat(3, 240px)', gap: 12 }}>
          {posts.map((p, i) =>
          <div key={i} style={{
            borderRadius: 16, overflow: 'hidden', position: 'relative',
            background: p.type === 'quote' ? `linear-gradient(140deg,${accent} 0%,#3a184f 100%)` : '#F5EBFF',
            opacity: visible ? 1 : 0, transform: visible ? 'none' : 'scale(0.96)',
            transition: `all 0.7s ${0.05 * i}s ease`, cursor: 'pointer'
          }}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'scale(1.02)';e.currentTarget.style.zIndex = '2';e.currentTarget.style.boxShadow = `0 20px 60px ${accent}33`;}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.zIndex = '';e.currentTarget.style.boxShadow = '';}}>
              {p.type === 'quote' ?
            <div style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(16px,2vw,22px)',
                fontStyle: 'italic', color: 'white', lineHeight: 1.5 }}>{p.text}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                color: 'rgba(255,255,255,0.7)' }}>{p.user}</div>
                </div> :
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: `url(${p.src})`,
              backgroundSize: 'cover', backgroundPosition: 'center'
            }} />
            }
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40,
          opacity: visible ? 1 : 0, transition: 'all 0.7s 0.5s ease' }}>
          <a href="#" style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
            color: accent, textDecoration: 'none', borderBottom: `1px solid ${accent}44`,
            paddingBottom: 2, transition: 'border-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = accent}
          onMouseLeave={(e) => e.target.style.borderColor = `${accent}44`}>
            {C.gallery.cta}
          </a>
        </div>
      </div>
    </section>);
}
