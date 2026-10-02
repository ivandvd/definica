// Standalone port of xdefi-ctrl-landing app/components/AppPopupBanner.vue @ f775542.
// Mounted on <body>, outside the Nuxt root, so it never touches hydration.
(function () {
  var CONFIG = {
    title: 'Thank you for being part of Ctrl Wallet.',
    body: [
      'As of August 19, 2026, Ctrl Wallet has been permanently shut down. It has been a privilege to serve you.',
      'Your assets are still yours. As long as you have your recovery phrase, you can import it into any compatible wallet and continue managing your funds.',
      '⚠️ Never share your recovery phrase with anyone. Ctrl Wallet will never ask for it and neither will any legitimate service.',
    ],
    ctaLabel: 'View the announcement',
    ctaUrl: 'https://ctrl.xyz/news/ctrl-wallet-deprecation-what-you-need-to-know/',
  }
  var STORAGE_KEY = 'popup_last_shown_v2'
  var ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

  function shouldShow () {
    try {
      var last = localStorage.getItem(STORAGE_KEY)
      var now = Date.now()
      if (last && now - parseInt(last, 10) < ONE_WEEK_MS) return false
      localStorage.setItem(STORAGE_KEY, String(now))
    } catch (e) {}
    return true
  }

  function el (tag, cls, text) {
    var n = document.createElement(tag)
    if (cls) n.className = cls
    if (text) n.textContent = text
    return n
  }

  function mount () {
    if (!shouldShow()) return

    var overlay = el('div', 'PopupBanner-overlay')
    var card = el('div', 'PopupBanner --landscape')
    card.setAttribute('role', 'dialog')
    card.setAttribute('aria-modal', 'true')

    var close = el('button', 'PopupBanner-close')
    close.setAttribute('aria-label', 'Close')
    close.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'

    var panels = el('div', 'PopupBanner-panels')
    var content = el('div', 'PopupBanner-content')
    var copy = el('div', 'PopupBanner-copy')
    copy.appendChild(el('h2', 'PopupBanner-title', CONFIG.title))
    CONFIG.body.forEach(function (line) { copy.appendChild(el('p', 'PopupBanner-body', line)) })
    var cta = el('a', 'PopupBanner-cta', CONFIG.ctaLabel)
    cta.href = CONFIG.ctaUrl
    cta.target = '_blank'
    cta.rel = 'noopener noreferrer'
    content.appendChild(copy)
    content.appendChild(cta)

    var deco = el('div', 'PopupBanner-deco')
    deco.innerHTML =
      '<div class="PopupBanner-fold"><div class="PopupBanner-fold-crop"><img src="/popup-sprite.png" alt="" class="PopupBanner-fold-img"></div></div>' +
      '<div class="PopupBanner-ball"><div class="PopupBanner-ball-crop"><img src="/popup-sprite.png" alt="" class="PopupBanner-ball-img"></div></div>' +
      '<img src="/popup-power-icon.png" alt="" class="PopupBanner-decoPower">'

    panels.appendChild(content)
    panels.appendChild(deco)
    card.appendChild(close)
    card.appendChild(panels)
    overlay.appendChild(card)
    document.body.appendChild(overlay)
    requestAnimationFrame(function () { requestAnimationFrame(function () { overlay.classList.add('is-open') }) })

    function hide () {
      overlay.classList.remove('is-open')
      setTimeout(function () { overlay.remove() }, 300)
      document.removeEventListener('keydown', onKey)
    }
    function onKey (e) { if (e.key === 'Escape') hide() }
    close.addEventListener('click', hide)
    overlay.addEventListener('click', function (e) { if (e.target === overlay) hide() })
    document.addEventListener('keydown', onKey)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
  else mount()
})()
