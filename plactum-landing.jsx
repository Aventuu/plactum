import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Mail, Menu, X, Lock } from "lucide-react";

const C = {
  ink: "#14161C",
  panel: "#1B1E27",
  panelHover: "#20232E",
  border: "#2A2E3A",
  paper: "#EDEAE1",
  muted: "#8B8D98",
  mutedFaint: "#5B5D68",
  amber: "#E8A33D",
  amberDark: "#C98A2C",
  blue: "#5B8DEF",
  violet: "#B47EE5",
  red: "#E15B5B",
  green: "#6FBF73",
};

const FONTS = {
  mono: "'IBM Plex Mono', ui-monospace, monospace",
  serif: "'Source Serif 4', Georgia, serif",
  sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
  display: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
};

const SIGNALS = [
  { name: "Dario Amodei", role: "CEO, Anthropic", tag: "Constructor", color: C.blue,
    note: "Insiste en regular mientras acelera el despliegue — la tensión que define a los CEOs de frontera." },
  { name: "Yann LeCun", role: "Executive Chairman, AMI Labs", tag: "Contrarian", color: C.violet,
    note: "Apostó su carrera a que los LLMs son un callejón sin salida y los \"world models\" son el futuro." },
  { name: "Ilya Sutskever", role: "CEO, Safe Superintelligence", tag: "Contrarian", color: C.violet,
    note: "El arquitecto del escalado de GPT ahora cuestiona en público si escalar más ya dejó de alcanzar." },
  { name: "Geoffrey Hinton", role: "Independiente · Nobel 2024", tag: "Doomer", color: C.red,
    note: "Sigue advirtiendo sobre pérdida de control, ahora con el peso de un Nobel detrás de cada frase." },
  { name: "Eliezer Yudkowsky", role: "Fundador, MIRI", tag: "Doomer", color: C.red,
    note: "Su libro de 2025 sigue trepando listas de venta — y sigue sin convencer a la mayoría del campo." },
  { name: "Gary Marcus", role: "Profesor Emérito, NYU", tag: "Escéptico", color: C.green,
    note: "Lleva meses documentando qué tan lejos está la economía de la IA generativa de ser rentable." },
];

const PILLARS = [
  { tag: "Constructores", color: C.blue,
    desc: "Los CEOs de los labs de frontera: qué construyen, qué prometen, y dónde chocan sus visiones." },
  { tag: "Contrarians", color: C.violet,
    desc: "Quienes creen que el camino actual está mal orientado — y están apostando su carrera a lo contrario." },
  { tag: "Doomers", color: C.red,
    desc: "Los que ven riesgo existencial real. Filósofos, premios Nobel y fundadores de institutos de seguridad." },
  { tag: "Escépticos", color: C.green,
    desc: "Los que dudan del hype mismo: la economía, las promesas de AGI, la sustancia detrás del ruido." },
];

const FEATURES = [
  "Un expediente semanal a fondo",
  "Acceso al archivo completo de números",
  "Radar corto de señales entre números",
];

const SAMPLE_ARTICLE = [
  "Mientras los laboratorios de frontera compiten a fuerza de cómputo, un grupo cada vez más visible de investigadores está apostando en la dirección contraria. Esta semana comparamos las tres apuestas más financiadas contra el paradigma dominante — y por qué sus fundadores creen que la ventaja de los líderes actuales podría no durar.",
  "La primera señal llegó de un laboratorio parisino que en cuestión de semanas cerró la ronda semilla más grande en la historia de Europa. Su tesis es simple de enunciar y difícil de ejecutar: los modelos de lenguaje, sin importar cuánto se escalen, nunca van a entender el mundo físico de la forma en que lo hace un niño de dos años que aprende a base de observar, tocar y equivocarse. El laboratorio lleva más de un año construyendo lo que llaman arquitecturas predictivas — sistemas que aprenden a representar el mundo antes de aprender a hablar de él.",
  "La segunda apuesta viene de alguien que ayudó a construir el paradigma que ahora pone en duda. Después de más de una década liderando la investigación que hizo posible el salto de los primeros modelos de lenguaje a los actuales, este investigador dejó su cargo para fundar un laboratorio que no ha publicado un solo paper, no tiene productos, y aun así ha levantado miles de millones de dólares a una valoración que ya supera a bancos centenarios.",
];

const SAMPLE_ARTICLE_LOCKED_START =
  "Lo que ambos apuestan tiene algo en común más allá de la cifra: ninguno cree que el camino hacia una inteligencia realmente útil pase por...";

