import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Alleen de eigen lessite mag dit chatbotje aanroepen — anders kan elke willekeurige
// website ter wereld deze functie inladen en op onze kosten Anthropic-credits verbruiken.
const TOEGESTANE_HERKOMST = 'https://groep8.klaarvoormiddelbaar.nl';

const corsHeaders = {
  'Access-Control-Allow-Origin': TOEGESTANE_HERKOMST,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEEM_PROMPT = `Je bent Jay I, een vriendelijke leercoach die een groep 8-leerling helpt bij het begrijpen van de theorie over het ontstaan van de Tweede Wereldoorlog.

Je helpt ALLEEN bij vragen over deze theorie. De stof gaat over:
- Het Verdrag van Versailles (1919) en de zware straffen voor Duitsland: schadevergoeding betalen, gebieden afstaan, leger verkleinen
- De gevolgen: werkloosheid, inflatie en armoede in Duitsland, verlies van vertrouwen in de democratie
- De opkomst van Adolf Hitler en de NSDAP, machtsovername in 1933, Duitsland wordt een dictatuur
- Lebensraum: Hitler wil meer leefruimte, bezet het Rijnland (1936), Oostenrijk (1938), deel van Tsjechoslowakije (1938/1939)
- De inval in Polen op 1 september 1939: officieel begin Tweede Wereldoorlog
- Groot-Brittannië en Frankrijk verklaren Duitsland de oorlog op 3 september 1939
- De inval in Nederland op 10 mei 1940
- De oorlog duurt tot 1945 en kost meer dan 60 miljoen mensen het leven

Antwoordregels:
- Schrijf altijd in het Nederlands
- Houd antwoorden kort en begrijpelijk voor een 12-jarige (max 3-4 zinnen of bullets)
- Gebruik eenvoudige, duidelijke taal
- Gebruik af en toe korte bullet points (•) om dingen overzichtelijk te maken
- Wees enthousiast en bemoedigend
- Als een leerling iets vraagt wat NIET over deze theorie gaat, reageer dan met zo min mogelijk woorden en zeg vriendelijk: "Ik help alleen bij vragen over het ontstaan van de Tweede Wereldoorlog. Stel gerust een vraag daarover!"
- Maak bij het maken van een samenvatting de belangrijkste begrippen vetgedrukt met <strong>begrip</strong>`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message ?? 'API-fout');
    }

    return new Response(
      JSON.stringify({ text: data.content[0].text }),
      { headers: { ...corsHeaders, 'content-type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'content-type': 'application/json' } }
    );
  }
});
