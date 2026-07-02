# Gender Reveal 🎉

A simple, shareable gender reveal game built as a single-page static site for GitHub Pages.

## How It Works

1. **Creator** visits the site, picks the answer (Boy or Girl)
2. A shareable link is generated with the answer encoded in the URL hash (base64)
3. Creator shares the link via WhatsApp, Facebook, X, Instagram, or copy/paste
4. **Guesser** opens the link, picks their guess
5. The unchosen button is disabled, a 10-second countdown starts
6. Answer is revealed with confetti and correct/wrong feedback

## Tech Details

- **Zero dependencies** — single `index.html` file, no frameworks, no build step
- **100% client-side** — no server, no database, no backend
- **Answer encoding** — base64 with a suffix salt (`|genderreveal`) so it's not immediately obvious in the URL
- **Fonts** — Google Fonts (Poppins + Dancing Script)
- **Hosting** — GitHub Pages (free)

## Deployment

1. Push `index.html` to the `main` branch
2. Go to **Settings → Pages → Source: Deploy from branch → main / root**
3. Site goes live at `https://<username>.github.io/<repo-name>/`

## Customization

| What | Where | How |
|------|-------|-----|
| Countdown time | `let seconds = 10;` in `makeGuess()` | Change `10` to any number |
| Share message | `const shareText = "..."` | Edit the text |
| Colors | CSS variables `.btn-boy` / `.btn-girl` | Swap hex codes |
| Background | `body` gradient in CSS | Change gradient stops |
| Fonts | Google Fonts `<link>` in `<head>` | Swap font families |

## Privacy Note

The answer is encoded in base64 in the URL hash. This is **not encryption** — a tech-savvy person could decode it. It's just light obfuscation to prevent casual cheating. For most people sharing with friends/family, this is more than sufficient.

## License

MIT — do whatever you want with it.
