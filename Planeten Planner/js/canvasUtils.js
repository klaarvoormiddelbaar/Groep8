// Kleine gedeelde canvas-hulpfuncties voor de moderne UI (afgeronde panelen,
// knoppen, schaduwen). Eén plek voor deze bouwstenen zodat elk scherm er
// automatisch hetzelfde uitziet in plaats van per scherm opnieuw uitgevonden.

import { THEME } from './theme.js';

// radius: getal (alle hoeken gelijk) of { tl, tr, br, bl } voor per-hoek controle
// (bijv. alleen de bovenkant afronden voor een paneel dat op iets anders aansluit).
export function pathRoundedRect(ctx, x, y, width, height, radius) {
  const r = typeof radius === 'number' ? { tl: radius, tr: radius, br: radius, bl: radius } : radius;

  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.arcTo(x + width, y, x + width, y + r.tr, r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.arcTo(x + width, y + height, x + width - r.br, y + height, r.br);
  ctx.lineTo(x + r.bl, y + height);
  ctx.arcTo(x, y + height, x, y + height - r.bl, r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.arcTo(x, y, x + r.tl, y, r.tl);
  ctx.closePath();
}

// shadow: optioneel { color, blur, offsetY } (zie THEME.shadow) — laat de vorm
// echt van de achtergrond af 'zweven' i.p.v. er plat bovenop te liggen. De
// schaduw wordt alleen op de fill toegepast (niet op de stroke), anders wordt
// de rand zelf wazig.
export function drawRoundedRect(ctx, x, y, width, height, radius, { fill, stroke, strokeWidth = 1.5, shadow } = {}) {
  pathRoundedRect(ctx, x, y, width, height, radius);
  if (fill) {
    if (shadow) {
      ctx.save();
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur;
      ctx.shadowOffsetY = shadow.offsetY ?? 0;
      ctx.shadowOffsetX = shadow.offsetX ?? 0;
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = fill;
      ctx.fill();
    }
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

// Gedeelde pil-knop: dezelfde stijl overal waar een klikbare actie nodig is
// (start/verder/opnieuw spelen/volgende week). Standaard het KvM-merkgroen met
// witte tekst en een zachte groene gloed eronder — precies de 'Primary Submit'
// knop uit de StyleGuide (§7.7), vertaald naar canvas.
export function drawPillButton(
  ctx,
  rect,
  label,
  { fill = THEME.color.accentGreen, textColor = '#ffffff', font = 'bold 16px \'Inria Sans\', sans-serif', shadow = THEME.shadow.glowGreen } = {}
) {
  drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, rect.height / 2, {
    fill,
    stroke: 'rgba(255, 255, 255, 0.3)',
    strokeWidth: 1,
    shadow
  });

  ctx.fillStyle = textColor;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 5);
}

// Kleine statistiek-kaart: label boven, groot getal onder — gebruikt op het
// weekoverzicht en het game-over-scherm zodat cijfers in één oogopslag opvallen.
export function drawStatCard(ctx, x, y, width, height, label, value, { accent = THEME.color.textPrimary } = {}) {
  drawRoundedRect(ctx, x, y, width, height, THEME.radius.sm, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.border,
    strokeWidth: 1,
    shadow: THEME.shadow.chip
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '10px \'Inria Sans\', sans-serif';
  ctx.fillText(label.toUpperCase(), x + width / 2, y + 18);

  ctx.fillStyle = accent;
  ctx.font = 'bold 20px \'Inria Sans\', sans-serif';
  ctx.fillText(String(value), x + width / 2, y + height - 14);
}
