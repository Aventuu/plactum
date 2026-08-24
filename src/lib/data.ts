export type CategoryTag = "Constructor" | "Contrarian" | "Doomer" | "Escéptico";

export const CATEGORY_COLOR: Record<CategoryTag, string> = {
  Constructor: "#5B8DEF",
  Contrarian: "#B47EE5",
  Doomer: "#E15B5B",
  Escéptico: "#6FBF73",
};

export const SIGNALS = [
  {
    name: "Dario Amodei",
    role: "CEO, Anthropic",
    tag: "Constructor" as CategoryTag,
    note: "Insiste en regular mientras acelera el despliegue — la tensión que define a los CEOs de frontera.",
  },
  {
    name: "Yann LeCun",
    role: "Executive Chairman, AMI Labs",
    tag: "Contrarian" as CategoryTag,
    note: 'Apostó su carrera a que los LLMs son un callejón sin salida y los "world models" son el futuro.',
  },
  {
    name: "Ilya Sutskever",
    role: "CEO, Safe Superintelligence",
    tag: "Contrarian" as CategoryTag,
    note: "El arquitecto del escalado de GPT ahora cuestiona en público si escalar más ya dejó de alcanzar.",
  },
  {
    name: "Geoffrey Hinton",
    role: "Independiente · Nobel 2024",
    tag: "Doomer" as CategoryTag,
    note: "Sigue advirtiendo sobre pérdida de control, ahora con el peso de un Nobel detrás de cada frase.",
  },
  {
    name: "Eliezer Yudkowsky",
    role: "Fundador, MIRI",
    tag: "Doomer" as CategoryTag,
    note: "Su libro de 2025 sigue trepando listas de venta — y sigue sin convencer a la mayoría del campo.",
  },
  {
    name: "Gary Marcus",
    role: "Profesor Emérito, NYU",
    tag: "Escéptico" as CategoryTag,
    note: "Lleva meses documentando qué tan lejos está la economía de la IA generativa de ser rentable.",
  },
];

export const PILLARS: { tag: CategoryTag; desc: string }[] = [
  {
    tag: "Constructor",
    desc: "Los CEOs de los labs de frontera: qué construyen, qué prometen, y dónde chocan sus visiones.",
  },
  {
    tag: "Contrarian",
    desc: "Quienes creen que el camino actual está mal orientado — y están apostando su carrera a lo contrario.",
  },
  {
    tag: "Doomer",
    desc: "Los que ven riesgo existencial real. Filósofos, premios Nobel y fundadores de institutos de seguridad.",
  },
  {
    tag: "Escéptico",
    desc: "Los que dudan del hype mismo: la economía, las promesas de AGI, la sustancia detrás del ruido.",
  },
];

export const FEATURES = [
  "Un expediente semanal a fondo",
  "Acceso al archivo completo de números",
  "Radar corto de señales entre números",
];

export const FAQ = [
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. No hay permanencia mínima — cancelas cuando quieras desde tu cuenta.",
  },
  {
    q: "¿Cómo se cobra?",
    a: "El precio se muestra en dólares como referencia, pero el cobro se procesa en pesos colombianos a través de MercadoPago (tarjeta, PSE o Nequi).",
  },
  {
    q: "¿El precio fundador es para siempre?",
    a: "Sí, mientras tu suscripción se mantenga activa sin interrupciones.",
  },
  {
    q: "¿Qué pasa si cancelo y quiero volver más adelante?",
    a: "Vuelves al precio vigente en ese momento. Si el cupo fundador ya se agotó, entras al precio regular.",
  },
];

