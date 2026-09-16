# Commiss Pool — Week 2 Original Live Feed Build

This build keeps the current Week 2 app/data/UI and restores the original simple live-score architecture.

Live feed:
- Direct ESPN NFL scoreboard endpoint
- Direct ESPN College Football scoreboard endpoint
- One current-week date range derived from the games in data.js
- Team-to-team matching against the pool games
- Automatic refresh every 30 seconds
- No NCAA team catalog
- No per-team NCAA schedule fallback

The static Week 1 history remains in data.js.
