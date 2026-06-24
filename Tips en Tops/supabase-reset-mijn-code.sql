-- Verwijder jouw bestaande Tips en Tops-code, zodat er een nieuwe oplopende code
-- (0178, 0179, ...) wordt aangemaakt zodra je de deel-pagina opnieuw opent.
-- Vul hieronder je eigen inlog-e-mailadres in en draai dit in de SQL Editor.

DELETE FROM tips_en_tops_links
WHERE leerkracht_id = (
  SELECT id FROM auth.users WHERE email = 'niekheselmans@gmail.com'
);