const FEATURED_ARTICLES = [
  { tag: "Contrarian", color: C.violet, rank: "Nº 1 esta semana",
    title: "La apuesta de $1,000 millones contra los LLMs",
    dek: "Quiénes están financiando arquitecturas alternativas a los modelos de lenguaje — y por qué." },
  { tag: "Doomer", color: C.red, rank: "Nº 2 esta semana",
    title: "Lo que cambió (y lo que no) desde que Hinton ganó el Nobel",
    dek: "Un año después del premio, medimos qué tanto avanzó el debate sobre riesgo existencial en la política pública." },
  { tag: "Escéptico", color: C.green, rank: "Nº 3 esta semana",
    title: "Cinco números que explican la burbuja de la IA generativa",
    dek: "Los datos detrás de la desconfianza creciente en la economía de los modelos de frontera." },
];

const FAQ = [
  { q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. No hay permanencia mínima — cancelas cuando quieras desde tu cuenta." },
  { q: "¿Cómo se cobra?",
    a: "El precio se muestra en dólares como referencia, pero el cobro se procesa en pesos colombianos a través de MercadoPago (tarjeta, PSE o Nequi)." },
  { q: "¿El precio fundador es para siempre?",
    a: "Sí, mientras tu suscripción se mantenga activa sin interrupciones." },
  { q: "¿Qué pasa si cancelo y quiero volver más adelante?",
    a: "Vuelves al precio vigente en ese momento. Si el cupo fundador ya se agotó, entras al precio regular." },
];

function Tag({ color, children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color, backgroundColor: color + "1A", border: `1px solid ${color}40`, fontFamily: FONTS.mono }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

function FeatureList({ items, checkColor }) {
  return (
    <ul className="mt-6 space-y-3 text-sm" style={{ color: C.muted }}>
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <Check size={16} style={{ color: checkColor, marginTop: 2, flexShrink: 0 }} />
          {f}
        </li>
      ))}
    </ul>
  );
}

