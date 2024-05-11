const crypto = require('crypto');

function generateSecretKey() {
  return crypto.randomBytes(32).toString('hex')
}

const secretKey = generateSecretKey();
console.log('Generated Secret Key:', secretKey);