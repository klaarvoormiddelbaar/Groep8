const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[character]);
}

export default async function contact(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Methode niet toegestaan.' });
  }

  const origin = req.headers.origin;
  const allowedOrigins = new Set([
    'https://klaarvoormiddelbaar.nl',
    'https://www.klaarvoormiddelbaar.nl'
  ]);
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ success: false, message: 'Ongeldige herkomst.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY ontbreekt.');
    return res.status(503).json({ success: false, message: 'De mailservice is nog niet ingesteld.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    return res.status(400).json({ success: false, message: 'Ongeldige aanvraag.' });
  }
  if (clean(body.website, 200)) {
    return res.status(200).json({ success: true });
  }

  const naam = clean(body.naam, 100);
  const school = clean(body.school, 150);
  const email = clean(body.email, 254);
  const telefoon = clean(body.telefoon, 50);
  const bericht = clean(body.bericht, 4000);

  if (!naam || !school || !EMAIL_PATTERN.test(email) || !bericht) {
    return res.status(400).json({ success: false, message: 'Controleer de verplichte velden.' });
  }

  const from = process.env.CONTACT_FROM_EMAIL || 'Klaar voor Middelbaar <contact@klaarvoormiddelbaar.nl>';
  const to = process.env.CONTACT_TO_EMAIL || 'contact@klaarvoormiddelbaar.nl';
  const html = `
    <h2>Nieuwe aanvraag via Klaar voor Middelbaar</h2>
    <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
    <p><strong>School:</strong> ${escapeHtml(school)}</p>
    <p><strong>E-mailadres:</strong> ${escapeHtml(email)}</p>
    <p><strong>Telefoonnummer:</strong> ${escapeHtml(telefoon || 'Niet ingevuld')}</p>
    <p><strong>Bericht:</strong></p>
    <p>${escapeHtml(bericht).replace(/\n/g, '<br>')}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Nieuwe aanvraag van ${naam} – ${school}`,
        html
      })
    });

    if (!response.ok) {
      console.error('Resend weigerde de e-mail:', response.status, await response.text());
      return res.status(502).json({ success: false, message: 'De e-mail kon niet worden verzonden.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contactformulier mislukt:', error);
    return res.status(502).json({ success: false, message: 'De e-mail kon niet worden verzonden.' });
  }
};
