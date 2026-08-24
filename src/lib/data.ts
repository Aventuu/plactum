import type { CategoryTag } from "@/lib/content";

export const PILLARS: { tag: CategoryTag; label: string; desc: string }[] = [
  {
    tag: "constructor",
    label: "Constructores",
    desc: "Los CEOs de los labs de frontera: qué construyen, qué prometen, y dónde chocan sus visiones.",
  },
  {
    tag: "contrarian",
    label: "Contrarians",
    desc: "Quienes creen que el camino actual está mal orientado — y están apostando su carrera a lo contrario.",
  },
  {
    tag: "doomer",
    label: "Doomers",
    desc: "Los que ven riesgo existencial real. Filósofos, premios Nobel y fundadores de institutos de seguridad.",
  },
  {
    tag: "esceptico",
    label: "Escépticos",
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
