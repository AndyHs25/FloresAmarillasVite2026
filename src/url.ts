export function createGiftUrl(name: string): string {
  return `${window.location.origin}/flores?nombre=${encodeURIComponent(name)}`
}