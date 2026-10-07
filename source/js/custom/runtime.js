/**
 * Site uptime counter rendered in the footer (#count-time).
 * The start date comes from the data-start attribute written by
 * themes/butterfly/layout/includes/footer.pug.
 */
(function () {
  var el = document.getElementById('count-time')
  if (!el) return

  var start = Date.parse(el.getAttribute('data-start') || '')
  if (isNaN(start)) return

  function pad(n) {
    return n < 10 ? '0' + n : String(n)
  }

  function tick() {
    var s = Math.max(0, Math.floor((Date.now() - start) / 1000))
    var d = Math.floor(s / 86400)
    var h = Math.floor((s % 86400) / 3600)
    var m = Math.floor((s % 3600) / 60)
    var sec = s % 60
    el.innerHTML =
      'Site up for <b>' + d + '</b>d <b>' + pad(h) + '</b>:<b>' + pad(m) + '</b>:<b>' + pad(sec) + '</b>'
  }

  tick()
  setInterval(tick, 1000)
})()