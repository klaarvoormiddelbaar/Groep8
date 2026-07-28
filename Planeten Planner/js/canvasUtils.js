// Kleine gedeelde canvas-hulpfuncties voor de moderne UI (afgeronde panelen).

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

export function drawRoundedRect(ctx, x, y, width, height, radius, { fill, stroke, strokeWidth = 1.5 } = {}) {
  pathRoundedRect(ctx, x, y, width, height, radius);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}
