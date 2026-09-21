export function createPetalsMarkup(): string {
  return `<div class="petals" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>`
}

export function createBouquetMarkup(): string {
  const flowers = [
    [220, 57, 1], [170, 92, 0.76], [270, 92, 0.76], [120, 120, 0.72], [320, 120, 0.72],
    [80, 165, 0.65], [140, 155, 0.68], [190, 135, 0.65], [250, 135, 0.65], [300, 155, 0.68], [360, 165, 0.65],
    [100, 205, 0.58], [155, 195, 0.6], [190, 185, 0.58], [250, 185, 0.58], [285, 195, 0.6], [340, 205, 0.58],
    [180, 220, 0.52], [220, 210, 0.56], [260, 220, 0.52],
  ] as const

  const stems = flowers.map(([x, y]) => {
    const baseX = 220 + (x - 220) * 0.22
    return `<path class="stem" d="M220 330C220 ${Math.max(238, y + 48)} ${baseX} ${y + 30} ${x} ${y + 8}"/>`
  }).join('')

  return `
    <div class="bouquet" aria-label="Ramo de flores amarillas" role="img">
      <div class="glow"></div>
      <svg viewBox="0 0 440 390" class="bouquet-art" aria-hidden="true">
        <defs>
          <radialGradient id="petal-gold" cx="35%" cy="25%" r="80%"><stop offset="0" stop-color="#ffe98a"/><stop offset=".48" stop-color="#f8cf3d"/><stop offset="1" stop-color="#e9aa1e"/></radialGradient>
          <radialGradient id="center-gold" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#e6b83b"/><stop offset=".7" stop-color="#a87413"/><stop offset="1" stop-color="#80520f"/></radialGradient>
        </defs>
        ${stems}
        <path class="wrap" d="M139 265L301 265L274 368C246 383 194 383 166 368Z"/><path class="wrap-fold" d="M139 265L220 291L301 265L274 368C248 378 193 378 166 368Z"/><path class="wrap-line" d="M169 282L191 366M271 282L249 370"/>
        ${flowers.map(([x, y, scale], index) => flower(x, y, index === 0 ? 'flower-main' : 'flower-small', scale)).join('')}
      </svg>
    </div>`
}

function flower(x: number, y: number, className: string, scale: number): string {
  const petals = Array.from({ length: 8 }, (_, index) => `<ellipse class="petal" cx="0" cy="-17" rx="9.5" ry="19" transform="rotate(${index * 45})"/>`).join('')
  return `<g class="${className}" transform="translate(${x} ${y}) scale(${scale})"><g class="flower-motion">${petals}<circle class="flower-center" r="10"/><circle class="center-highlight" cx="-3" cy="-3" r="2.5"/></g></g>`
}