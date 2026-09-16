TARGETED ESPN ENDPOINT DIAGNOSTIC

Purpose:
Test whether the missing Stanford @ Duke game (ESPN event 401858231) is exposed through endpoints other than the general college-football scoreboard.

Endpoints tested:
1. Stanford team schedule (team id 24)
2. Duke team schedule (team id 150)
3. Site API v2 summary for event 401858231
4. Site API v3 summary for event 401858231
5. ESPN Core API event 401858231
6. ESPN CDN college-football game package for event 401858231

This build is diagnostic only. It does not change scoring, picks, matching, payouts, or static schedule times.

Interpretation:
- FOUND on a team schedule but missing from scoreboard = team schedule could be a targeted live-score source.
- FOUND on summary/CDN/core event = event-specific source may be usable for live score/status.
- NO on all = ESPN is likely not exposing this future event through these public endpoints yet, despite the public ESPN page existing.