export default function Plactum() {
  const [page, setPage] = useState("home");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubscribe = () => {
    if (!email.includes("@")) return;
    setSent(true);
  };

  const goPrecios = () => {
    setPage("precios");
    setSent(false);
    setMenuOpen(false);
  };

  const goHome = () => {
    setPage("home");
    setMenuOpen(false);
  };

  const goArticulo = () => {
    setPage("articulo");
    setMenuOpen(false);
  };

  const scrollToId = (id) => {
    setMenuOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Every page switch behaves like opening a new page: start at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Floating paywall: appears once the reader scrolls down to the locked
  // part of the article, instead of sitting fixed in the page layout.
  const lockedTextRef = useRef(null);
  const [showFloatingPaywall, setShowFloatingPaywall] = useState(false);

  useEffect(() => {
    setShowFloatingPaywall(false);
    if (page !== "articulo") return;
    const el = lockedTextRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowFloatingPaywall(true);
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page]);

  return (
    <div style={{ backgroundColor: C.ink, color: C.paper, fontFamily: FONTS.sans, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ borderColor: C.border, backgroundColor: C.ink + "E6" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={goHome}
            className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer"
          >
            <span className="h-2.5 w-2.5 flex-shrink-0" style={{ backgroundColor: C.amber }} />
            <span
              className="text-xl font-bold uppercase"
              style={{ fontFamily: FONTS.display, letterSpacing: "-0.02em", color: C.paper }}
            >
              Plactum
            </span>
            <span className="hidden sm:inline text-xs" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>/ signal desk</span>
          </button>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {page === "home" ? (
              <>
                <button onClick={() => scrollToId("cobertura")} className="hover:opacity-80 bg-transparent border-0 p-0 cursor-pointer" style={{ color: C.muted }}>Qué cubrimos</button>
                <button onClick={goArticulo} className="hover:opacity-80 bg-transparent border-0 p-0 cursor-pointer" style={{ color: C.muted }}>Último número</button>
              </>
            ) : (
              <button onClick={goHome} className="bg-transparent border-0 p-0 cursor-pointer hover:opacity-80" style={{ color: C.muted }}>
                Inicio
              </button>
            )}
            <button
              onClick={goPrecios}
              className="bg-transparent border-0 p-0 cursor-pointer hover:opacity-80"
              style={{ color: page === "precios" ? C.amber : C.muted }}
            >
              Precios
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={goPrecios}
              className="rounded-md px-4 py-2 text-sm font-medium transition-colors border-0 cursor-pointer"
              style={{ backgroundColor: C.amber, color: C.ink }}
            >
              Suscribirme
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 bg-transparent cursor-pointer"
              style={{ border: `1px solid ${C.border}`, color: C.paper }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {menuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: C.border, backgroundColor: C.ink }}>
            <nav className="mx-auto flex max-w-6xl flex-col px-6 py-2 text-sm">
              {page === "home" ? (
                <>
                  <button onClick={() => scrollToId("cobertura")} className="py-3 border-b text-left w-full bg-transparent border-0 cursor-pointer" style={{ color: C.muted, borderColor: C.border, borderBottomWidth: "1px" }}>Qué cubrimos</button>
                  <button onClick={goArticulo} className="py-3 border-b text-left w-full bg-transparent border-0 cursor-pointer" style={{ color: C.muted, borderColor: C.border, borderBottomWidth: "1px" }}>Último número</button>
                </>
              ) : (
                <button onClick={goHome} className="py-3 border-b text-left bg-transparent border-0 border-b cursor-pointer" style={{ color: C.muted, borderColor: C.border }}>
                  Inicio
                </button>
              )}
              <button
                onClick={goPrecios}
                className="py-3 text-left bg-transparent border-0 cursor-pointer"
                style={{ color: page === "precios" ? C.amber : C.muted }}
              >
                Precios
              </button>
            </nav>
          </div>
        )}
      </header>

      {page === "home" && (
        <>
          {/* HERO */}
          <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
            <div
              className="mb-6 inline-block text-xs tracking-wider"
              style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}
            >
              EXPEDIENTE Nº 001 — SEMANA DEL 24 DE AGOSTO, 2026
            </div>
            <h1
              className="max-w-3xl text-4xl leading-[1.1] sm:text-6xl sm:leading-[1.05]"
              style={{ fontFamily: FONTS.serif, fontWeight: 600, color: C.paper }}
            >
              Quién construye la IA.<br />Quién le teme.<br />Quién no le cree.
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg" style={{ color: C.muted }}>
              Cada semana leemos lo que publican, dicen y construyen los científicos, CEOs y
              críticos que están decidiendo el rumbo de la inteligencia artificial — y te
              contamos, en un solo análisis, qué significa de verdad.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={goArticulo}
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium border-0 cursor-pointer"
                style={{ backgroundColor: C.amber, color: C.ink }}
              >
                Leer más <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* SIGNAL STRIP — signature element */}
          <section className="border-y" style={{ borderColor: C.border, backgroundColor: C.panel }}>
            <div className="mx-auto max-w-6xl px-6 py-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs tracking-wider" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
                  ÚLTIMAS SEÑALES DETECTADAS
                </span>
                <span className="hidden sm:block text-xs" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
                  ← desliza →
                </span>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {SIGNALS.map((s) => (
                  <div
                    key={s.name}
                    className="w-72 flex-shrink-0 rounded-lg p-4"
                    style={{ backgroundColor: C.ink, border: `1px solid ${C.border}` }}
                  >
                    <Tag color={s.color}>{s.tag}</Tag>
                    <div className="mt-3 text-sm font-semibold" style={{ color: C.paper }}>{s.name}</div>
                    <div className="text-xs mb-2" style={{ color: C.mutedFaint }}>{s.role}</div>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{s.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs" style={{ color: C.mutedFaint }}>
                Ejemplo ilustrativo del formato — el número real se arma con fuentes verificadas de la semana.
              </p>
            </div>
          </section>

          {/* COBERTURA */}
          <section id="cobertura" className="mx-auto max-w-6xl px-6 py-20" style={{ scrollMarginTop: "80px" }}>
            <span className="text-xs tracking-wider" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
              CÓMO ORGANIZAMOS LA SEÑAL
            </span>
            <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl" style={{ fontFamily: FONTS.serif, fontWeight: 600 }}>
              La IA no habla con una sola voz. Nosotros seguimos las cuatro que importan.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <div key={p.tag} className="rounded-lg p-6" style={{ backgroundColor: C.panel, border: `1px solid ${C.border}` }}>
                  <Tag color={p.color}>{p.tag}</Tag>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* MÁS LEÍDOS */}
          <section className="border-y" style={{ borderColor: C.border, backgroundColor: C.panel }}>
            <div className="mx-auto max-w-6xl px-6 py-20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs tracking-wider" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
                    MÁS LEÍDOS ESTA SEMANA
                  </span>
                  <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl" style={{ fontFamily: FONTS.serif, fontWeight: 600 }}>
                    Lo que más está leyendo el resto de los suscriptores.
                  </h2>
                </div>
                <span className="hidden sm:block text-xs flex-shrink-0" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
                  ← desliza →
                </span>
              </div>
              <div className="mt-10 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {FEATURED_ARTICLES.map((a) => (
                  <button
                    key={a.title}
                    onClick={goArticulo}
                    className="text-left w-72 sm:w-80 flex-shrink-0 rounded-lg p-6 bg-transparent border-0 cursor-pointer transition-colors"
                    style={{ backgroundColor: C.ink, border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Tag color={a.color}>{a.tag}</Tag>
                      <span className="text-xs" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>{a.rank}</span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold leading-snug" style={{ fontFamily: FONTS.serif, color: C.paper }}>
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>{a.dek}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: C.amber }}>
                      Leer más <ArrowRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs" style={{ color: C.mutedFaint }}>
                Ejemplo ilustrativo del formato — en el sitio real, cada tarjeta lleva a su propio expediente.
              </p>
            </div>
          </section>

          {/* PRECIO — teaser */}
          <section className="mx-auto max-w-2xl px-6 py-20 text-center">
            <span className="text-xs tracking-wider" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
              SUSCRIPCIÓN
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl" style={{ fontFamily: FONTS.serif, fontWeight: 600 }}>
              Un análisis a la semana. Cero ruido.
            </h2>
            <p className="mt-4 text-sm" style={{ color: C.muted }}>
              Cupo fundador desde{" "}
              <span style={{ color: C.amber, fontWeight: 600 }}>$4.99 USD/mes</span>, precio fijo de por vida.
            </p>
            <button
              onClick={goPrecios}
              className="mt-6 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium border-0 cursor-pointer"
              style={{ backgroundColor: C.amber, color: C.ink }}
            >
              Ver planes y precios <ArrowRight size={16} />
            </button>
          </section>
        </>
      )}

      {page === "articulo" && (
        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <span className="text-xs tracking-wider" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
            EXPEDIENTE Nº 001 — SEMANA DEL 24 DE AGOSTO, 2026
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl leading-[1.1]" style={{ fontFamily: FONTS.serif, fontWeight: 600 }}>
            La apuesta de $1,000 millones contra los LLMs
          </h1>
          <p className="mt-4 text-sm" style={{ color: C.mutedFaint }}>Lectura libre hasta la mitad</p>

          {SAMPLE_ARTICLE.map((p, i) => (
            <p key={i} className="mt-5 text-base leading-relaxed" style={{ color: C.muted, fontFamily: FONTS.serif }}>
              {p}
            </p>
          ))}

          <div ref={lockedTextRef} className="relative mt-5" style={{ maxHeight: "64px", overflow: "hidden" }}>
            <p className="text-base leading-relaxed" style={{ color: C.muted, fontFamily: FONTS.serif }}>
              {SAMPLE_ARTICLE_LOCKED_START}
            </p>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{ background: `linear-gradient(to bottom, transparent, ${C.ink})` }}
            />
          </div>

          <p className="mt-8 text-xs" style={{ color: C.mutedFaint }}>
            Artículo de ejemplo para el mockup, basado en hechos públicos reales — el número real se arma con fuentes verificadas de la semana.
          </p>
        </section>
      )}

      {/* FLOATING PAYWALL — slides up once the reader reaches the locked part of the article */}
      {page === "articulo" && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:pb-6 transition-all duration-500 ease-out"
          style={{
            transform: showFloatingPaywall ? "translateY(0)" : "translateY(120%)",
            opacity: showFloatingPaywall ? 1 : 0,
            pointerEvents: showFloatingPaywall ? "auto" : "none",
          }}
        >
          <div
            className="mx-auto max-w-xl rounded-lg p-5 sm:p-6"
            style={{ backgroundColor: C.panel, border: `1px solid ${C.amber}`, boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: C.amber + "1A", border: `1px solid ${C.amber}40` }}
              >
                <Lock size={16} style={{ color: C.amber }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ fontFamily: FONTS.serif, color: C.paper }}>
                  Sigue leyendo con acceso completo
                </p>
                <p className="text-xs" style={{ color: C.muted }}>
                  Desde $4.99/mes, precio fijo de fundador.
                </p>
              </div>
              <button
                onClick={goPrecios}
                className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium border-0 cursor-pointer"
                style={{ backgroundColor: C.amber, color: C.ink }}
              >
                Desbloquear <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {page === "precios" && (
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <span className="text-xs tracking-wider" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
            PRECIOS
          </span>
          <h1 className="mt-3 max-w-2xl text-3xl sm:text-5xl leading-[1.1]" style={{ fontFamily: FONTS.serif, fontWeight: 600 }}>
            El precio sube cuando se llena el cupo.
          </h1>
          <p className="mt-4 max-w-lg text-base sm:text-lg" style={{ color: C.muted }}>
            Los primeros suscriptores fijan su precio para siempre. Los que lleguen
            después, pagan el precio regular.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {/* FUNDADOR */}
            <div className="relative rounded-lg p-8 pt-10" style={{ backgroundColor: C.panel, border: `1px solid ${C.amber}` }}>
              <div className="absolute -top-3 left-8">
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: C.amber, color: C.ink, fontFamily: FONTS.mono }}
                >
                  CUPO FUNDADOR
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold" style={{ fontFamily: FONTS.serif }}>$4.99</span>
                <span className="text-sm" style={{ color: C.mutedFaint }}>USD/mes</span>
              </div>
              <p className="mt-1 text-sm font-medium" style={{ color: C.amber }}>
                Precio fijo de por vida — nunca sube
              </p>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
                  <span>Cupos fundadores ocupados</span>
                  <span>35%</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
                  <div className="h-full rounded-full" style={{ width: "35%", backgroundColor: C.amber }} />
                </div>
                <p className="mt-1.5 text-xs" style={{ color: C.mutedFaint }}>
                  Vista de ejemplo — el sitio real mostrará el avance real sobre un cupo limitado, sin revelar el número total.
                </p>
              </div>

              <FeatureList items={[...FEATURES, "Precio congelado mientras sigas suscrito"]} checkColor={C.amber} />

              {!sent ? (
                <div className="mt-6">
                  <div className="flex items-center gap-2 rounded-md px-3 py-2.5" style={{ backgroundColor: C.ink, border: `1px solid ${C.border}` }}>
                    <Mail size={16} style={{ color: C.mutedFaint }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-transparent text-sm outline-none"
                      style={{ color: C.paper }}
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="mt-3 w-full rounded-md py-2.5 text-sm font-medium border-0 cursor-pointer"
                    style={{ backgroundColor: C.amber, color: C.ink }}
                  >
                    Asegurar mi cupo fundador
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-md px-3 py-3 text-sm" style={{ backgroundColor: C.green + "1A", color: C.green, border: `1px solid ${C.green}40` }}>
                  Listo. Revisa tu correo para confirmar.
                </div>
              )}
            </div>

            {/* REGULAR */}
            <div className="rounded-lg p-8 pt-10" style={{ backgroundColor: C.panel, border: `1px solid ${C.border}` }}>
              <span className="text-xs font-medium tracking-wider" style={{ color: C.mutedFaint, fontFamily: FONTS.mono }}>
                PRECIO REGULAR
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-semibold" style={{ fontFamily: FONTS.serif, color: C.muted }}>$14.99</span>
                <span className="text-sm" style={{ color: C.mutedFaint }}>USD/mes</span>
              </div>
              <p className="mt-1 text-sm" style={{ color: C.mutedFaint }}>
                Se activa cuando se agote el cupo fundador
              </p>

              <FeatureList items={FEATURES} checkColor={C.mutedFaint} />

              <button
                disabled
                className="mt-6 w-full rounded-md py-2.5 text-sm font-medium cursor-not-allowed"
                style={{ backgroundColor: "transparent", color: C.mutedFaint, border: `1px solid ${C.border}` }}
              >
                Disponible al agotarse el fundador
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl">
            <h2 className="text-xl sm:text-2xl" style={{ fontFamily: FONTS.serif, fontWeight: 600 }}>
              Preguntas frecuentes
            </h2>
            <div className="mt-4">
              {FAQ.map((item) => (
                <div key={item.q} className="py-5" style={{ borderTop: `1px solid ${C.border}` }}>
                  <p className="text-sm font-semibold" style={{ color: C.paper }}>{item.q}</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: C.border }}>
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: C.mutedFaint }}>
          <span style={{ fontFamily: FONTS.mono }}>© 2026 PLACTUM</span>
          <span style={{ fontFamily: FONTS.mono }}>plactum.com</span>
        </div>
      </footer>
    </div>
  );
}
