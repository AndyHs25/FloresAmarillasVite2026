export interface NameValidation {
  valid: boolean
  normalized: string
  error?: string
}

const allowedNamePattern = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$/

export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function validateName(value: string): NameValidation {
  const normalized = normalizeName(value)
  if (!normalized) return { valid: false, normalized, error: 'Escribe un nombre para crear el regalo.' }
  if (normalized.length < 2) return { valid: false, normalized, error: 'El nombre debe tener al menos 2 caracteres.' }
  if (normalized.length > 50) return { valid: false, normalized, error: 'El nombre no puede superar los 50 caracteres.' }
  if (!allowedNamePattern.test(normalized)) return { valid: false, normalized, error: 'Usa solo letras, espacios, guiones o apóstrofes.' }
  return { valid: true, normalized }
}