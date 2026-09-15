# Commiss Pool — Week 2 Live Feed v7

Surgical live-feed fix based on v6.

## What changed
- Week 2 scoring, game data, payouts, Week 1 history, and UI are unchanged.
- Browser-side ESPN requests are now routed through `/api/espn` on Vercel.
- NFL and college feeds remain independent.
- College uses ESPN FBS group 80.
- Existing matched scores/times are preserved through transient failures.

The key diagnostic from v6 was 16/73: the 16 NFL games were matching while all 57 NCAA games were not. That points to the browser-side college ESPN request failing rather than a team-matching problem.
