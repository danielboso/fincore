import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto"

const KEY_LENGTH = 64
const SALT_LENGTH = 16

/**
 * Hashes a password using scrypt.
 * Returns a string in the format salt:hash
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex")
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex")
  return `${salt}:${hash}`
}

/**
 * Verifies a password against a stored salt:hash string.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  
  const hashToVerify = scryptSync(password, salt, KEY_LENGTH)
  const originalHash = Buffer.from(hash, "hex")
  
  return timingSafeEqual(hashToVerify, originalHash)
}

/**
 * Generates a secure random session ID.
 */
export function generateSessionId(): string {
  return randomBytes(32).toString("hex")
}
