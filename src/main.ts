import './style.css'
import { normalizeName, validateName } from './validation'
import { createGiftUrl } from './url'
import { createBouquetMarkup, createPetalsMarkup } from './components'

const app = document.querySelector<HTMLDivElement>('#app')!
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const isGiftPage = window.location.pathname.replace(/\/$/, '') === `${basePath}/flores`
let backgroundAudio: HTMLAudioElement | null = null

async function toggleMusic(button: HTMLButtonElement): Promise<void> {
  if (!backgroundAudio) return
  if (!backgroundAudio.paused) {
    backgroundAudio.pause()
    button.textContent = '♫ Activar música'
    button.setAttribute('aria-pressed', 'false')
    return
  }
  try {
    await backgroundAudio.play()
    button.textContent = '♫ Pausar música'
    button.setAttribute('aria-pressed', 'true')
  } catch {
    button.textContent = '♫ Activar música'
    button.setAttribute('aria-pressed', 'false')
  }
}

function renderHome(): void {
  app.innerHTML = `
    <main class="home-shell">
      <section class="home-copy" aria-labelledby="home-title">
        <p class="eyebrow"><span class="eyebrow-dot"></span>Un detalle que florece</p>
        <h1 id="home-title">Regala un poco de <em>luz</em> amarilla.</h1>
        <p class="intro">Crea un enlace especial con flores para alegrarle el día a alguien que quieres.</p>
        <div class="promise-list" aria-label="Características del regalo">
          <span>Sin registro</span><span>Listo para compartir</span>
        </div>
      </section>
      <section class="creation-panel" aria-labelledby="creation-title">
        <div class="panel-heading">
          <span class="panel-kicker">Tu regalo digital</span>
          <h2 id="creation-title">¿Para quién florece?</h2>
        </div>
        <form id="gift-form" novalidate>
          <label for="name-input">Escribe su nombre</label>
          <div class="input-wrap">
            <input id="name-input" name="name" type="text" autocomplete="name" placeholder="Por ejemplo, Camila" maxlength="50" aria-describedby="name-hint name-error" />
            <span class="input-mark" aria-hidden="true">✦</span>
          </div>
          <p id="name-hint" class="field-hint">Puede ser un nombre compuesto.</p>
          <p id="name-error" class="field-error" role="alert"></p>
          <button class="primary-button" type="submit">Crear regalo <span aria-hidden="true">→</span></button>
        </form>
        <div id="result" class="result" hidden aria-live="polite"></div>
      </section>
    </main>
    <footer class="site-footer"><span>Hecho para compartir cariño</span><span aria-hidden="true">✳</span><span>Flores amarillas</span></footer>
  `

  const form = document.querySelector<HTMLFormElement>('#gift-form')!
  const input = document.querySelector<HTMLInputElement>('#name-input')!
  const error = document.querySelector<HTMLParagraphElement>('#name-error')!
  const result = document.querySelector<HTMLDivElement>('#result')!

  const updateValidation = (): boolean => {
    const validation = validateName(input.value)
    error.textContent = validation.error ?? ''
    input.setAttribute('aria-invalid', String(!validation.valid))
    return validation.valid
  }

  input.addEventListener('input', () => {
    if (input.value) updateValidation()
    else {
      error.textContent = ''
      input.removeAttribute('aria-invalid')
    }
    result.hidden = true
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!updateValidation()) return
    const name = normalizeName(input.value)
    const giftUrl = createGiftUrl(name)
    result.hidden = false
    result.innerHTML = `
      <p class="result-title">Tu regalo está listo <span aria-hidden="true">💛</span></p>
      <div class="link-row"><span class="generated-link"></span><button id="copy-link" class="icon-button" type="button" aria-label="Copiar enlace" title="Copiar enlace">⧉</button></div>
      <div class="result-actions"><a class="secondary-button" href="${giftUrl}">Ver regalo <span aria-hidden="true">↗</span></a><button id="share-link" class="text-button" type="button">Compartir</button></div>
      <p id="action-status" class="action-status" role="status"></p>
    `
    result.querySelector<HTMLElement>('.generated-link')!.textContent = giftUrl
    result.querySelector<HTMLButtonElement>('#copy-link')!.addEventListener('click', () => copyLink(giftUrl))
    result.querySelector<HTMLButtonElement>('#share-link')!.addEventListener('click', () => shareLink(giftUrl, name))
  })
}

