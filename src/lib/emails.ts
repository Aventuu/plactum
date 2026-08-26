export function founderWelcomeEmail() {
  const C = {
    ink: "#14161C",
    paper: "#EDEAE1",
    muted: "#8B8D98",
    amber: "#E8A33D",
    border: "#2A2E3A",
  };

  return `
<div style="background-color:${C.ink};padding:40px 24px;font-family:Georgia,serif;">
  <div style="max-width:480px;margin:0 auto;">
    <div style="margin-bottom:32px;">
      <span style="display:inline-block;width:10px;height:10px;background-color:${C.amber};margin-right:8px;"></span>
      <span style="font-family:Arial,sans-serif;font-weight:700;font-size:18px;letter-spacing:-0.02em;color:${C.paper};text-transform:uppercase;">Plactum</span>
    </div>

    <h1 style="font-size:24px;line-height:1.3;color:${C.paper};margin:0 0 16px;">
      Quedaste en la lista fundadora.
    </h1>

    <p style="font-size:15px;line-height:1.6;color:${C.muted};margin:0 0 16px;">
      Guardamos tu lugar con el precio fundador: <strong style="color:${C.amber};">$9.900 COP/mes</strong>,
      fijo de por vida mientras tu suscripción se mantenga activa sin interrupciones.
    </p>

    <p style="font-size:15px;line-height:1.6;color:${C.muted};margin:0 0 32px;">
      Te avisamos por acá en cuanto salga el primer número. Mientras tanto, no hace falta que hagas nada más.
    </p>

    <div style="border-top:1px solid ${C.border};padding-top:16px;font-family:'Courier New',monospace;font-size:12px;color:#5B5D68;">
      Plactum — el ojo que no se cierra.<br />plactum.com
    </div>
  </div>
</div>
`;
}
