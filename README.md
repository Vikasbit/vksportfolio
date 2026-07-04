# Vikas Kumar Prajapati — Game Portfolio

Retro CRT/arcade-themed personal portfolio. Plain HTML/CSS/JS — no build step, no dependencies, no framework.

## Structure
```
.
├── index.html     # markup
├── styles.css     # all styling (CRT theme, layout, animations)
├── script.js      # interactivity (nav highlight, typewriter, cartridge-insert animation)
├── vercel.json    # zero-config static deploy settings
└── README.md
```

## Run locally
Just open `index.html` in a browser, or serve it:
```bash
npx serve .
```

## Deploy
Static site — works on Vercel, GitHub Pages, Netlify with zero config. Push the folder to a GitHub repo and import it directly on Vercel; no build command or output directory needs to be set.
