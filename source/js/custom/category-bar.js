/**
 * Homepage hierarchical category chip bar:
 *  - top row: Home + root categories; picking a root with children reveals
 *    a second row of subcategory chips
 *  - chips filter the post list in place (no navigation)
 *  - active chip is kept in sync with what is shown
 *  - overflow fade + mouse drag scrolling
 * Markup: themes/butterfly/layout/includes/mixins/indexPostUI.pug
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
    chips.push({
      el: chipEls[i],
      path: norm(link.getAttribute('href')),
      isRoot: chipEls[i].classList.contains('is-root'),
      // Sub chips remember which root they hang under, so the root chip can
      // light up when one of its children is selected.
      parentPath: null
    })
  }

  for (var r = 0; r < chips.length; r++) {
    if (chips[r].isRoot) continue
    var group = chips[r].el.closest('.category-bar-subgroup')
    chips[r].parentPath = group ? norm(group.getAttribute('data-parent')) : null
  }

  var subgroups = bar.querySelectorAll('.category-bar-subgroup')

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
    // Which root (if any) should its sub row stay open for.
    var activeRoot = null

    for (var i = 0; i < chips.length; i++) {
      var chip = chips[i]
      var on = chip.path === path

      // A root chip is also "on" when a descendant of it is selected.
      // Home ('/') is excluded: every path starts with '/', so it would
      // otherwise light up for every category.
      if (!on && chip.isRoot && chip.path !== '/' && path.indexOf(chip.path) === 0) {
        on = true
      }
      if (on && chip.isRoot && chip.path !== '/') activeRoot = chip.path

      chip.el.classList.toggle('is-active', on)
    }

    // Selecting a sub chip lights up the root that owns it.
    if (path !== '/') {
      for (var j = 0; j < chips.length; j++) {
        if (chips[j].parentPath !== path) continue
        for (var k = 0; k < chips.length; k++) {
          if (chips[k].isRoot && chips[k].path === chips[j].parentPath) {
            chips[k].el.classList.add('is-active')
          }
        }
        break
      }
    }

    return activeRoot
  }

  // Show the sub chip row that belongs to the given root path (or none).
  function showSubgroup(rootPath) {
    for (var i = 0; i < subgroups.length; i++) {
      var match = rootPath && norm(subgroups[i].getAttribute('data-parent')) === rootPath
      if (match) subgroups[i].removeAttribute('hidden')
      else subgroups[i].setAttribute('hidden', '')
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
    var activeRoot = setActive(path)
    // Keep the sub row open while a sub chip (or its root) is selected.
    showSubgroup(path === '/' ? null : activeRoot || path)
    return activeRoot
  }

  // Deep link: /categories/Web/ loads the bar with that chip active, the
  // list pre-filtered, and the Web sub row open.
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

  // How many posts *rendered on this page* belong to a category.
  function countMatches(path) {
    if (path === '/') return posts.length
    var n = 0
    for (var i = 0; i < posts.length; i++) {
      var cats = categoriesOf(posts[i])
      for (var j = 0; j < cats.length; j++) {
        if (cats[j] === path) {
          n++
          break
        }
      }
    }
    return n
  }

  // Clicks land on the strip for both rows: sub chips live in a sibling
  // container, so listen on the whole bar.
  bar.addEventListener('click', function (e) {
    var anchor = e.target && e.target.closest ? e.target.closest('.category-bar-item a') : null
    if (!anchor) return

    // A drag ended on a chip: swallow the click, do not filter.
    if (moved) {
      moved = false
      e.preventDefault()
      return
    }

    var path = norm(anchor.getAttribute('href'))

    // In-place filtering only searches the posts rendered on this page.
    // If the category's posts live behind pagination (or we are on a
    // paginated page and hit Home), fall through to the real link so the
    // full category page loads instead of showing an empty list.
    if (path === '/' && norm(location.pathname) !== '/') return
    if (path !== '/' && countMatches(path) === 0) return

    e.preventDefault()
    applyFilter(path)
    checkOverflow()
  })
})()
