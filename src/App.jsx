import { useState, useEffect, useCallback } from “react”;

const C = {
bg: “#080C10”, surface: “#0D1117”, card: “#111820”,
border: “#1C2A38”, accent: “#00D4FF”, gold: “#FFD700”,
purple: “#A855F7”, green: “#10B981”, orange: “#FF6B35”,
text: “#E8F4F8”, muted: “#4A6278”, dim: “#1E3048”,
};

// ─── STORAGE (localStorage — persiste mesmo fechando o app) ──────────────────
const store = {
get: (key, fallback = null) => {
try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
catch { return fallback; }
},
set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

// ─── DADOS ────────────────────────────────────────────────────────────────────
const SEXTA_EX = [
{ nome: “Supino Reto (Halteres)”, series: 3, reps: “8–10”, musculo: “Peito”, obs: “Espessura total — amplitude máxima” },
{ nome: “Remada Neutra no Cabo”, series: 3, reps: “8–10”, musculo: “Costas”, obs: “Largura + espessura sem stress na lombar” },
{ nome: “Desenvolvimento (Halteres)”, series: 3, reps: “8–10”, musculo: “Ombro”, obs: “Força do deltóide — V-shape” },
{ nome: “Elevação Lateral (Polia)”, series: 3, reps: “10–12”, musculo: “Ombro”, obs: “⭐ Tensão constante — fator nº1 de largura” },
{ nome: “Rosca Direta (Barra W)”, series: 3, reps: “8–10”, musculo: “Bíceps”, obs: “⭐ Base de força — supera semana anterior” },
{ nome: “Rosca Martelo (Polia/Corda)”, series: 2, reps: “10–12”, musculo: “Bíceps”, obs: “Braquial — braço de frente” },
{ nome: “Tríceps Pulley (Barra Reta)”, series: 3, reps: “8–10”, musculo: “Tríceps”, obs: “Densidade — carga progressiva” },
{ nome: “Tríceps Francês (Polia)”, series: 2, reps: “10–12”, musculo: “Tríceps”, obs: “Cabeça longa — massa e volume” },
];

const PLANO = {
A: {
label: “A”, foco: “Foco Pull”, cor: C.accent,
dias: [
{ id: “seg”, label: “SEG”, titulo: “PULL — Costas + Bíceps”, tag: “LARGURA + BRAÇO DE FRENTE”, cor: C.accent,
exercicios: [
{ nome: “Puxada Alta Aberta”, series: 3, reps: “8–10”, musculo: “Costas”, obs: “Principal de largura — redondo maior” },
{ nome: “Remada Curvada (Barra Livre)”, series: 3, reps: “6–8”, musculo: “Costas”, obs: “Força + espessura” },
{ nome: “Pull-Around Unilateral”, series: 2, reps: “10–12”, musculo: “Costas”, obs: “Dorsal isolada — foco no alongamento” },
{ nome: “Rosca Scott (Barra W)”, series: 3, reps: “8–10”, musculo: “Bíceps”, obs: “⭐ Pico do bíceps — zero balanço” },
{ nome: “Rosca 45° Inclinada (Halteres)”, series: 2, reps: “8–10”, musculo: “Bíceps”, obs: “Máximo alongamento — devagar na descida” },
{ nome: “Rosca Martelo (Halteres)”, series: 2, reps: “8–10”, musculo: “Bíceps”, obs: “Braquial + largura do braço de frente” },
]},
{ id: “ter”, label: “TER”, titulo: “LOWER 1 — Quadríceps”, tag: “FORÇA + VOLUME”, cor: C.orange,
exercicios: [
{ nome: “Agachamento Livre”, series: 4, reps: “6–8”, musculo: “Quad”, obs: “4 séries — composto mais eficiente” },
{ nome: “Leg Press 45°”, series: 3, reps: “10–12”, musculo: “Quad”, obs: “Pés baixos — foco total em quad” },
{ nome: “Cadeira Extensora”, series: 3, reps: “12–15”, musculo: “Quad”, obs: “Pausa 2s no topo” },
{ nome: “Cadeira Adutora”, series: 2, reps: “12–15”, musculo: “Adutor”, obs: “Interno da coxa” },
{ nome: “Panturrilha em Pé”, series: 4, reps: “12–15”, musculo: “Panturrilha”, obs: “Amplitude total — pausa no fundo” },
]},
{ id: “qua”, label: “QUA”, titulo: “PUSH — Peito + Ombro + Tríceps”, tag: “FORÇA + LARGURA”, cor: C.purple,
exercicios: [
{ nome: “Supino Inclinado (Halteres)”, series: 3, reps: “6–8”, musculo: “Peito”, obs: “Amplitude real — halteres superam Smith” },
{ nome: “Supino Reto (Barra)”, series: 3, reps: “8–10”, musculo: “Peito”, obs: “Base de espessura do peito” },
{ nome: “Crossover (Cima p/ Baixo)”, series: 2, reps: “12–15”, musculo: “Peito”, obs: “Detalhe inferior + pump final” },
{ nome: “Desenvolvimento (Halteres)”, series: 3, reps: “8–10”, musculo: “Ombro”, obs: “Força de ombro — V-shape começa aqui” },
{ nome: “Elevação Lateral”, series: 4, reps: “10–12”, musculo: “Ombro”, obs: “⭐ 4 séries — prioridade máxima” },
{ nome: “Tríceps Testa (Barra W)”, series: 3, reps: “8–10”, musculo: “Tríceps”, obs: “Massa bruta — cabeça longa” },
{ nome: “Tríceps Corda (Polia)”, series: 2, reps: “12–15”, musculo: “Tríceps”, obs: “Pico de contração” },
]},
{ id: “qui”, label: “QUI”, titulo: “LOWER 2 — Posterior + Glúteo”, tag: “FORÇA BRUTA”, cor: C.green,
exercicios: [
{ nome: “Stiff (Barra)”, series: 4, reps: “6–8”, musculo: “Posterior”, obs: “4 séries — técnica impecável” },
{ nome: “Mesa Flexora”, series: 3, reps: “10–12”, musculo: “Posterior”, obs: “3s excêntrico — onde mais cresce” },
{ nome: “Cadeira Flexora”, series: 3, reps: “12–15”, musculo: “Posterior”, obs: “Pico de contração — isolamento final” },
{ nome: “Agachamento Búlgaro (Halteres)”, series: 2, reps: “10–12”, musculo: “Glúteo”, obs: “Unilateral — corrige desequilíbrio” },
{ nome: “Cadeira Abdutora”, series: 2, reps: “15”, musculo: “Glúteo”, obs: “Glúteo médio” },
{ nome: “Panturrilha Sentado”, series: 4, reps: “12–15”, musculo: “Panturrilha”, obs: “Sóleo — estímulo diferente da Terça” },
]},
{ id: “sex”, label: “SEX ⭐”, titulo: “UPPER — Peito + Costas + Ombro + Braços”, tag: “⭐ FOCO BRAÇOS”, cor: C.gold, exercicios: SEXTA_EX },
],
},
B: {
label: “B”, foco: “Foco Push”, cor: C.orange,
dias: [
{ id: “seg”, label: “SEG”, titulo: “PUSH — Peito + Ombro + Tríceps”, tag: “FORÇA SUPERIOR”, cor: C.purple,
exercicios: [
{ nome: “Supino Inclinado (Halteres)”, series: 3, reps: “6–8”, musculo: “Peito”, obs: “Começa pesado — energia máxima” },
{ nome: “Supino Reto (Barra)”, series: 3, reps: “8–10”, musculo: “Peito”, obs: “3 séries — cadência 3s descida” },
{ nome: “Crossover (Cima p/ Baixo)”, series: 2, reps: “12–15”, musculo: “Peito”, obs: “Detalhe inferior do peito” },
{ nome: “Desenvolvimento (Halteres)”, series: 3, reps: “8–10”, musculo: “Ombro”, obs: “Força de ombro — prioridade Sem. B” },
{ nome: “Elevação Lateral”, series: 4, reps: “10–12”, musculo: “Ombro”, obs: “⭐ 4 séries — jamais cortar” },
{ nome: “Tríceps Testa (Barra W)”, series: 3, reps: “8–10”, musculo: “Tríceps”, obs: “Massa bruta — cabeça longa” },
{ nome: “Tríceps Corda (Polia)”, series: 2, reps: “12–15”, musculo: “Tríceps”, obs: “Pico de contração” },
]},
{ id: “ter”, label: “TER”, titulo: “LOWER 1 — Quadríceps”, tag: “FORÇA + VOLUME”, cor: C.orange,
exercicios: [
{ nome: “Agachamento Livre”, series: 4, reps: “6–8”, musculo: “Quad”, obs: “4 séries — supera semana anterior” },
{ nome: “Leg Press 45°”, series: 3, reps: “10–12”, musculo: “Quad”, obs: “Pés baixos — quad em foco” },
{ nome: “Cadeira Extensora”, series: 3, reps: “12–15”, musculo: “Quad”, obs: “Pausa 2s no topo” },
{ nome: “Cadeira Adutora”, series: 2, reps: “12–15”, musculo: “Adutor”, obs: “Interno da coxa” },
{ nome: “Panturrilha em Pé”, series: 4, reps: “12–15”, musculo: “Panturrilha”, obs: “Amplitude total” },
]},
{ id: “qua”, label: “QUA”, titulo: “PULL — Costas + Bíceps”, tag: “LARGURA + BRAÇO DE FRENTE”, cor: C.accent,
exercicios: [
{ nome: “Puxada Alta Aberta”, series: 3, reps: “8–10”, musculo: “Costas”, obs: “Redondo maior — puxa pro peito” },
{ nome: “Remada Curvada (Barra Livre)”, series: 3, reps: “6–8”, musculo: “Costas”, obs: “Força — cotovelo rente ao corpo” },
{ nome: “Pull-Around Unilateral”, series: 2, reps: “10–12”, musculo: “Costas”, obs: “Dorsal isolada — sem rotação” },
{ nome: “Rosca Scott (Barra W)”, series: 3, reps: “8–10”, musculo: “Bíceps”, obs: “⭐ Pico — supera carga da Sem. A” },
{ nome: “Rosca 45° Inclinada (Halteres)”, series: 2, reps: “8–10”, musculo: “Bíceps”, obs: “Máximo alongamento” },
{ nome: “Rosca Martelo (Halteres)”, series: 2, reps: “8–10”, musculo: “Bíceps”, obs: “Braço de frente — braquial” },
]},
{ id: “qui”, label: “QUI”, titulo: “LOWER 2 — Posterior + Glúteo”, tag: “FORÇA BRUTA”, cor: C.green,
exercicios: [
{ nome: “Stiff (Barra)”, series: 4, reps: “6–8”, musculo: “Posterior”, obs: “Nunca arredonda a lombar” },
{ nome: “Mesa Flexora”, series: 3, reps: “10–12”, musculo: “Posterior”, obs: “Excêntrico lento — 3s” },
{ nome: “Cadeira Flexora”, series: 3, reps: “12–15”, musculo: “Posterior”, obs: “Isolamento final” },
{ nome: “Agachamento Búlgaro (Halteres)”, series: 2, reps: “10–12”, musculo: “Glúteo”, obs: “Joelho não passa o pé” },
{ nome: “Cadeira Abdutora”, series: 2, reps: “15”, musculo: “Glúteo”, obs: “Glúteo médio” },
{ nome: “Panturrilha Sentado”, series: 4, reps: “12–15”, musculo: “Panturrilha”, obs: “Sóleo” },
]},
{ id: “sex”, label: “SEX ⭐”, titulo: “UPPER — Peito + Costas + Ombro + Braços”, tag: “⭐ FOCO BRAÇOS”, cor: C.gold, exercicios: SEXTA_EX },
],
},
};

const MAV_DATA = [
{ musculo: “Peito”, series: 14, mev: 10, mav_min: 12, mav_max: 20, mrv: 22, cor: C.purple, freq: “2x” },
{ musculo: “Costas”, series: 16, mev: 10, mav_min: 14, mav_max: 22, mrv: 25, cor: C.accent, freq: “2x” },
{ musculo: “Deltóide”, series: 16, mev: 8, mav_min: 16, mav_max: 22, mrv: 26, cor: C.orange, freq: “2x” },
{ musculo: “Bíceps”, series: 14, mev: 8, mav_min: 14, mav_max: 20, mrv: 26, cor: C.gold, freq: “2x” },
{ musculo: “Tríceps”, series: 12, mev: 6, mav_min: 10, mav_max: 14, mrv: 18, cor: C.gold, freq: “2x” },
{ musculo: “Quadríceps”, series: 12, mev: 8, mav_min: 12, mav_max: 18, mrv: 20, cor: C.green, freq: “1x” },
{ musculo: “Post. Coxa”, series: 12, mev: 6, mav_min: 10, mav_max: 16, mrv: 20, cor: C.green, freq: “2x” },
{ musculo: “Glúteo”, series: 8, mev: 0, mav_min: 8, mav_max: 16, mrv: 20, cor: C.green, freq: “2x” },
{ musculo: “Panturrilha”, series: 10, mev: 6, mav_min: 8, mav_max: 16, mrv: 20, cor: C.green, freq: “2x” },
];

const DIAS_ORDER = [“seg”, “ter”, “qua”, “qui”, “sex”];

// ─── COMPONENTES ──────────────────────────────────────────────────────────────

function SerieInput({ semana, ciclo, diaId, exIdx, serieIdx, cor }) {
const baseKey = `imp_c${ciclo}_${semana}_${diaId}_${exIdx}_${serieIdx}`;
const [kg, setKg] = useState(() => store.get(baseKey + “_kg”, “”));
const [rep, setRep] = useState(() => store.get(baseKey + “_rep”, “”));
const filled = kg !== “” || rep !== “”;

const inp = (extra = {}) => ({
width: “50px”, background: filled ? `${cor}10` : “#0a1520”,
border: `1px solid ${filled ? cor + "60" : cor + "25"}`,
borderRadius: “6px”, color: C.text, fontSize: “13px”,
fontWeight: “700”, textAlign: “center”, padding: “6px 4px”,
fontFamily: “monospace”, outline: “none”, …extra,
});

return (
<div style={{ display: “flex”, flexDirection: “column”, alignItems: “center”, gap: “3px” }}>
<div style={{ fontSize: “8px”, color: C.muted, letterSpacing: “1px” }}>S{serieIdx + 1}</div>
<input style={inp()} placeholder=“kg” value={kg} type=“number”
onChange={e => { setKg(e.target.value); store.set(baseKey + “_kg”, e.target.value); }} />
<input style={inp()} placeholder=“rep” value={rep} type=“number”
onChange={e => { setRep(e.target.value); store.set(baseKey + “_rep”, e.target.value); }} />
</div>
);
}

function ExCard({ ex, exIdx, diaId, semana, ciclo, cor }) {
const obsKey = `imp_c${ciclo}_${semana}_${diaId}_${exIdx}_obs`;
const [obs, setObs] = useState(() => store.get(obsKey, “”));
const mc = { Peito: C.purple, Costas: C.accent, Ombro: C.orange, Bíceps: C.gold, Tríceps: C.gold }[ex.musculo] || C.green;

return (
<div style={{
background: C.card, borderRadius: “12px”,
border: `1px solid ${C.border}`, borderLeft: `3px solid ${cor}`,
marginBottom: “10px”, overflow: “hidden”,
}}>
<div style={{ padding: “12px 14px 8px”, borderBottom: `1px solid ${C.border}` }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div style={{ flex: 1 }}>
<div style={{ fontSize: “14px”, fontWeight: “800”, color: C.text, marginBottom: “2px” }}>{ex.nome}</div>
<div style={{ fontSize: “11px”, color: C.muted, lineHeight: 1.4 }}>{ex.obs}</div>
</div>
<div style={{ textAlign: “right”, marginLeft: “10px”, flexShrink: 0 }}>
<div style={{
background: `${mc}15`, border: `1px solid ${mc}40`,
color: mc, fontSize: “9px”, letterSpacing: “2px”,
padding: “2px 7px”, borderRadius: “4px”, fontWeight: “800”, marginBottom: “4px”,
}}>{ex.musculo}</div>
<div style={{ fontSize: “11px”, color: C.muted }}>
<span style={{ color: cor, fontWeight: “900”, fontSize: “17px” }}>{ex.series}</span>
<span style={{ color: C.muted }}> × </span>
<span style={{ color: C.text }}>{ex.reps}</span>
</div>
</div>
</div>
</div>
<div style={{ padding: “10px 14px”, display: “flex”, gap: “8px”, overflowX: “auto”, alignItems: “flex-end” }}>
{Array.from({ length: ex.series }).map((_, si) => (
<SerieInput key={si} semana={semana} ciclo={ciclo} diaId={diaId} exIdx={exIdx} serieIdx={si} cor={cor} />
))}
<div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: “10px”, marginLeft: “4px” }}>
<div style={{ fontSize: “9px”, color: C.muted, marginBottom: “4px” }}>NOTA</div>
<textarea
rows={2}
style={{
width: “90px”, background: “#0a1520”, border: `1px solid ${C.border}`,
borderRadius: “6px”, color: C.muted, fontSize: “10px”,
padding: “5px 7px”, fontFamily: “monospace”, outline: “none”, resize: “none”,
}}
placeholder=“anotação…”
value={obs}
onChange={e => { setObs(e.target.value); store.set(obsKey, e.target.value); }}
/>
</div>
</div>
</div>
);
}

