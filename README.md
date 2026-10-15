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


Week 4 baseline created from supplied Week 4 Lines.pdf. See README_WEEK4_BASELINE.txt.

## Week 6 Picks Loaded
- Loaded picks from Week 6 Picks.pdf for all 136 entries.
- Four picks per entry; bonus picks loaded where supplied.
- Cross-referenced all 136 entry names against Week 5 Standings.pdf; no missing or unmatched names.
- Preserved Weeks 1–5 historical data, Week 6 lines, score feed architecture, and existing app files.


Historical correction: Week 1 California–Syracuse final score corrected to California 21, Syracuse 18. DOS BRENDANS Week 1 record corrected to 2–2 (cumulative wins 10); KELL & JACK Week 1 record corrected to 1–3 (cumulative wins 8).
