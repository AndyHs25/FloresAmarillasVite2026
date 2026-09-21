export function createGiftUrl(name: string): string {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${window.location.origin}${basePath}/flores?nombre=${encodeURIComponent(name)}`
}