function MavBar({ m }) {
const pct = Math.min((m.series / m.mrv) * 100, 100);
const mavS = (m.mav_min / m.mrv) * 100;
const mavE = (m.mav_max / m.mrv) * 100;
return (
<div style={{
background: C.card, border: `1px solid ${C.border}`,
borderLeft: `3px solid ${m.cor}`, borderRadius: “10px”,
padding: “14px”, marginBottom: “10px”,
}}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: “8px” }}>
<div>
<span style={{ fontSize: “14px”, fontWeight: “900”, color: C.text }}>{m.musculo}</span>
<span style={{ fontSize: “10px”, color: C.muted, marginLeft: “8px” }}>{m.freq}/sem</span>
</div>
<div style={{ textAlign: “right” }}>
<div style={{ fontSize: “10px”, color: C.green, fontWeight: “800” }}>MAV ✅</div>
<div style={{ fontSize: “20px”, fontWeight: “900”, color: m.cor, lineHeight: 1 }}>{m.series}</div>
<div style={{ fontSize: “9px”, color: C.muted }}>séries/sem</div>
</div>
</div>
<div style={{ position: “relative”, marginBottom: “4px” }}>
<div style={{
position: “absolute”, top: 0, bottom: 0,
left: `${mavS}%`, width: `${mavE - mavS}%`,
background: `${C.green}18`, borderRadius: “4px”,
}} />
<div style={{ background: C.dim, borderRadius: “6px”, height: “6px”, overflow: “hidden” }}>
<div style={{ height: “100%”, width: `${pct}%`, background: m.cor, borderRadius: “6px” }} />
</div>
</div>
<div style={{ display: “flex”, justifyContent: “space-between”, fontSize: “9px”, color: C.muted }}>
<span>MEV {m.mev}</span>
<span style={{ color: `${C.green}80` }}>MAV {m.mav_min}–{m.mav_max}</span>
<span>MRV {m.mrv}</span>
</div>
</div>
);
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
// ciclo = número da semana desde o início (0 = primeira)
// semana = “A” ou “B” — alterna automaticamente
const [ciclo, setCiclo] = useState(() => store.get(“imp_ciclo”, 0));
const [diasConcluidos, setDiasConcluidos] = useState(() => store.get(“imp_dias_concluidos”, []));
const [diaId, setDiaId] = useState(“seg”);
const [aba, setAba] = useState(“treino”);
const [confirmReset, setConfirmReset] = useState(false);

