/**
 * Control center panel (theme / sidebar position / font size /
 * auxiliary readouts). Preferences are persisted in localStorage under
 * "bc_prefs"; the head bootstrap snippet in _config.butterfly.yml
 * re-applies the CSS classes before first paint.
 */
(function () {
  var KEY = 'bc_prefs'
  var root = document.documentElement
  var panel = document.getElementById('console')
  var mask = document.getElementById('console-mask')
  var openBtn = document.getElementById('console-switch')
  var closeBtn = document.getElementById('console-close')

  if (!panel || !mask) return

  var prefs = { theme: null, aside: 'right', font: 'small', fps: true, scroll: true }

  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    if (raw && typeof raw === 'object') {
      if (raw.theme === 'light' || raw.theme === 'dark' || raw.theme === 'system') prefs.theme = raw.theme
      if (raw.aside === 'left' || raw.aside === 'right') prefs.aside = raw.aside
      if (raw.font === 'small' || raw.font === 'large') prefs.font = raw.font
      if (typeof raw.fps === 'boolean') prefs.fps = raw.fps
      if (typeof raw.scroll === 'boolean') prefs.scroll = raw.scroll
    }
  } catch (e) {
    /* corrupted storage - fall back to defaults */
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs))
    } catch (e) {
      /* private mode */
    }
  }

  function systemIsDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  function effectiveTheme() {
    if (prefs.theme === 'system') return systemIsDark() ? 'dark' : 'light'
    if (prefs.theme === 'light' || prefs.theme === 'dark') return prefs.theme
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  }

  function writeTheme(mode) {
    root.setAttribute('data-theme', mode)
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0d0d0d' : '#ffffff')

    if (window.btf && btf.saveToLocal) btf.saveToLocal.set('theme', mode)
    if (window.btf && mode === 'dark' && typeof btf.activateDarkMode === 'function') btf.activateDarkMode()
    if (window.btf && mode === 'light' && typeof btf.activateLightMode === 'function') btf.activateLightMode()
  }

  function applyTheme(value) {
    if (value === 'system') {
      prefs.theme = 'system'
      writeTheme(systemIsDark() ? 'dark' : 'light')
    } else {
      prefs.theme = value
      writeTheme(value)
    }
    save()
    render()
  }

  function applyAside(value) {
    prefs.aside = value
    root.classList.toggle('aside-left', value === 'left')
    save()
    render()
  }

  function applyFont(value) {
    prefs.font = value
    root.classList.toggle('font-large', value === 'large')
    save()
    render()
  }

  function applyFlags() {
    root.classList.toggle('hide-fps', prefs.fps === false)
    root.classList.toggle('hide-scroll-percent', prefs.scroll === false)
  }

  function render() {
    var theme = effectiveTheme()

    var groups = panel.querySelectorAll('.console-btn-group[data-console]')
    for (var i = 0; i < groups.length; i++) {
      var kind = groups[i].getAttribute('data-console')
      var current = kind === 'theme' ? theme : kind === 'aside' ? prefs.aside : prefs.font
      var buttons = groups[i].querySelectorAll('.console-btn')
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.toggle('is-active', buttons[j].getAttribute('data-value') === current)
      }
    }

    var switches = panel.querySelectorAll('.console-switch[data-console="toggle"]')
    for (var k = 0; k < switches.length; k++) {
      var flag = switches[k].getAttribute('data-value')
      switches[k].classList.toggle('is-active', prefs[flag] !== false)
    }
  }

  function open() {
    panel.classList.add('show')
    mask.classList.add('show')
  }

  function close() {
    panel.classList.remove('show')
    mask.classList.remove('show')
  }

  if (openBtn) openBtn.addEventListener('click', open)
  if (closeBtn) closeBtn.addEventListener('click', close)
  mask.addEventListener('click', close)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close()
  })

  panel.addEventListener('click', function (e) {
    var target = e.target
    if (!target || !target.closest) return

    var btn = target.closest('.console-btn')
    if (btn && panel.contains(btn)) {
      var group = btn.closest('.console-btn-group')
      var kind = group && group.getAttribute('data-console')
      var value = btn.getAttribute('data-value')
      if (kind === 'theme') applyTheme(value)
      else if (kind === 'aside') applyAside(value)
      else if (kind === 'font') applyFont(value)
      return
    }

    var sw = target.closest('.console-switch')
    if (sw && panel.contains(sw) && sw.getAttribute('data-console') === 'toggle') {
      var flag = sw.getAttribute('data-value')
      prefs[flag] = prefs[flag] === false
      applyFlags()
      save()
      render()
    }
  })

  applyFlags()
  render()
})()
