'use strict';

/**
 * Homepage hierarchical category chip bar.
 *
 * This lives in the SITE repo (scripts/), not in themes/butterfly, because
 * the theme is a git submodule pinned to the upstream
 * jerryc127/hexo-theme-butterfly: any edit made inside themes/ is local-only
 * and never reaches CI (which checks out `submodules: true` at the pinned
 * commit). Hexo loads scripts/*.js at build time, so this runs in CI too.
 *
 * It injects the bar markup right after <div id="recent-posts"> via the
 * after_render:html filter, built from Hexo's own category tree (including
 * parent/child links from nested front-matter like `- [Web, SSRF]`).
 *
 * Behaviour (filtering, sub-row toggling, drag-scroll) is handled by
 * source/js/custom/category-bar.js; styles are in source/css/custom.styl.
 */

const escapeHtml = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function buildBar(hexo) {
  const config = hexo.config;
  const categories = hexo.locals.get('categories');
  if (!categories || !categories.length) return '';

  const urlFor = hexo.extend.helper.get('url_for').bind(hexo);
  const root = config.root || '/';

  // Build the tree from Hexo's Category.parent field.
  const byId = {};
  const roots = [];
  categories.toArray().forEach(cat => {
    byId[cat._id] = { name: cat.name, path: urlFor(cat.path), children: [] };
  });
  categories.toArray().forEach(cat => {
    const node = byId[cat._id];
    const parent = cat.parent && byId[cat.parent];
    if (parent) parent.children.push(node);
    else roots.push(node);
  });

  const byName = (a, b) => a.name.localeCompare(b.name);
  roots.sort(byName);
  roots.forEach(node => node.children.sort(byName));

  const rootHtml = roots
    .map(node => {
      const caret = node.children.length
        ? '\n            <i class="fa-solid fa-angle-down category-bar-caret"></i>'
        : '';
      const dataChildren = node.children.length ? ' data-children="1"' : '';
      return `          <div class="category-bar-item is-root" data-path="${escapeHtml(
        node.path
      )}"${dataChildren}>
            <a href="${escapeHtml(node.path)}">${escapeHtml(node.name)}</a>${caret}
          </div>`;
    })
    .join('\n');

  const subGroups = roots
    .filter(node => node.children.length)
    .map(node => {
      const chips = node.children
        .map(
          child => `                <div class="category-bar-item is-sub" data-path="${escapeHtml(
            child.path
          )}">
                  <a href="${escapeHtml(child.path)}">${escapeHtml(child.name)}</a>
                </div>`
        )
        .join('\n');
      return `              <div class="category-bar-subgroup" data-parent="${escapeHtml(
        node.path
      )}" hidden>
                <div class="category-bar-subgroup-label">${escapeHtml(node.name)}</div>
${chips}
              </div>`;
    })
    .join('\n');

  return `        <div id="category-bar">
          <div class="category-bar-items">
            <div class="category-bar-item is-root" id="home-chip" style="order:-2">
              <a href="${escapeHtml(root)}">Home</a>
            </div>
${rootHtml}
          </div>
          <div class="category-bar-sub">
${subGroups}
          </div>
          <a class="category-bar-more" onclick="void(0)" aria-hidden="true"><i class="fa-solid fa-angles-right"></i></a>
        </div>
`;
}

hexo.extend.filter.register('after_render:html', function (str, data) {
  // Homepage only, and only if the theme actually rendered the post list.
  if (!data || data.path !== 'index.html') return str;
  if (str.indexOf('id="category-bar"') !== -1) return str;

  const bar = buildBar(this);
  if (!bar) return str;

  // Attribute order varies (theme emits class before id), so match the div
  // carrying id="recent-posts" in any attribute order.
  const opening = /<div\b[^>]*\bid="recent-posts"[^>]*>/.exec(str);
  if (!opening) return str;

  const at = str.indexOf(opening[0]) + opening[0].length;
  return str.slice(0, at) + `\n${bar}` + str.slice(at);
});
