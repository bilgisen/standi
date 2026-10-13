// Generate Payload-compatible password hash
// Run locally: node generate-hash.js

const crypto = require('crypto')

const password = 'Sivas1917'
const N = 16384
const r = 8
const p = 1
const keylen = 64
const saltLen = 16

// Generate random salt
const salt = crypto.randomBytes(saltLen)

// Hash password using scrypt
const hash = crypto.scryptSync(password, salt, keylen, { N, r, p })

// Payload format: scrypt:$N$r$p$salt$hash (base64 encoded)
const payloadHash = `scrypt:$${N}$${r}$${p}$${salt.toString('base64')}$${hash.toString('base64')}`

console.log('Salt (base64):', salt.toString('base64'))
console.log('Hash (base64):', hash.toString('base64'))
console.log('Payload hash:', payloadHash)

// Also generate the JWT secret for reference
console.log('\nJWT secret should be:', 'sidea-secure-secret-key-2026')

// SQL to insert user
const sql = `
INSERT INTO users (email, salt, hash, login_attempts, created_at, updated_at)
VALUES (
  'hbkarabey@gmail.com',
  '${salt.toString('base64')}',
  '${payloadHash}',
  0,
  datetime('now'),
  datetime('now')
);
`

console.log('\nSQL to run:')
console.log(sql)