export type Article = {
  slug: string;
  tag: CategoryTag;
  rank: string;
  issue: string;
  date: string;
  title: string;
  dek: string;
  body: string[];
  lockedStart: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "la-apuesta-de-1000-millones-contra-los-llms",
    tag: "Contrarian",
    rank: "Nº 1 esta semana",
    issue: "EXPEDIENTE Nº 001",
    date: "SEMANA DEL 24 DE AGOSTO, 2026",
    title: "La apuesta de $1,000 millones contra los LLMs",
    dek: "Quiénes están financiando arquitecturas alternativas a los modelos de lenguaje — y por qué.",
    body: [
      "Mientras los laboratorios de frontera compiten a fuerza de cómputo, un grupo cada vez más visible de investigadores está apostando en la dirección contraria. Esta semana comparamos las tres apuestas más financiadas contra el paradigma dominante — y por qué sus fundadores creen que la ventaja de los líderes actuales podría no durar.",
      "La primera señal llegó de un laboratorio parisino que en cuestión de semanas cerró la ronda semilla más grande en la historia de Europa. Su tesis es simple de enunciar y difícil de ejecutar: los modelos de lenguaje, sin importar cuánto se escalen, nunca van a entender el mundo físico de la forma en que lo hace un niño de dos años que aprende a base de observar, tocar y equivocarse. El laboratorio lleva más de un año construyendo lo que llaman arquitecturas predictivas — sistemas que aprenden a representar el mundo antes de aprender a hablar de él.",
      "La segunda apuesta viene de alguien que ayudó a construir el paradigma que ahora pone en duda. Después de más de una década liderando la investigación que hizo posible el salto de los primeros modelos de lenguaje a los actuales, este investigador dejó su cargo para fundar un laboratorio que no ha publicado un solo paper, no tiene productos, y aun así ha levantado miles de millones de dólares a una valoración que ya supera a bancos centenarios.",
    ],
    lockedStart:
      "Lo que ambos apuestan tiene algo en común más allá de la cifra: ninguno cree que el camino hacia una inteligencia realmente útil pase por...",
  },
  {
    slug: "lo-que-cambio-desde-que-hinton-gano-el-nobel",
    tag: "Doomer",
    rank: "Nº 2 esta semana",
    issue: "EXPEDIENTE Nº 001",
    date: "SEMANA DEL 24 DE AGOSTO, 2026",
    title: "Lo que cambió (y lo que no) desde que Hinton ganó el Nobel",
    dek: "Un año después del premio, medimos qué tanto avanzó el debate sobre riesgo existencial en la política pública.",
    body: [
      "Cuando la Academia sueca anunció el premio, la lectura inmediata fue que el riesgo existencial de la IA dejaba de ser una discusión de foros de internet para sentarse en la mesa de los gobiernos. Un año después, revisamos qué tanto de esa promesa se cumplió y qué tanto quedó en gesto simbólico.",
      "En el papel, el efecto es real: media docena de países citan hoy el premio en documentos oficiales de política tecnológica, y al menos dos institutos de seguridad nuevos se fundaron invocando directamente la advertencia. Pero el dinero público destinado a investigación de seguridad sigue siendo una fracción mínima frente al capital que reciben los laboratorios que construyen los sistemas que se supone hay que vigilar.",
      "La pregunta que queda abierta no es si el premio cambió la conversación — la cambió — sino si una conversación más visible, sin presupuesto ni autoridad regulatoria detrás, es distinta de no tener conversación en absoluto.",
    ],
    lockedStart:
      "Los propios coautores del reporte que citamos coinciden en un punto incómodo: la señal más clara de progreso real no va a venir de...",
  },
  {
    slug: "cinco-numeros-que-explican-la-burbuja-de-la-ia-generativa",
    tag: "Escéptico",
    rank: "Nº 3 esta semana",
    issue: "EXPEDIENTE Nº 001",
    date: "SEMANA DEL 24 DE AGOSTO, 2026",
    title: "Cinco números que explican la burbuja de la IA generativa",
    dek: "Los datos detrás de la desconfianza creciente en la economía de los modelos de frontera.",
    body: [
      "No hace falta ser escéptico del hype para hacer las cuentas: el costo de entrenar y servir los modelos de frontera sigue subiendo más rápido que los ingresos que generan. Esta semana reunimos cinco cifras públicas — no estimaciones propias — que explican por qué cada vez más analistas hablan abiertamente de burbuja.",
      "La primera es la más citada y la menos entendida: el gasto combinado en cómputo de los principales laboratorios ya supera, en términos anuales, a la inversión en infraestructura de telecomunicaciones que precedió a la burbuja de internet de finales de los noventa. La comparación no prueba que el desenlace vaya a ser el mismo, pero sí que la escala del riesgo financiero es comparable.",
      "La segunda cifra es más incómoda para los propios laboratorios: la proporción de esos ingresos que proviene de un puñado de clientes empresariales grandes, en vez de una base amplia y diversificada de usuarios pagos, sigue siendo alta — una concentración que en cualquier otro sector encendería alarmas mucho antes.",
    ],
    lockedStart:
      "Las tres cifras restantes tienen algo en común que ningún laboratorio ha querido comentar públicamente cuando se las presentamos:...",
  },
];

export const getArticleBySlug = (slug: string) =>
  ARTICLES.find((a) => a.slug === slug);

export const FEATURED_ARTICLES = ARTICLES;
export const LATEST_ARTICLE = ARTICLES[0];
