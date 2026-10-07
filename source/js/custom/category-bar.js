/**
 * Homepage category chip bar:
 *  - chips filter the post list in place (no navigation)
 *  - active chip is kept in sync with what is shown
 *  - overflow fade + mouse drag scrolling
 * Markup: themes/butterfly/layout/includes/custom/category-bar.pug
 * Styles: section 5 of source/css/custom.styl
 */
(function () {
  var bar = document.getElementById('category-bar')
  if (!bar) return

  var strip = bar.querySelector('.category-bar-items')
  if (!strip) return

  function norm(path) {
    path = path || '/'
    try {
      path = new URL(path, location.origin).pathname
    } catch (e) {
      /* keep the raw href */
    }
    path = path.replace(/\/index\.html$/, '/').replace(/index\.html$/, '/')
    if (path.length > 1 && path.slice(-1) !== '/') path += '/'
    try {
      path = decodeURIComponent(path)
    } catch (e) {
      /* leave it encoded */
    }
    return path
  }

  var chips = []
  var chipEls = bar.querySelectorAll('.category-bar-item')
  for (var i = 0; i < chipEls.length; i++) {
    var link = chipEls[i].querySelector('a')
    if (!link) continue
    chips.push({ el: chipEls[i], path: norm(link.getAttribute('href')) })
  }

  var posts = document.querySelectorAll('#recent-posts .recent-post-item')
  var container = document.querySelector('#recent-posts .recent-post-items') || (posts[0] && posts[0].parentNode)
  var pagination = document.getElementById('pagination')

  var empty = document.createElement('div')
  empty.className = 'category-bar-empty'
  empty.textContent = 'No posts in this category yet.'
  empty.style.display = 'none'
  if (container) container.appendChild(empty)

  function categoriesOf(post) {
    var links = post.querySelectorAll('.article-meta__categories')
    var out = []
    for (var i = 0; i < links.length; i++) out.push(norm(links[i].getAttribute('href')))
    return out
  }

  function setActive(path) {
    for (var i = 0; i < chips.length; i++) {
      chips[i].el.classList.toggle('is-active', chips[i].path === path)
    }
  }

  function applyFilter(path) {
    var showAll = path === '/'
    var visible = 0

    for (var i = 0; i < posts.length; i++) {
      var show = showAll
      if (!show) {
        var cats = categoriesOf(posts[i])
        for (var j = 0; j < cats.length; j++) {
          if (cats[j] === path) {
            show = true
            break
          }
        }
      }
      posts[i].style.display = show ? '' : 'none'
      if (show) visible++
    }

    if (empty) empty.style.display = visible > 0 ? 'none' : ''
    if (pagination) pagination.style.display = showAll ? '' : 'none'
    setActive(path)
  }

  // Deep link: /categories/Blogging/ loads the bar with that chip active
  // and the list pre-filtered.
  var here = norm(location.pathname)
  var initial = '/'
  for (var k = 0; k < chips.length; k++) {
    if (chips[k].path === here) initial = chips[k].path
  }
  applyFilter(initial)

  function checkOverflow() {
    var overflow = strip.scrollWidth - strip.clientWidth
    var atEnd = overflow <= 4 || strip.scrollLeft >= overflow - 4
    bar.classList.toggle('has-overflow', overflow > 4 && !atEnd)
  }

  strip.addEventListener('scroll', checkOverflow, { passive: true })
  window.addEventListener('resize', checkOverflow)
  checkOverflow()

  // Mouse drag to scroll the strip. Capture only engages after the pointer
  // has moved a few pixels: capturing straight from pointerdown retargets
  // the compatibility click event to the strip, which would make the chips
  // unclickable.
  var pointerDown = false
  var dragging = false
  var moved = false
  var startX = 0
  var startLeft = 0

  strip.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return
    pointerDown = true
    dragging = false
    moved = false
    startX = e.clientX
    startLeft = strip.scrollLeft
  })

  strip.addEventListener('pointermove', function (e) {
    if (!pointerDown) return
    if (!dragging) {
      if (Math.abs(e.clientX - startX) < 5) return
      dragging = true
      try {
        strip.setPointerCapture(e.pointerId)
      } catch (err) {
        /* capture is best-effort */
      }
    }
    moved = true
    strip.scrollLeft = startLeft - (e.clientX - startX)
  })

  function stopDrag() {
    pointerDown = false
    dragging = false
  }

  strip.addEventListener('pointerup', stopDrag)
  strip.addEventListener('pointercancel', stopDrag)

  strip.addEventListener('click', function (e) {
    // A drag ended on a chip: swallow the click, do not filter.
    if (moved) {
      moved = false
      e.preventDefault()
      return
    }

    var anchor = e.target && e.target.closest ? e.target.closest('.category-bar-item a') : null
    if (!anchor) return

    e.preventDefault()
    applyFilter(norm(anchor.getAttribute('href')))
    checkOverflow()
  })
})()