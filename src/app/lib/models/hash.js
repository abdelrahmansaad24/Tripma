import crypto from 'node:crypto';

export function hashUserPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');

  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return hashedPassword.toString('hex') + ':' + salt;
}

export function verifyPassword(storedPassword, suppliedPassword) {
  const [hashedPassword, salt] = storedPassword.split(':');
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);
  console.log(hashedPasswordBuf);
  console.log(suppliedPasswordBuf);
  console.log(crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf));
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
