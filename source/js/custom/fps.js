/**
 * Frames-per-second readout for #fps-box and the control center.
 */
(function () {
  var out = document.querySelector('#fps-box .fps-text')
  var consoleOut = document.getElementById('console-fps')
  if (!out && !consoleOut) return

  var frames = 0
  var last = performance.now()

  function loop(now) {
    frames++
    if (now - last >= 1000) {
      var fps = Math.round((frames * 1000) / (now - last))
      if (out) out.textContent = String(fps)
      if (consoleOut) consoleOut.textContent = fps + ' FPS'
      frames = 0
      last = now
    }
    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
})()
