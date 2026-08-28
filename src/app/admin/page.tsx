import { redirect } from "next/navigation";
import { createSupabaseServerClient, requireAdmin } from "@/lib/supabase-server";
import {
  approveFigura,
  discardExpediente,
  discardFicha,
  discardSignal,
  publishExpediente,
  publishFicha,
  publishSignal,
  rejectFigura,
} from "./actions";

type SignalDraft = {
  id: string;
  note: string;
  figuras: { name: string; role: string } | null;
};

type ExpedienteDraft = {
  id: string;
  issue_number: number;
  title: string;
  deck: string;
  category: string;
};

type FichaDraft = {
  id: string;
  title: string;
  deck: string;
  modelo: string;
  laboratorio: string;
};

type FiguraProposed = {
  id: string;
  name: string;
  role: string;
  category_label: string;
  proposed_reason: string | null;
};

export default async function Admin() {
  const admin = await requireAdmin();
  if (!admin) redirect("/ingresar");

  const supabase = await createSupabaseServerClient();

  const [{ data: signales }, { data: expedientes }, { data: fichas }, { data: proposedFiguras }] = await Promise.all([
    supabase
      .from("signales")
      .select("id, note, figuras(name, role)")
      .eq("status", "draft")
      .order("created_at")
      .returns<SignalDraft[]>(),
    supabase
      .from("expedientes")
      .select("id, issue_number, title, deck, category")
      .eq("status", "draft")
      .order("issue_number")
      .returns<ExpedienteDraft[]>(),
    supabase
      .from("fichas_tecnicas")
      .select("id, title, deck, modelo, laboratorio")
      .eq("status", "draft")
      .order("created_at")
      .returns<FichaDraft[]>(),
    supabase
      .from("figuras")
      .select("id, name, role, category_label, proposed_reason")
      .eq("status", "proposed")
      .returns<FiguraProposed[]>(),
  ]);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <span className="text-xs tracking-wider text-muted-faint font-mono">PANEL DE CONTROL</span>
      <h1 className="mt-3 text-3xl font-serif font-semibold">Borradores pendientes</h1>
      <p className="mt-3 text-sm text-muted">
        Sesión: <span className="text-paper">{admin.email}</span>
      </p>

      {/* EXPEDIENTES */}
      <div className="mt-12">
        <h2 className="text-xl font-serif font-semibold">Expedientes ({expedientes?.length ?? 0})</h2>
        <div className="mt-4 space-y-4">
          {expedientes?.map((e) => (
            <div key={e.id} className="rounded-lg p-5 bg-panel border border-border">
              <span className="text-xs text-muted-faint font-mono">
                Nº {String(e.issue_number).padStart(3, "0")} · {e.category}
              </span>
              <h3 className="mt-2 text-base font-semibold font-serif text-paper">{e.title}</h3>
              <p className="mt-1 text-sm text-muted">{e.deck}</p>
              <div className="mt-4 flex gap-2">
                <form action={publishExpediente}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="rounded-md px-4 py-2 text-sm font-medium bg-amber text-ink border-0 cursor-pointer">
                    Publicar
                  </button>
                </form>
                <form action={discardExpediente}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="rounded-md px-4 py-2 text-sm text-muted border border-border bg-transparent cursor-pointer">
                    Descartar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(!expedientes || expedientes.length === 0) && (
            <p className="text-sm text-muted-faint">No hay expedientes pendientes.</p>
          )}
        </div>
      </div>

      {/* FICHAS TÉCNICAS */}
      <div className="mt-14">
        <h2 className="text-xl font-serif font-semibold">Fichas técnicas ({fichas?.length ?? 0})</h2>
        <div className="mt-4 space-y-4">
          {fichas?.map((f) => (
            <div key={f.id} className="rounded-lg p-5 bg-panel border border-border">
              <span className="text-xs text-muted-faint font-mono">
                {f.laboratorio} · {f.modelo}
              </span>
              <h3 className="mt-2 text-base font-semibold font-serif text-paper">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.deck}</p>
              <div className="mt-4 flex gap-2">
                <form action={publishFicha}>
                  <input type="hidden" name="id" value={f.id} />
                  <button className="rounded-md px-4 py-2 text-sm font-medium bg-amber text-ink border-0 cursor-pointer">
                    Publicar
                  </button>
                </form>
                <form action={discardFicha}>
                  <input type="hidden" name="id" value={f.id} />
                  <button className="rounded-md px-4 py-2 text-sm text-muted border border-border bg-transparent cursor-pointer">
                    Descartar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(!fichas || fichas.length === 0) && (
            <p className="text-sm text-muted-faint">No hay fichas técnicas pendientes.</p>
          )}
        </div>
      </div>

      {/* SEÑALES */}
      <div className="mt-14">
        <h2 className="text-xl font-serif font-semibold">Señales ({signales?.length ?? 0})</h2>
        <div className="mt-4 space-y-3">
          {signales?.map((s) => (
            <div
              key={s.id}
              className="rounded-lg p-4 bg-panel border border-border flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-paper">
                  {s.figuras?.name} <span className="text-muted-faint font-normal">— {s.figuras?.role}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{s.note}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <form action={publishSignal}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="rounded-md px-3 py-1.5 text-xs font-medium bg-amber text-ink border-0 cursor-pointer">
                    Publicar
                  </button>
                </form>
                <form action={discardSignal}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="rounded-md px-3 py-1.5 text-xs text-muted border border-border bg-transparent cursor-pointer">
                    Descartar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(!signales || signales.length === 0) && (
            <p className="text-sm text-muted-faint">No hay señales pendientes.</p>
          )}
        </div>
      </div>

      {/* FIGURAS PROPUESTAS */}
      <div className="mt-14">
        <h2 className="text-xl font-serif font-semibold">Figuras propuestas ({proposedFiguras?.length ?? 0})</h2>
        <div className="mt-4 space-y-3">
          {proposedFiguras?.map((f) => (
            <div key={f.id} className="rounded-lg p-4 bg-panel border border-border">
              <p className="text-sm font-semibold text-paper">
                {f.name} <span className="text-muted-faint font-normal">— {f.role}</span>
              </p>
              <p className="mt-1 text-xs text-muted-faint">{f.category_label}</p>
              {f.proposed_reason && <p className="mt-2 text-sm text-muted">{f.proposed_reason}</p>}
              <div className="mt-3 flex gap-2">
                <form action={approveFigura}>
                  <input type="hidden" name="id" value={f.id} />
                  <button className="rounded-md px-3 py-1.5 text-xs font-medium bg-amber text-ink border-0 cursor-pointer">
                    Aprobar
                  </button>
                </form>
                <form action={rejectFigura}>
                  <input type="hidden" name="id" value={f.id} />
                  <button className="rounded-md px-3 py-1.5 text-xs text-muted border border-border bg-transparent cursor-pointer">
                    Rechazar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(!proposedFiguras || proposedFiguras.length === 0) && (
            <p className="text-sm text-muted-faint">No hay figuras propuestas.</p>
          )}
        </div>
      </div>
    </section>
  );
}
