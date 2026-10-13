INSERT INTO users (email, salt, hash, login_attempts, created_at, updated_at)
VALUES (
  'hbkarabey@gmail.com',
  '4cKS9l22eagUjh5RazOvuw==',
  'scrypt:$16384$8$1$4cKS9l22eagUjh5RazOvuw==$JfJXEWEDRYaAjdUhjouV1JipQmCCGyoGF/6BPiO1Xda7xKql5CKsi8hE8reb2T5dKXyUhuNrn94meaAp4QW/VA==',
  0,
  datetime('now'),
  datetime('now')
);