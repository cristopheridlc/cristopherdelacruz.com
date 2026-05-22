# Cristopher De La Cruz - Personal Website

Welcome! This is the repository for my personal landing page and portfolio, keeping things clean, extremely fast, and highly secure.

Deployed live at: **[cristopherdelacruz.com](https://cristopherdelacruz.com)**

---

## 🚀 Tech Stack

- **Core**: Vanilla HTML5, Vanilla CSS3 (with dynamic gradients and media queries), and Vanilla JavaScript (featuring custom 3D card tilt interactive animations).
- **Local Dev Server**: [Vite](https://vite.dev/) for instant, hot-reloading development previewing.
- **Deployment**: [GitHub Pages](https://pages.github.com/) (100% free static hosting).
- **DNS & CDN**: [Cloudflare](https://www.cloudflare.com/) (providing dynamic edge caching, page optimization, and SSL/TLS protection).

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

3. **Open in Browser**:
   Open the local address printed in the terminal (typically `http://localhost:5173`). Any edits to your HTML, CSS, or JS will immediately hot-reload in the browser!

---

## 🛡️ Security Architecture

This website is hardened following modern security best practices:

- **Strict Content Security Policy (CSP)**: Handled directly via `<meta>` tag in `index.html`. It completely disables inline styles and scripts, allowing only self-hosted resources, which effectively blocks XSS (Cross-Site Scripting) vectors.
- **Secure Referrals**: All external links utilize `rel="noopener noreferrer"` to protect browser state and prevent tab-nabbing or referrer leaks.
- **Cloudflare Shield**: 
  - **Full (Strict) SSL/TLS**: Cloudflare encrypts all traffic end-to-end to GitHub Pages servers.
  - **HSTS (HTTP Strict Transport Security)**: Forces browsers to only connect via HTTPS.

---

## 📂 Project Structure

```
├── assets/             # Vector icons (GitHub, LinkedIn)
├── fonts/              # Custom variables and self-hosted fonts
├── index.html          # Main HTML structure & security headers
├── style.css           # Vanilla CSS layout, transitions, and theme
├── script.js           # 3D interactive tilt micro-interactions
├── resume.pdf          # Professional Resume
├── cristopher.jpg      # Profile photo
├── CNAME               # GitHub Pages custom domain routing
├── package.json        # Node local dev server dependencies
└── .gitignore          # Keeps the repository clean of OS/IDE junk
```