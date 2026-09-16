COMMISS POOL — TARGETED ESPN DATA-FIELDS DIAGNOSTIC

This is diagnostic-only. It does NOT change scoring, matching, payouts, or static kickoff times.

It tests the known missing Stanford @ Duke game (ESPN event 401858231) through:
- Stanford team schedule
- Duke team schedule
- ESPN Site API v2 summary
- ESPN Site API v3 summary
- ESPN Core event endpoint
- ESPN CDN game package

It also tests Syracuse @ Pittsburgh (event 401858225) as a control through the Site API v2 summary.

The diagnostic attempts to extract:
- event ID / matchup
- scheduled date/time
- status
- period and clock when present
- both team names and scores

If Stanford-Duke returns those fields through a targeted endpoint, the next step is to adapt the live feed to use that targeted data source while leaving all scoring/matching logic intact.