async function copyLink(url: string): Promise<void> {
  const status = document.querySelector<HTMLParagraphElement>('#action-status')
  try {
    await navigator.clipboard.writeText(url)
    if (status) status.textContent = 'Enlace copiado.'
  } catch {
    if (status) status.textContent = 'No se pudo copiar. Puedes seleccionar el enlace.'
  }
}

async function shareLink(url: string, name: string): Promise<void> {
  const status = document.querySelector<HTMLParagraphElement>('#action-status')
  if (!navigator.share) {
    await copyLink(url)
    return
  }
  try {
    await navigator.share({ title: `Flores para ${name}`, text: `Un detalle amarillo para ${name}`, url })
  } catch {
    if (status) status.textContent = 'Puedes compartir el enlace cuando quieras.'
  }
}

function renderGift(): void {
  const params = new URLSearchParams(window.location.search)
  const rawName = params.get('nombre') ?? ''
  const validation = validateName(rawName)
  const name = validation.valid ? normalizeName(rawName) : ''
  document.title = name ? `Flores para ${name}` : 'Unas flores para ti'
  app.innerHTML = `
    <main class="gift-shell">
      ${createPetalsMarkup()}
      <a class="back-link" href="${basePath}/" aria-label="Volver a crear un regalo">← Crear otro regalo</a>
      <section class="gift-content" aria-labelledby="gift-title">
        <p class="eyebrow gift-eyebrow"><span class="eyebrow-dot"></span>Un detalle para ti</p>
        <h1 id="gift-title"><span class="gift-name"></span> <span aria-hidden="true">💛</span></h1>
        <p class="gift-subtitle">Hoy el día tiene un poquito más de luz.</p>
        <div class="bouquet-stage">
          <p class="floating-note note-one">Tu sonrisa ilumina todo</p>
          <p class="floating-note note-two">Hoy es un buen día para florecer</p>
          <p class="floating-note note-five">Mereces cosas bonitas</p>
          <p class="floating-note note-six">Que hoy te abrace la alegría</p>
          ${createBouquetMarkup()}
          <p class="floating-note note-seven">Tu luz se nota</p>
          <p class="floating-note note-eight">Siempre hay motivos para sonreír</p>
          <p class="floating-note note-three">Qué bonito que existas</p>
          <p class="floating-note note-four">Un detalle solo para ti</p>
        </div>
        <div class="phrases">
          <p>Unas flores amarillas para alegrar tu día.</p>
          <p>Espero que te recuerden lo especial que eres.</p>
          <p>Que nunca te falten motivos para sonreír.</p>
        </div>
      </section>
      <audio id="background-audio" loop preload="auto">
        <source src="${basePath}/s__s_s_mp3.mp3" type="audio/mpeg" />
      </audio>
      <div class="gift-tools">
        <button id="music-toggle" class="music-button" type="button" aria-pressed="false">♫ Activar música</button>
      </div>
      <p class="gift-signature">Con cariño, para hacerte sonreír</p>
    </main>
  `
  document.querySelector<HTMLElement>('.gift-name')!.textContent = name ? `Para ${name}` : 'Unas flores amarillas para ti'
  backgroundAudio = document.querySelector<HTMLAudioElement>('#background-audio')
  if (backgroundAudio) backgroundAudio.volume = 0.35
  document.querySelector<HTMLButtonElement>('#music-toggle')!.addEventListener('click', (event) => {
    void toggleMusic(event.currentTarget as HTMLButtonElement)
  })
}

if (isGiftPage) renderGift()
else renderHome()