const semana = ciclo % 2 === 0 ? “A” : “B”;
const semAtual = PLANO[semana];
const dia = semAtual.dias.find(d => d.id === diaId);
const totalDias = semAtual.dias.length;
const diasFeitos = diasConcluidos.length;

const marcarDiaConcluido = () => {
if (diasConcluidos.includes(diaId)) return;
const novos = […diasConcluidos, diaId];
setDiasConcluidos(novos);
store.set(“imp_dias_concluidos”, novos);

```
// Avança para o próximo dia automaticamente
const idx = DIAS_ORDER.indexOf(diaId);
if (idx < DIAS_ORDER.length - 1) setDiaId(DIAS_ORDER[idx + 1]);
```

};

const avancarSemana = () => {
const novoCiclo = ciclo + 1;
setCiclo(novoCiclo);
setDiasConcluidos([]);
setDiaId(“seg”);
store.set(“imp_ciclo”, novoCiclo);
store.set(“imp_dias_concluidos”, []);
setConfirmReset(false);
};

const semanaCompleta = diasConcluidos.length >= totalDias;

return (
<div style={{ minHeight: “100vh”, background: C.bg, color: C.text, fontFamily: “monospace”, maxWidth: “480px”, margin: “0 auto” }}>

```
  {/* HEADER */}
  <div style={{
    padding: "22px 20px 14px",
    borderBottom: `1px solid ${C.border}`,
    background: `linear-gradient(180deg, #0D1B2A 0%, ${C.bg} 100%)`,
  }}>
    <div style={{ fontSize: "9px", letterSpacing: "5px", color: C.muted, marginBottom: "4px" }}>PROTOCOLO CIENTÍFICO</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div>
        <h1 style={{ margin: "0 0 2px", fontSize: "24px", fontWeight: "900", letterSpacing: "-1px" }}>
          <span style={{ color: C.accent }}>IMPARÁVEL</span>
        </h1>
        <div style={{ fontSize: "10px", color: C.muted, letterSpacing: "2px" }}>
          PPL + LOWER DUPLO · MAV OTIMIZADO
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{
          background: `${semAtual.cor}15`, border: `1px solid ${semAtual.cor}40`,
          color: semAtual.cor, fontSize: "11px", fontWeight: "900",
          padding: "6px 12px", borderRadius: "8px", letterSpacing: "1px",
        }}>
          SEM {semana} · C{ciclo + 1}
        </div>
      </div>
    </div>

    {/* Barra de progresso da semana */}
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: C.muted, marginBottom: "4px" }}>
        <span>PROGRESSO DA SEMANA</span>
        <span style={{ color: semAtual.cor }}>{diasFeitos}/{totalDias} DIAS</span>
      </div>
      <div style={{ background: C.dim, borderRadius: "6px", height: "4px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "6px",
          width: `${(diasFeitos / totalDias) * 100}%`,
          background: semanaCompleta ? C.green : semAtual.cor,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  </div>

  {/* ABAS */}
  <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
    {[{ id: "treino", label: "TREINO" }, { id: "mav", label: "VOLUME MAV" }].map(a => (
      <button key={a.id} onClick={() => setAba(a.id)} style={{
        flex: 1, padding: "12px 8px",
        border: "none", borderBottom: aba === a.id ? `2px solid ${C.gold}` : "2px solid transparent",
        background: "transparent", color: aba === a.id ? C.gold : C.muted,
        fontSize: "10px", fontWeight: "800", letterSpacing: "3px",
        cursor: "pointer", fontFamily: "monospace",
      }}>{a.label}</button>
    ))}
  </div>

  {/* ══ TREINO ══ */}
  {aba === "treino" && (
    <>
      {/* Banner semana completa */}
      {semanaCompleta && (
        <div style={{
          margin: "12px 20px 0",
          background: `${C.green}15`, border: `1px solid ${C.green}50`,
          borderRadius: "10px", padding: "14px 16px",
        }}>
          <div style={{ fontSize: "14px", fontWeight: "900", color: C.green, marginBottom: "4px" }}>
            🏆 SEMANA {semana} CONCLUÍDA!
          </div>
          <div style={{ fontSize: "11px", color: C.muted, marginBottom: "12px" }}>
            Próxima: <strong style={{ color: semana === "A" ? C.orange : C.accent }}>Semana {semana === "A" ? "B" : "A"} — {semana === "A" ? "Foco Push" : "Foco Pull"}</strong>
          </div>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={{
              width: "100%", padding: "10px", background: C.green,
              border: "none", borderRadius: "8px", color: "#000",
              fontSize: "12px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px",
            }}>
              AVANÇAR PARA PRÓXIMA SEMANA →
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={avancarSemana} style={{
                flex: 1, padding: "10px", background: C.green,
                border: "none", borderRadius: "8px", color: "#000",
                fontSize: "11px", fontWeight: "900", cursor: "pointer",
              }}>CONFIRMAR ✓</button>
              <button onClick={() => setConfirmReset(false)} style={{
                flex: 1, padding: "10px", background: "transparent",
                border: `1px solid ${C.border}`, borderRadius: "8px", color: C.muted,
                fontSize: "11px", cursor: "pointer",
              }}>CANCELAR</button>
            </div>
          )}
        </div>
      )}

      {/* Dias */}
      <div style={{ display: "flex", gap: "6px", padding: "12px 20px", overflowX: "auto", borderBottom: `1px solid ${C.border}` }}>
        {semAtual.dias.map(d => {
          const feito = diasConcluidos.includes(d.id);
          const ativo = diaId === d.id;
          return (
            <button key={d.id} onClick={() => setDiaId(d.id)} style={{
              flexShrink: 0, padding: "7px 11px",
              border: `1px solid ${ativo ? d.cor : feito ? `${C.green}60` : C.border}`,
              borderRadius: "7px",
              background: ativo ? `${d.cor}15` : feito ? `${C.green}10` : "transparent",
              color: ativo ? d.cor : feito ? C.green : C.muted,
              fontSize: "10px", fontWeight: "800", letterSpacing: "1px",
              cursor: "pointer", position: "relative",
            }}>
              {d.label}
              {feito && <span style={{ position: "absolute", top: "-4px", right: "-4px", fontSize: "8px" }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      {dia && (
        <div style={{ padding: "16px 20px 100px" }}>
          <div style={{ marginBottom: "14px", paddingBottom: "12px", borderBottom: `1px solid ${dia.cor}20` }}>
            <div style={{
              display: "inline-block",
              background: `${dia.cor}15`, border: `1px solid ${dia.cor}35`,
              color: dia.cor, fontSize: "9px", letterSpacing: "3px",
              padding: "3px 10px", borderRadius: "4px", marginBottom: "6px", fontWeight: "800",
            }}>{dia.tag}</div>
            <div style={{ fontSize: "17px", fontWeight: "900" }}>{dia.titulo}</div>
            <div style={{ fontSize: "11px", color: C.muted, marginTop: "3px" }}>
              {dia.exercicios.length} exercícios · {dia.exercicios.reduce((a, e) => a + e.series, 0)} séries
              {diasConcluidos.includes(diaId) && <span style={{ color: C.green, marginLeft: "8px" }}>✓ concluído</span>}
            </div>
          </div>

          {dia.exercicios.map((ex, i) => (
            <ExCard key={i} ex={ex} exIdx={i} diaId={diaId} semana={semana} ciclo={ciclo} cor={dia.cor} />
          ))}

          {/* Botão concluir dia */}
          {!diasConcluidos.includes(diaId) && (
            <button onClick={marcarDiaConcluido} style={{
              width: "100%", padding: "14px", marginTop: "8px",
              background: `linear-gradient(135deg, ${dia.cor}, ${dia.cor}CC)`,
              border: "none", borderRadius: "10px", color: "#000",
              fontSize: "13px", fontWeight: "900", cursor: "pointer",
              letterSpacing: "1px",
            }}>
              ✓ MARCAR DIA COMO CONCLUÍDO
            </button>
          )}
        </div>
      )}
    </>
  )}

  {/* ══ MAV ══ */}
  {aba === "mav" && (
    <div style={{ padding: "20px 20px 40px" }}>
      <div style={{ fontSize: "9px", letterSpacing: "4px", color: C.muted, marginBottom: "4px" }}>
        SCHOENFELD · ISRAETEL · SPORTS MEDICINE 2025
      </div>
      <div style={{ fontSize: "18px", fontWeight: "900", marginBottom: "4px" }}>Volume por músculo</div>
      <div style={{ fontSize: "11px", color: C.muted, marginBottom: "20px", lineHeight: 1.6 }}>
        MAV = faixa de máximos ganhos. MEV = mínimo pra crescer. MRV = acima disso você regride.
      </div>
      {MAV_DATA.map((m, i) => <MavBar key={i} m={m} />)}
      <div style={{
        marginTop: "16px", background: C.card,
        border: `1px solid ${C.green}40`, borderRadius: "10px", padding: "16px",
      }}>
        <div style={{ fontSize: "13px", fontWeight: "800", color: C.green, marginBottom: "6px" }}>
          ✅ 9/9 grupos no MAV — Protocolo validado
        </div>
        <div style={{ fontSize: "11px", color: C.muted, lineHeight: 1.7 }}>
          Volume alto o suficiente pra maximizar hipertrofia, baixo o suficiente pra recuperar e progredir toda semana. Frequência 2x em todos os grupos prioritários.
        </div>
      </div>
    </div>
  )}
</div>
```

);
}
