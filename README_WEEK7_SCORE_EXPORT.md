# Week 7 one-click score export

This is a separate working copy of `Commiss-Pool-Week7-BONUS-10-ALIVE.zip`. It adds an **Export scores** button next to Refresh Scores. The button downloads one JSON file containing the Week 7 game list, the currently loaded ESPN score/status values, export timestamp, and the existing pool data so the export can be reconciled safely.

## How to capture Week 7
1. Open this copy of the app in a browser with internet access.
2. Click **Refresh scores** and wait for the live-feed status to finish updating.
3. Confirm the status reports all expected games matched, and ideally `66/66` final.
4. Click **Export scores** once. It downloads `Commiss-Pool-Week7-SCORE-EXPORT.json`.
5. Upload that single JSON file to the build conversation. Do not replace the original ZIP.

If fewer than all 66 games are marked final, the export still works but the status indicates the count; do not treat it as a verified lock until unmatched/non-final games are reconciled.

This change does not modify the live/deployed app, does not freeze the week, and does not alter historical weeks or payouts. It only adds a local export control to this copy.
