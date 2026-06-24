-- Diagnose: staat er nog een rij in tips_en_tops_links voor dit account?
SELECT u.email, l.code, l.aangemaakt_op
FROM auth.users u
LEFT JOIN tips_en_tops_links l ON l.leerkracht_id = u.id
WHERE u.email = 'niekheselmans@gmail.com';
