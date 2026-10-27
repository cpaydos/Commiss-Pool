COMMISS POOL — WEEK 8 BUILD
Baseline: Commiss-Pool-Week7-LOCKED-HISTORY(1).zip
Active week: 8
Games: 66 total (14 NFL, 52 NCAA)
Bonus Max: 2
Rules:
- Team listed on the left of the source lines is the favorite.
- Capitalized team name is the home team.
- Weeks 1–7 historical records were retained from the locked baseline.
- Week 8 picks are not loaded yet.
- Bye teams: Saints, Giants, 49ers, Texans.

REVIEW NOTE:
The PDF text extraction did not identify an all-caps team for Notre Dame away / Navy home.
That matchup is flagged in data.js validation for visual verification before picks are loaded.


## Cache update
The service-worker cache key was bumped to `commiss-shell-v20-week8-bonus-2` so browsers should fetch the Week 8 app shell and data instead of reusing the Week 7 cache. Redeploy this ZIP to Vercel; on iPhone, if the old screen remains, close the site tab and reopen after deployment (or clear Safari website data for commiss-pool.vercel.app).


## Repaired Week 8 conversion
This repair updates the static heading and app current-week logic to Week 8, sets the active bonus maximum to 2, clears Week 7 picks from the active entries so Week 8 starts with picks not loaded, and preserves the Week 1–7 history object. Week 7 bonus view reads its frozen historical entries.
