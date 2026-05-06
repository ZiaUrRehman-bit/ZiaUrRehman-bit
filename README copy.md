# Zia Ur Rehman — Personal Site

A modern, dark editorial-style personal website for academic research portfolios.

## 📁 Structure

```
.
├── index.html          # Main page
├── style.css           # All styles
├── script.js           # Interactions (cursor glow, scroll reveal, etc.)
├── assets/
│   ├── profile.png     # Your portrait
│   └── Zia_Ur_Rehman_CV.pdf   # Your downloadable CV
└── README.md
```

## 🚀 Deploy to GitHub Pages

### Option 1 — Using `username.github.io` (recommended)

1. Create a new GitHub repository named exactly: **`<your-username>.github.io`**
   (e.g. if your GitHub handle is `zia-ur-rehman`, name it `zia-ur-rehman.github.io`)
2. Upload all files (`index.html`, `style.css`, `script.js`, `assets/`) to the root of that repo.
3. Go to **Settings → Pages**.
4. Under **Source**, select branch `main` and folder `/ (root)`. Save.
5. Wait ~1 minute. Your site will be live at:
   `https://<your-username>.github.io`

### Option 2 — Using a project repo

1. Create any repo (e.g. `personal-site`).
2. Push the files.
3. **Settings → Pages → Source: `main` / `(root)`**.
4. Site will be at `https://<your-username>.github.io/personal-site/`.

## ✏️ Customize

- **Update social links** — open `index.html` and find the contact section. Replace the placeholder `https://github.com/`, `https://www.linkedin.com/`, and `https://scholar.google.com/` URLs with your real profile URLs.
- **Update project URLs** — same pattern. Each `.proj-card` has an `href` you can replace with the actual GitHub / PyPI link.
- **Change accent color** — open `style.css`, find `:root`, and change `--accent: #d4ff3a;` to any color you like (try `#ff7a59` for warm coral or `#7ee0c1` for mint).
- **Edit text** — every section in `index.html` is plainly labeled with HTML comments.

## 🎨 Design notes

- **Typography**: Fraunces (serif display), Inter Tight (sans body), JetBrains Mono (code/labels).
- **Theme**: refined dark editorial with electric chartreuse accent.
- **Motion**: cursor glow, scroll-triggered reveals, marquee, hover micro-interactions, and `prefers-reduced-motion` respected.

## 📜 License

Personal use. Feel free to adapt.
