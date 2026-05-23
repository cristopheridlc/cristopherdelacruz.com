# Cristopher De La Cruz - Personal Website

Welcome! This is the repository for my personal landing page and static portfolio, engineered to be lightweight, extremely fast, 100% free, and highly secure.

Deployed live at: **[cristopherdelacruz.com](https://cristopherdelacruz.com)**

---

## 🚀 Tech Stack & Architecture

- **Core**: Vanilla HTML5, Vanilla CSS3 (with dynamic gradients and HSL variables), and Vanilla JavaScript (featuring custom 3D card tilt interactive animations).
- **Tab Layout**: Single-card "browser-like" tab system (`Home` | `Blog`) keeping navigation visual, centered, and immersive on all resolutions.
- **Blog Engine**: An ultra-fast, customized static blog compiler (`build-blog.js`) utilizing the `marked` library.
- **Local Tooling**: [Vite](https://vite.dev/) for instant, hot-reloading local development previewing.
- **Automated CI/CD**: [GitHub Actions](https://github.com/features/actions) for automatic markdown compilation and secure, direct-to-Pages hosting.
- **DNS & CDN**: [Cloudflare](https://www.cloudflare.com/) (providing dynamic edge caching, page optimization, strict TLS 1.3 encryption, and HSTS).

---

## 🛠️ Local Development

To run the site locally with hot-reloading:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *Note: This script automatically runs the blog compiler (`node build-blog.js`) before launching Vite, keeping your local list in sync!*

3. **Open in Browser**:
   Open the local address printed in the terminal (typically `http://localhost:5173`). Any edits to your HTML, CSS, JS, or Markdown will immediately hot-reload in the browser!

---

## 📝 Zero-Maintenance Publishing Flow

Committing compiled HTML files or compiling posts locally is not required. Writing a post is 100% automated:

1. **Create a Markdown file** inside `/posts/` (e.g. `posts/optimizing-snowflake.md`).
2. **Commit and Push** (or directly click **Commit Changes** using the GitHub.com web editor in the browser).
3. **GitHub Actions** automatically triggers, compiles the post to HTML, packages the assets, and deploys it live to the custom domain within 30 seconds.

### Post Layout & Smart Fallbacks
Writing posts is highly flexible and supports two configurations:
* **Using Front Matter (Recommended)**: Copy the copy-pasteable scaffold from `posts/template.md` containing a title, date, and description block at the top.
* **Omission Fallbacks (Plain Markdown)**: If the front matter is skipped entirely:
  - The compiler automatically extracts the first `# Heading` of the file as the article title.
  - The date automatically defaults to the current day.
  - The first standard text paragraph is automatically cleaned of markdown symbols, capped to 160 characters, and used as the SEO description preview snippet.

*Note: The `/blog/` output folder is entirely ignored in Git (`.gitignore`) to keep the source code clean of generated HTML clutter.*

---

## 🛡️ Security Hardening

This website is hardened following modern security best practices:

- **Strict Content Security Policy (CSP)**: Handled directly via `<meta>` tag in `index.html`. It completely disables inline styles and scripts, allowing only self-hosted resources, which effectively blocks XSS (Cross-Site Scripting) vectors.
- **Secure Referrals**: All external links utilize `rel="noopener noreferrer"` to protect browser state and prevent tab-nabbing or referrer leaks.
- **Cloudflare Edge Shield**: 
  - **Full (Strict) SSL/TLS**: Cloudflare encrypts all traffic end-to-end to GitHub Pages servers.
  - **HSTS (HTTP Strict Transport Security)**: Forces browsers to only connect via HTTPS.

---

## 📂 Project Structure

```
├── .github/workflows/
│   └── deploy.yml      # CI/CD automated Pages deploy pipeline
├── assets/             # Vector icons (GitHub, LinkedIn)
├── fonts/              # Custom variables and self-hosted fonts
├── posts/              # Your Markdown articles
│   ├── template.md     # Copy-paste scaffold for web writing
│   └── welcome-...md   # Test placeholder post
├── index.html          # Main HTML structure & browser tab header
├── style.css           # Vanilla CSS layout, tabs, and theme rules
├── script.js           # 3D interactive tilt micro-interactions
├── build-blog.js       # Ultra-fast static blog compiler script
├── resume.pdf          # Professional Resume
├── cristopher.jpg      # Profile photo
├── CNAME               # GitHub Pages custom domain routing
├── package.json        # Node local dev server dependencies
└── .gitignore          # Keeps the repository clean (ignores blog/)
```