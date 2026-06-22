# leshipai.github.io

> Source code for my personal blog at **[blog.leshipai.dev](https://blog.leshipai.dev)**

A statically generated blog built with Hexo and deployed to GitHub Pages. Posts are written in Markdown and the site is automatically built and published via GitHub Actions on every push.

---

## 🛠️ Stack

| Layer | Technology |
|---|---|
| **Static Site Generator** | [Hexo](https://hexo.io/) v8 |
| **Theme** | [Minos](https://github.com/ppoffice/hexo-theme-minos) (customized) |
| **Templating** | EJS |
| **Styling** | Stylus / Sass (via `hexo-renderer-stylus` & `hexo-renderer-sass`) |
| **Content** | Markdown (via `hexo-renderer-marked`) |
| **Syntax Highlighting** | PrismJS |
| **Deployment** | `hexo-deployer-git` → GitHub Pages |
| **Runtime** | Node.js |

---

## 📁 Project Structure

```
.
├── source/             # Blog posts, pages, and static assets
│   ├── _posts/         # Markdown blog posts
│   ├── about/          # About page
│   └── categories/     # Categories index page
├── themes/
│   └── minos/          # Customized Minos theme
├── scaffolds/          # Post/page/draft templates
├── _config.yml         # Hexo site configuration
└── package.json
```

---

## ⚡ Local Development

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:4000)
npm run server

# Generate static files
npm run build

# Clean generated files
npm run clean
```

---

## 🚀 Deployment

The site deploys to GitHub Pages via the `hexo-deployer-git` plugin.

```bash
npm run deploy
```
