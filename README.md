# Commiss Fantasy Football Pool — V2 Base

Mobile-first private pool web app.

## Current V2 additions
- Current Week remains the default landing view.
- Overall Leaderboard tab defaults to Season Total.
- Overall Leaderboard supports Season Total, First Half, Second Half, and individual weeks 1–18.
- Future weeks are disabled until they become active.
- Completed weeks can be marked/represented as Final/locked.
- Favorites: star entries and filter to starred friends. Favorites persist in the browser using localStorage.
- Individual entry detail remains available from leaderboards.
- Existing Bonus, Games, Distribution, and ESPN live-score functionality is preserved.

## Season architecture
- First Half = Weeks 1–9.
- Second Half = Weeks 10–18.
- The app treats the halves separately so rules such as the Bonus reset can be implemented cleanly.
- Payout/point logic is intentionally not included yet; it will be added from the official Commiss distribution.

## Historical data
The UI is ready to consume `POOL_DATA.history` when future weekly results are added. A history week should contain rows like:

```js
DATA.history = {
  1: [
    { id: 1, name: 'ENTRY NAME', w: 4, l: 0, bonus: 'alive' }
  ]
};
```

For the current live Week 1, the app temporarily derives the week from the live ESPN scores. Once Week 1 is finalized, its results should be embedded as locked historical data rather than relying on live scores.

## Local run
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080`.

## Deployment
The intended deployment is Vercel connected to the GitHub repository. Existing production URL remains unchanged when the repository is updated.
