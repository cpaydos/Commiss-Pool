# Commiss Pool — Week 1 MVP

Mobile-first web app for the 2026 pool using the supplied Week 1 lines and Week 1 picks.

## Included
- 137 entries
- 548 regular picks + 137 Bonus picks
- Week 1 official lines
- Push = loss scoring
- Spread + Over/Under scoring
- Bonus = outright win; tie/loss eliminates
- Commissioner auto-pick flag for entries 58 and 104 based on red selections in the supplied PDF
- Live NFL/NCAA score refresh via ESPN's public scoreboard endpoints
- Search/filter leaderboard
- Entry detail view
- Bonus leaderboard
- Games view
- Local Test Mode for entering temporary final scores before sharing the app

## Important Week 1 line interpretation
The commissioner's sheet uses capitalization to identify the HOME team. The numeric spread is the line attached to the first team in the sheet (e.g. `JAGUARS 7.5 Browns` is Jaguars -7.5 / Browns +7.5). The app stores that locked line and never replaces it with a moving sportsbook line.

## Test locally
From this folder, run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

For iPhone testing, deploy this folder as a static site (GitHub Pages, Netlify, Vercel, etc.). The app itself has no server-side requirements.

## Score feed
The MVP uses ESPN's scoreboard endpoint because it does not require an API key. A future production version should move score fetching behind a small serverless proxy so the data source can be swapped without changing the app.

## Next build items
- Import the commissioner's PDFs instead of embedding Week 1 data
- Add the season/half point-dollar distribution
- Add Week 2+ setup
- Add permanent database/auth if the group wants shared access
- Add final-score verification workflow against the commissioner's finalized sheet
