# VEIL public site

Customer-facing marketing site for **VEIL** — removable landscape wraps for aboveground ASME propane tanks.

Trade style: **VEIL by EFE**  
IP title: **Micah Kleinert** (not assigned unless a separate writing says so)

This is static HTML/CSS/JS. No build step. No live SMS.

## Pages

| File | Role |
|---|---|
| `index.html` | Home — hero, offer, sizes, navigator/composer CTAs |
| `navigator.html` | Wrap Navigator — size / pattern / setting + bare vs wrapped |
| `composer.html` | Location Composer — local photo + place tank + wrap |
| `how-it-works.html` | What it is / isn’t, non-insulating distinction vs US 7,731,052 |
| `products.html` | Sleeve / Magnet / Cast Film ladder, locked 500-gal prices |
| `patterns.html` | Six light-value patterns |
| `safety.html` | PRV, fill, gauge, data plate stay clear |
| `inquire.html` | FAQ + lead form (name, phone, address, tank size, notes) |

## Assets in `/assets`

- `hero-before.jpg` / `hero-after.jpg` — concept photography (generated stand-ins until field photos exist)
- `pattern-*.jpg` — Birch Woodland, Limestone, Barn Silver, Prairie Grass, Winter Birch, Fieldstone
- `safety-access.jpg` — dome-flap concept
- `favicon.svg`
- `wordmark.jpg` (optional print-style mark; nav uses live type)

Replace concept photos with real Northern Michigan installs when the pilot tanks are wrapped.

## Locked numbers used on the site

- Sleeve ~$389 (kit ~$145) on 500-gal
- Magnet ~$649 on 500-gal
- Cast Film ~$895 special order on 500-gal
- Other sizes (120 V/H, 250, 325, 850, 1000): quote only
- No other prices invented
- Patent line uses the token `[PATENT NUMBER]` until Micah pastes the real number
- Composer photos stay in the visitor’s browser (no server upload)

## IP footer templates

**Pre-filing (what the site ships with now)**

> VEIL by EFE is a trade style. Product intellectual property is held by Micah Kleinert and is not assigned unless a separate written assignment says otherwise. IP filing in process. Not patented. App. No. [to be inserted from USPTO receipt]. VEIL is visual / weather screening only — not insulation, not a fire enclosure, and not a modification of the tank.

**Post-filing (only after a real App. No. is in hand)**

> VEIL by EFE is a trade style. Product intellectual property is held by Micah Kleinert and is not assigned unless a separate written assignment says otherwise. U.S. Patent pending, App. No. [INSERT FROM USPTO RECEIPT]. Not patented. VEIL is visual / weather screening only — not insulation, not a fire enclosure, and not a modification of the tank.

Search `data-ip-line` in the HTML footer (all six pages) and replace the paragraph once.

## Wire the inquiry form

The form always saves a copy to `localStorage` key `veil-inquiries`.

Then pick one:

1. **Mailto** — on `inquire.html`, set  
   `data-email="you@yourdomain.com"`  
   on the `<form data-inquire>` tag.
2. **Formspree / similar** — create a form, then set  
   `data-endpoint="https://formspree.io/f/xxxxxxxx"`  
   on the same tag.

Leave both blank and the page still confirms on-device (useful for demos).

No live SMS is attached.

## Deploy — GitHub Pages

1. Create a public repo, e.g. `mwkleinert-glitch/veil-site`.
2. Upload the contents of this folder to the repo root (`index.html` must sit at `/`, not inside a subfolder).
3. GitHub → Settings → Pages → Deploy from branch `main` / `/ (root)`.
4. Site URL will be `https://mwkleinert-glitch.github.io/veil-site/`  
   If the repo is named `<user>.github.io`, it will be the root domain.
5. Optional custom domain: add a `CNAME` file with `veil.example.com` and point DNS.

## Deploy — Vercel

```bash
npm i -g vercel
cd veil-site
vercel
```

Framework preset: Other. Output: the folder itself. No build command.

## Local preview

```bash
cd veil-site
python3 -m http.server 4173
```

Open http://127.0.0.1:4173/

## Market-language note

National / regional tank covers already exist (fabric jackets, faux-rock shells, etc.). The site does **not** say “first in the United States” or “first in Michigan.” It says we are not aware of another **Northern Michigan propane operator** offering this kind of removable landscape wrap with service access designed in.
