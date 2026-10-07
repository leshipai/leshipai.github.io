/**
 * Registers the smooth-corners paint worklet.
 * The worklet itself lives in /js/vendor/smooth-corners.js and is only
 * ever evaluated inside the paint worklet context (that is where
 * registerPaint exists), so it is not linked from the page.
 */
(function () {
  if (typeof CSS === 'undefined' || !('paintWorklet' in CSS)) return
  CSS.paintWorklet.addModule('/js/vendor/smooth-corners.js').catch(function () {})
})()
