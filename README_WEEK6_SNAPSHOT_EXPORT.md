COMMISS POOL — WEEK 6 SNAPSHOT EXPORT BUILD

Purpose:
- Separate diagnostic/export build based on the supplied Week 6 Hero Counter Fix ZIP.
- Adds an Export Week 6 Snapshot (JSON) button.
- On click, refreshes ESPN scores and downloads a JSON capture of the current DATA, score map, entry picks/results, bonus status, historical Weeks 1–5, and computed 4–0 bounty winners.

Safety:
- This does not modify the live Vercel deployment or GitHub main by itself.
- It does not automatically lock/finalize Week 6.
- Before treating the export as final, verify that all expected Week 6 games are final and that HONK SHOE and YETI each receive $1,250.
- If ESPN fails to return all final scores, the export will disclose the final-game count and must not be treated as complete.
